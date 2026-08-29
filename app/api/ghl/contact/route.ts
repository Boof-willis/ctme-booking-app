import { NextRequest, NextResponse } from 'next/server';
import { createOrUpdateContact, updateContact, addContactTags } from '@/lib/ghl';
import { isValidEmail, sanitize, isHoneypotFilled } from '@/lib/validation';
// Full metadata: validates area-code patterns, not just digit counts. Server-only
// so the ~150KB metadata never ships to the browser (the client uses /min).
import { isValidPhoneNumber } from 'libphonenumber-js/max';
import { UTMParams, LeadPath } from '@/types/survey';
import { isQualified } from '@/lib/qualification';
import { GAINS_BRACKETS, PORTFOLIO_BRACKETS, TRANSACTION_BRACKETS } from '@/lib/constants';

/** Only accept bracket strings we actually render; anything else is dropped. */
function pickBracket<T extends string>(value: unknown, allowed: readonly T[]): T | undefined {
  return typeof value === 'string' && (allowed as readonly string[]).includes(value) ? (value as T) : undefined;
}

/* eslint-disable @typescript-eslint/no-explicit-any */

const rateLimit = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimit.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + 60_000 });
    return true;
  }

  if (entry.count >= 30) return false;
  entry.count++;
  return true;
}

function getIP(req: NextRequest): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
}

/**
 * Ad-platform tags derived from tracking params. Click IDs are definitive
 * (gclid = Google Ads, fbclid = Meta); placement / site_source_name are
 * Meta-only URL macros; utm_source catches templates without a click ID.
 */
function adPlatformTags(utm: UTMParams): string[] {
  const tags: string[] = [];
  const source = (utm.utm_source || '').toLowerCase();

  if (utm.gclid || source.includes('google')) {
    tags.push('google ads');
  }
  if (
    utm.fbclid ||
    utm.placement ||
    utm.site_source_name ||
    ['facebook', 'meta', 'instagram', 'fb', 'ig'].some((s) => source.includes(s))
  ) {
    tags.push('meta ads');
  }

  return tags;
}

/** E.164 string ("+61412345678") whose number is valid for its dial code's country. */
function isValidPhone(phone: string): boolean {
  if (!phone.startsWith('+')) return false;
  try {
    return isValidPhoneNumber(phone);
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  const ip = getIP(req);
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  try {
    const body = await req.json();
    const { firstName, lastName, email, phone, surveyData, tag } = body;

    const qualifier = {
      gainsBracket: pickBracket(surveyData?.gainsBracket, GAINS_BRACKETS),
      portfolioBracket: pickBracket(surveyData?.portfolioBracket, PORTFOLIO_BRACKETS),
      transactionBracket: pickBracket(surveyData?.transactionBracket, TRANSACTION_BRACKETS),
    };
    if (!qualifier.gainsBracket || !qualifier.portfolioBracket || !qualifier.transactionBracket) {
      return NextResponse.json({ error: 'Qualifier answers are required' }, { status: 400 });
    }

    // The path is derived from the brackets, never from the client: qualified
    // leads get the call workflow, everyone else gets the quote workflow. This
    // guarantees exactly one of `high value` / `low value` per submission.
    const qualified = isQualified(qualifier);
    const leadPath: LeadPath = qualified ? 'call' : 'quote';

    const tagList: string[] = [];
    if (tag && typeof tag === 'string') tagList.push(sanitize(tag));
    // Descriptive tags (permanent record of the path) + workflow-trigger tags.
    tagList.push(qualified ? 'qualified' : 'quote-requested');
    tagList.push(qualified ? 'high value' : 'low value');
    tagList.push(...adPlatformTags(surveyData?.utmParams || {}));

    if (!firstName || typeof firstName !== 'string' || firstName.trim().length === 0) {
      return NextResponse.json({ error: 'First name is required' }, { status: 400 });
    }
    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }
    if (phone && (typeof phone !== 'string' || !isValidPhone(phone))) {
      return NextResponse.json(
        { error: 'Please enter a valid phone number for your country' },
        { status: 400 }
      );
    }

    if (isHoneypotFilled(body.honeypot)) {
      return NextResponse.json({ contactId: 'ok' }, { status: 200 });
    }

    const result = await createOrUpdateContact({
      firstName: sanitize(firstName),
      lastName: lastName ? sanitize(lastName) : undefined,
      email: sanitize(email),
      phone: phone ? sanitize(phone) : undefined,
      ...qualifier,
      taxYears: surveyData?.taxYears || [],
      blockchains: surveyData?.blockchains || [],
      hasTaxSoftware: surveyData?.hasTaxSoftware,
      taxSoftwareName: surveyData?.taxSoftwareName,
      agreedToTos: surveyData?.agreedToTos ?? false,
      country: surveyData?.country,
      otherCountryName: surveyData?.otherCountryName,
      otherCountryCode: surveyData?.otherCountryCode,
      utmParams: surveyData?.utmParams || {},
    });

    const contactId =
      (result as any)?.contact?.id ??
      (result as any)?.id ??
      (result as any)?.contactId;
    if (!contactId) {
      console.error('GHL contact response missing ID:', JSON.stringify(result));
      return NextResponse.json({ error: 'Unexpected response from booking system' }, { status: 502 });
    }

    // Tags go through the additive endpoint rather than the upsert body, so a
    // resubmission never strips tags that workflows added (sms eligible, etc).
    await addContactTags(contactId, tagList);

    // Hand the lead to the matching GHL workflow. The inbound-webhook trigger
    // gives the workflow the full payload as {{inboundWebhookRequest.*}}.
    const webhookUrl =
      leadPath === 'call' ? process.env.GHL_WEBHOOK_CALL_LEAD : process.env.GHL_WEBHOOK_QUOTE_LEAD;
    if (!webhookUrl) {
      console.error(`GHL webhook URL for ${leadPath} path is not configured`);
    } else {
      const payload = {
        contactId,
        firstName: sanitize(firstName),
        lastName: lastName ? sanitize(lastName) : undefined,
        email: sanitize(email),
        phone: phone ? sanitize(phone) : undefined,
        country: surveyData?.country,
        otherCountryName: surveyData?.otherCountryName,
        otherCountryCode: surveyData?.otherCountryCode,
        taxYears: surveyData?.taxYears || [],
        blockchains: surveyData?.blockchains || [],
        hasTaxSoftware: surveyData?.hasTaxSoftware,
        taxSoftwareName: surveyData?.taxSoftwareName,
        agreedToTos: surveyData?.agreedToTos ?? false,
        utmParams: surveyData?.utmParams || {},
        ockno_id: surveyData?.utmParams?.ockno_id,
        tags: tagList,
        leadPath,
        qualified,
        gainsBracket: qualifier.gainsBracket,
        portfolioBracket: qualifier.portfolioBracket,
        transactionBracket: qualifier.transactionBracket,
      };
      try {
        const hook = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        console.log(`GHL ${leadPath} webhook response:`, hook.status, (await hook.text()).slice(0, 200));
      } catch (err) {
        console.error(`GHL ${leadPath} webhook fire failed:`, err);
      }
    }

    return NextResponse.json({ contactId });
  } catch (err) {
    console.error('GHL contact creation error:', err);
    return NextResponse.json({ error: 'Unable to process request' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const ip = getIP(req);
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  try {
    const body = await req.json();
    const { contactId, lastName, email, phone, utmParams } = body;

    if (!contactId || typeof contactId !== 'string') {
      return NextResponse.json({ error: 'Contact ID is required' }, { status: 400 });
    }

    const updates: { lastName?: string; email?: string; phone?: string; utmParams?: UTMParams } = {};
    if (lastName && typeof lastName === 'string') updates.lastName = sanitize(lastName);
    if (email) {
      if (typeof email !== 'string' || !isValidEmail(email.trim())) {
        return NextResponse.json(
          { error: 'Please enter a valid email address' },
          { status: 400 }
        );
      }
      updates.email = sanitize(email);
    }
    if (phone) {
      if (typeof phone !== 'string' || !isValidPhone(phone)) {
        return NextResponse.json(
          { error: 'Please enter a valid phone number for your country' },
          { status: 400 }
        );
      }
      updates.phone = sanitize(phone);
    }
    if (utmParams && typeof utmParams === 'object') updates.utmParams = utmParams;

    await updateContact(contactId, updates);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('GHL contact update error:', err);
    return NextResponse.json({ error: 'Unable to process request' }, { status: 500 });
  }
}

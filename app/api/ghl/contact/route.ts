import { NextRequest, NextResponse } from 'next/server';
import { createOrUpdateContact, updateContact } from '@/lib/ghl';
import { isValidEmail, sanitize, isHoneypotFilled } from '@/lib/validation';

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

const STANDARD_COUNTRIES = ['Australia', 'Canada', 'New Zealand', 'UK', 'USA'];

function computeComplexityScore(
  taxYears: string[],
  blockchains: string[],
  hasTaxSoftware: boolean,
  country: string,
): number {
  let score = 0;

  if (taxYears.includes('2023')) score += 10;
  if (taxYears.includes('2022')) score += 10;
  if (taxYears.includes('2021')) score += 15;
  if (taxYears.includes('Before 2021')) score += 25;
  if (taxYears.length > 2) score += 10;

  if (blockchains.length >= 3) score += 15;
  for (const chain of ['Ethereum', 'Arbitrum', 'Base', 'Avalanche', 'Other']) {
    if (blockchains.includes(chain)) score += 10;
  }

  if (!hasTaxSoftware) score += 10;

  if (country && !STANDARD_COUNTRIES.includes(country)) score += 15;

  return score;
}

export async function POST(req: NextRequest) {
  const ip = getIP(req);
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  try {
    const body = await req.json();
    const { firstName, lastName, email, phone, surveyData } = body;

    if (!firstName || typeof firstName !== 'string' || firstName.trim().length === 0) {
      return NextResponse.json({ error: 'First name is required' }, { status: 400 });
    }
    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }

    if (isHoneypotFilled(body.honeypot)) {
      return NextResponse.json({ contactId: 'ok' }, { status: 200 });
    }

    const result = await createOrUpdateContact({
      firstName: sanitize(firstName),
      lastName: lastName ? sanitize(lastName) : undefined,
      email: sanitize(email),
      phone: phone ? sanitize(phone) : undefined,
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

    const webhookUrl = process.env.GHL_CONTACT_WEBHOOK_URL;
    if (webhookUrl) {
      const taxYears: string[] = surveyData?.taxYears || [];
      const blockchains: string[] = surveyData?.blockchains || [];
      const hasTaxSoftware: boolean = surveyData?.hasTaxSoftware ?? true;
      const country: string = surveyData?.country || '';

      const complexityScore = computeComplexityScore(taxYears, blockchains, hasTaxSoftware, country);
      const complexityTier =
        complexityScore <= 20 ? 'Standard' : complexityScore <= 50 ? 'Complex' : 'High Complexity';

      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contactId,
            firstName: sanitize(firstName),
            lastName: lastName ? sanitize(lastName) : undefined,
            email: sanitize(email),
            phone: phone ? sanitize(phone) : undefined,
            country: surveyData?.country,
            otherCountryName: surveyData?.otherCountryName,
            otherCountryCode: surveyData?.otherCountryCode,
            taxYears: surveyData?.taxYears,
            blockchains: surveyData?.blockchains,
            hasTaxSoftware: surveyData?.hasTaxSoftware,
            taxSoftwareName: surveyData?.taxSoftwareName,
            agreedToTos: surveyData?.agreedToTos ?? false,
            utmParams: surveyData?.utmParams,
            complexityScore,
            complexityTier,
            taxYearsCount: taxYears.length,
            chainCount: blockchains.length,
            hasPreR2021: taxYears.includes('Before 2021'),
          }),
        });
      } catch (err) {
        console.error('Webhook fire failed:', err);
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
    const { contactId, lastName, phone } = body;

    if (!contactId || typeof contactId !== 'string') {
      return NextResponse.json({ error: 'Contact ID is required' }, { status: 400 });
    }

    const updates: { lastName?: string; phone?: string } = {};
    if (lastName && typeof lastName === 'string') updates.lastName = sanitize(lastName);
    if (phone && typeof phone === 'string') updates.phone = sanitize(phone);

    await updateContact(contactId, updates);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('GHL contact update error:', err);
    return NextResponse.json({ error: 'Unable to process request' }, { status: 500 });
  }
}

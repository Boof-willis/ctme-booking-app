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

  if (entry.count >= 10) return false;
  entry.count++;
  return true;
}

function getIP(req: NextRequest): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
}

export async function POST(req: NextRequest) {
  const ip = getIP(req);
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  try {
    const body = await req.json();
    const { firstName, email, surveyData } = body;

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
      email: sanitize(email),
      taxYears: surveyData?.taxYears || [],
      blockchains: surveyData?.blockchains || [],
      hasTaxSoftware: surveyData?.hasTaxSoftware,
      taxSoftwareName: surveyData?.taxSoftwareName,
      country: surveyData?.country,
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

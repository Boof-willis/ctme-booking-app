import { NextRequest, NextResponse } from 'next/server';
import { updateContactCustomField } from '@/lib/ghl';
import { GHL_CUSTOM_FIELDS } from '@/lib/constants';

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
    const { contactId } = await req.json();

    if (!contactId || typeof contactId !== 'string') {
      return NextResponse.json({ error: 'Contact ID is required' }, { status: 400 });
    }

    await updateContactCustomField(
      contactId,
      GHL_CUSTOM_FIELDS.hasTaxSoftware,
      'Yes'
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Koinly setup complete error:', err);
    return NextResponse.json(
      { error: 'Unable to update contact' },
      { status: 500 }
    );
  }
}

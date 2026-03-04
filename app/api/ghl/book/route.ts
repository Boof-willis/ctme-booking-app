import { NextRequest, NextResponse } from 'next/server';
import { createAppointment } from '@/lib/ghl';
import { sanitize } from '@/lib/validation';

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

function isValidISO(str: string): boolean {
  const date = new Date(str);
  return !isNaN(date.getTime());
}

export async function POST(req: NextRequest) {
  const ip = getIP(req);
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  try {
    const body = await req.json();
    const { contactId, startTime, endTime, timezone, firstName } = body;

    if (!contactId || typeof contactId !== 'string') {
      return NextResponse.json({ error: 'Contact ID is required' }, { status: 400 });
    }
    if (!startTime || !isValidISO(startTime)) {
      return NextResponse.json({ error: 'Valid start time is required' }, { status: 400 });
    }
    if (!endTime || !isValidISO(endTime)) {
      return NextResponse.json({ error: 'Valid end time is required' }, { status: 400 });
    }
    if (!timezone || typeof timezone !== 'string') {
      return NextResponse.json({ error: 'Timezone is required' }, { status: 400 });
    }

    const result = await createAppointment(
      sanitize(contactId),
      startTime,
      endTime,
      sanitize(timezone),
      {
        firstName: firstName ? sanitize(firstName) : '',
        taxYears: [],
        blockchains: [],
        utmParams: {},
      }
    );

    /* eslint-disable @typescript-eslint/no-explicit-any */
    const appointmentId =
      result?.id ??
      (result as any)?.calendarId ??
      (result as any)?.appointment?.id;

    return NextResponse.json({
      appointmentId,
      status: result.status || (result as any)?.appointmentStatus,
      startTime: result.startTime,
      endTime: result.endTime,
    });
  } catch (err) {
    console.error('GHL appointment creation error:', err);
    return NextResponse.json({ error: 'Unable to book appointment' }, { status: 500 });
  }
}

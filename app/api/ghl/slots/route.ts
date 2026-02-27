import { NextRequest, NextResponse } from 'next/server';
import { fetchAvailableSlots } from '@/lib/ghl';

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

function isValidDateString(str: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(str) && !isNaN(Date.parse(str));
}

export async function GET(req: NextRequest) {
  const ip = getIP(req);
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const timezone = searchParams.get('timezone');

    if (!startDate || !isValidDateString(startDate)) {
      return NextResponse.json({ error: 'Valid startDate is required (YYYY-MM-DD)' }, { status: 400 });
    }
    if (!endDate || !isValidDateString(endDate)) {
      return NextResponse.json({ error: 'Valid endDate is required (YYYY-MM-DD)' }, { status: 400 });
    }
    if (!timezone || typeof timezone !== 'string' || timezone.length > 100) {
      return NextResponse.json({ error: 'Valid timezone is required' }, { status: 400 });
    }

    const raw = await fetchAvailableSlots(startDate, endDate, timezone);

    // v1 API returns { "YYYY-MM-DD": { slots: [...] } } or { slots: { "YYYY-MM-DD": [...] } }
    // Normalize to { "YYYY-MM-DD": { slots: [...] } } for the frontend
    let normalized: Record<string, { slots: Array<{ startTime: string; endTime: string }> }> = {};

    if (raw && typeof raw === 'object') {
      // Check if it's the v1 format: { "2024-01-15": { slots: [...] } }
      const firstKey = Object.keys(raw)[0];
      if (firstKey && /^\d{4}-\d{2}-\d{2}$/.test(firstKey)) {
        normalized = raw as typeof normalized;
      } else if ('slots' in raw && typeof raw.slots === 'object') {
        // Alternate format: { slots: { "2024-01-15": [...] } }
        const slotsObj = raw.slots as Record<string, Array<{ startTime: string; endTime: string }>>;
        for (const [date, dateSlots] of Object.entries(slotsObj)) {
          normalized[date] = { slots: Array.isArray(dateSlots) ? dateSlots : [] };
        }
      }
    }

    return NextResponse.json(normalized);
  } catch (err) {
    console.error('GHL slots fetch error:', err);
    return NextResponse.json({ error: 'Unable to fetch available times' }, { status: 500 });
  }
}

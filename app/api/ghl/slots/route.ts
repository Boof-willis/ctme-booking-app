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

  if (entry.count >= 60) return false;
  entry.count++;
  return true;
}

function getIP(req: NextRequest): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
}

function isValidDateString(str: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(str) && !isNaN(Date.parse(str));
}

function parseOffset(offset: string): number {
  const sign = offset.startsWith('-') ? -1 : 1;
  const [h, m] = offset.slice(1).split(':').map(Number);
  return sign * (h * 60 + m) * 60_000;
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

    // GHL v1 returns { "YYYY-MM-DD": { slots: ["ISO-string", ...] } }
    // Normalize to { "YYYY-MM-DD": { slots: [{ startTime, endTime }, ...] } }
    const SLOT_DURATION_MS = 30 * 60 * 1000;
    const normalized: Record<string, { slots: Array<{ startTime: string; endTime: string }> }> = {};

    if (raw && typeof raw === 'object') {
      for (const [key, value] of Object.entries(raw)) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(key)) continue;
        const entry = value as { slots?: unknown[] } | unknown[];
        const rawSlots: unknown[] = Array.isArray(entry) ? entry : Array.isArray(entry?.slots) ? entry.slots : [];

        normalized[key] = {
          slots: rawSlots.map((s) => {
            if (typeof s === 'string') {
              const offsetMatch = s.match(/([+-]\d{2}:\d{2})$|Z$/);
              const offset = offsetMatch ? offsetMatch[0] : 'Z';
              const start = new Date(s);
              const end = new Date(start.getTime() + SLOT_DURATION_MS);

              if (offset === 'Z') {
                return { startTime: s, endTime: end.toISOString() };
              }

              const pad = (n: number) => String(n).padStart(2, '0');
              const endLocal = new Date(end.getTime() + parseOffset(offset));
              const endStr = `${endLocal.getUTCFullYear()}-${pad(endLocal.getUTCMonth() + 1)}-${pad(endLocal.getUTCDate())}T${pad(endLocal.getUTCHours())}:${pad(endLocal.getUTCMinutes())}:${pad(endLocal.getUTCSeconds())}${offset}`;
              return { startTime: s, endTime: endStr };
            }
            const obj = s as { startTime?: string; endTime?: string };
            return { startTime: obj.startTime || '', endTime: obj.endTime || '' };
          }).sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()),
        };
      }
    }

    return NextResponse.json(normalized);
  } catch (err) {
    console.error('GHL slots fetch error:', err);
    return NextResponse.json({ error: 'Unable to fetch available times' }, { status: 500 });
  }
}

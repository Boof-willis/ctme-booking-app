'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarSlot, CalendarDay } from '@/types/survey';
import { FALLBACK_EMAIL, MINIMUM_ENGAGEMENT_USD } from '@/lib/constants';

interface SlotPickerProps {
  calendarTimezone: string;
  onSelect: (slot: CalendarSlot) => void;
  onConfirm: () => void;
  selectedSlot: CalendarSlot | null;
  isBooking: boolean;
  bookingError: string | null;
  /** When provided, renders the minimum-engagement acknowledgment and gates Confirm on it. */
  acknowledgedMinimum?: boolean;
  onAcknowledgeMinimum?: (checked: boolean) => void;
}

const TIMEZONE_OPTIONS: { value: string; label: string }[] = [
  { value: 'Pacific/Honolulu', label: 'Hawaii (HT)' },
  { value: 'America/Anchorage', label: 'Alaska (AKT)' },
  { value: 'America/Los_Angeles', label: 'Pacific (PT)' },
  { value: 'America/Denver', label: 'Mountain (MT)' },
  { value: 'America/Chicago', label: 'Central (CT)' },
  { value: 'America/New_York', label: 'Eastern (ET)' },
  { value: 'America/Halifax', label: 'Atlantic (AT)' },
  { value: 'Europe/London', label: 'London (GMT/BST)' },
  { value: 'Europe/Berlin', label: 'Central Europe (CET)' },
  { value: 'Australia/Sydney', label: 'Sydney (AEST)' },
  { value: 'Pacific/Auckland', label: 'New Zealand (NZST)' },
];

function toDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function getNextBusinessDays(count: number): string[] {
  const keys: string[] = [];
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  while (keys.length < count) {
    const dow = d.getDay();
    if (dow !== 0 && dow !== 6) keys.push(toDateKey(d));
    d.setDate(d.getDate() + 1);
  }
  return keys;
}

function formatTime(isoString: string, tz: string): string {
  return new Date(isoString).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: tz,
  });
}

function getTimezoneAbbr(tz: string): string {
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      timeZoneName: 'short',
    }).formatToParts(new Date());
    return parts.find((p) => p.type === 'timeZoneName')?.value || tz;
  } catch {
    return tz;
  }
}

function formatSelectedDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

function formatDayLabel(dateStr: string): { weekday: string; date: string } {
  const d = new Date(dateStr + 'T00:00:00');
  return {
    weekday: d.toLocaleDateString('en-US', { weekday: 'short' }),
    date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  };
}

export default function SlotPicker({
  calendarTimezone,
  onSelect,
  onConfirm,
  selectedSlot,
  isBooking,
  bookingError,
  acknowledgedMinimum,
  onAcknowledgeMinimum,
}: SlotPickerProps) {
  const requiresAcknowledgment = typeof onAcknowledgeMinimum === 'function';
  const confirmBlocked = requiresAcknowledgment && !acknowledgedMinimum;
  const [days, setDays] = useState<CalendarDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [displayTimezone, setDisplayTimezone] = useState(calendarTimezone);
  const [tzPickerOpen, setTzPickerOpen] = useState(false);
  const tzRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (tzRef.current && !tzRef.current.contains(e.target as Node)) {
        setTzPickerOpen(false);
      }
    }
    if (tzPickerOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [tzPickerOpen]);

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const businessDayKeys = useMemo(() => getNextBusinessDays(3), []);

  const todayKey = toDateKey(today);
  const maxDateKey = businessDayKeys[businessDayKeys.length - 1];

  const fetchSlots = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const startDate = todayKey;
      const end = new Date(maxDateKey + 'T00:00:00');
      end.setDate(end.getDate() + 1);
      const endDate = toDateKey(end);

      const params = new URLSearchParams({ startDate, endDate, timezone: calendarTimezone });
      const res = await fetch(`/api/ghl/slots?${params}`);
      if (!res.ok) throw new Error('Failed to load available times');

      const data = await res.json();
      const newDays: CalendarDay[] = Object.entries(data)
        .map(([date, info]) => ({
          date,
          slots: (
            (info as { slots: Array<{ startTime: string; endTime: string }> }).slots || []
          ).map((s: { startTime: string; endTime: string }, i: number) => ({
            id: `${date}-${i}`,
            startTime: s.startTime,
            endTime: s.endTime,
          })),
        }))
        .filter((d) => d.slots.length > 0 && d.date >= todayKey && d.date <= maxDateKey)
        .sort((a, b) => a.date.localeCompare(b.date));

      setDays(newDays);
    } catch {
      setError('Unable to load available times right now.');
    } finally {
      setLoading(false);
    }
  }, [calendarTimezone, todayKey, maxDateKey]);

  useEffect(() => {
    fetchSlots();
  }, [fetchSlots]);

  const slotsForSelectedDate = useMemo(
    () => days.find((d) => d.date === selectedDate)?.slots || [],
    [days, selectedDate]
  );

  // Auto-select the first available day so the next open times show immediately.
  useEffect(() => {
    if (!loading && days.length > 0 && !selectedDate) {
      setSelectedDate(days[0].date);
    }
  }, [loading, days, selectedDate]);

  const handleDateClick = (dateKey: string) => {
    setSelectedDate(dateKey);
    onSelect(null as unknown as CalendarSlot);
  };

  const currentTzLabel = TIMEZONE_OPTIONS.find((o) => o.value === displayTimezone)?.label
    || getTimezoneAbbr(displayTimezone);

  if (error && days.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-zinc-400 mb-4">{error}</p>
        <p className="text-zinc-500 text-sm">
          Email us at{' '}
          <a href={`mailto:${FALLBACK_EMAIL}`} className="text-cyan-400 hover:underline">
            {FALLBACK_EMAIL}
          </a>{' '}
          and we&apos;ll get you booked.
        </p>
        <button
          onClick={fetchSlots}
          className="mt-4 text-sm text-cyan-400 hover:text-cyan-300 underline cursor-pointer"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Timezone selector */}
      <div className="relative inline-block mb-5" ref={tzRef}>
        <button
          type="button"
          onClick={() => setTzPickerOpen((v) => !v)}
          className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-cyan-400 transition-colors cursor-pointer"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 6v6l4 2"/>
          </svg>
          Times shown in {currentTzLabel}
          <svg width="12" height="12" viewBox="0 0 20 20" fill="none" className="shrink-0">
            <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <AnimatePresence>
          {tzPickerOpen && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="absolute z-20 top-full left-0 mt-1 w-56 rounded-none border border-zinc-800 bg-black shadow-xl overflow-hidden"
            >
              <div className="py-1 max-h-64 overflow-y-auto">
                {TIMEZONE_OPTIONS.map((opt) => {
                  const isActive = opt.value === displayTimezone;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        setDisplayTimezone(opt.value);
                        setTzPickerOpen(false);
                      }}
                      className={`
                        w-full text-left px-3.5 py-2 text-sm font-mono transition-colors cursor-pointer
                        ${isActive
                          ? 'text-[#beb086] bg-[#beb086]/10'
                          : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
                        }
                      `}
                    >
                      {isActive ? '> ' : ''}{opt.label}
                      <span className="ml-1.5 text-zinc-600">[{getTimezoneAbbr(opt.value)}]</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Available days */}
      {loading ? (
        <div className="animate-pulse flex gap-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-14 flex-1 bg-white/[0.06]" />
          ))}
        </div>
      ) : (
        <div>
          <div className="flex gap-2">
            {businessDayKeys.map((key) => {
              const dayData = days.find((d) => d.date === key);
              const hasSlots = Boolean(dayData);
              const isSelected = key === selectedDate;
              const isToday = key === todayKey;
              const label = formatDayLabel(key);

              return (
                <button
                  key={key}
                  type="button"
                  disabled={!hasSlots}
                  onClick={() => handleDateClick(key)}
                  className={`
                    flex-1 rounded-none border px-2 py-2.5 font-mono transition-colors
                    focus:outline-none focus-visible:ring-1 focus-visible:ring-[#beb086]
                    ${isSelected
                      ? 'border-[#beb086] bg-[#beb086] text-black cursor-pointer'
                      : hasSlots
                        ? 'border-zinc-800 bg-black text-zinc-400 hover:border-[#beb086] hover:text-white cursor-pointer'
                        : 'border-zinc-900 bg-black text-zinc-700 cursor-default'
                    }
                  `}
                  aria-pressed={isSelected}
                >
                  <span className={`block text-xs uppercase tracking-wider ${isSelected ? 'text-black/70' : hasSlots ? 'text-zinc-600' : 'text-zinc-700'}`}>
                    {isToday ? 'Today' : label.weekday}
                  </span>
                  <span className="block text-sm font-bold mt-0.5">{label.date}</span>
                  <span className={`block text-[10px] uppercase tracking-wider mt-0.5 ${isSelected ? 'text-black/70' : hasSlots ? 'text-zinc-600' : 'text-zinc-700'}`}>
                    {hasSlots ? `${dayData!.slots.length} open` : 'Full'}
                  </span>
                </button>
              );
            })}
          </div>

          {days.length === 0 && (
            <div className="text-center py-6">
              <p className="text-zinc-400 mb-2">All times in the next few days are booked.</p>
              <p className="text-zinc-500 text-sm">
                Email us at{' '}
                <a href={`mailto:${FALLBACK_EMAIL}`} className="text-cyan-400 hover:underline">
                  {FALLBACK_EMAIL}
                </a>{' '}
                and we&apos;ll get you booked.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Time slots for selected date */}
      <AnimatePresence mode="wait">
        {selectedDate && slotsForSelectedDate.length > 0 && (
          <motion.div
            key={selectedDate}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="mt-6"
          >
            <h3 className="text-sm font-semibold text-zinc-300 mb-3">
              {formatSelectedDate(selectedDate)}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {slotsForSelectedDate.map((slot) => {
                const isActive = selectedSlot?.id === slot.id;
                return (
                  <motion.button
                    key={slot.id}
                    type="button"
                    onClick={() => onSelect(slot)}
                    whileTap={{ scale: 0.97 }}
                    className={`
                      rounded-none border px-3 py-2.5 text-sm font-mono transition-colors cursor-pointer
                      focus:outline-none focus-visible:ring-1 focus-visible:ring-[#beb086]
                      ${isActive
                        ? 'border-[#beb086] bg-[#beb086]/10 text-white'
                        : 'border-zinc-800 bg-black text-zinc-400 hover:border-[#beb086] hover:text-white'
                      }
                    `}
                    aria-pressed={isActive}
                  >
                    {isActive ? '> ' : ''}{formatTime(slot.startTime, displayTimezone)}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirm booking */}
      <AnimatePresence>
        {selectedSlot && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-6 rounded-none border border-zinc-800 bg-black p-4"
          >
            <p className="text-sm text-zinc-400 mb-1">Selected time</p>
            <p className="text-white font-medium">
              {formatSelectedDate(selectedSlot.startTime.split('T')[0])},{' '}
              {formatTime(selectedSlot.startTime, displayTimezone)} –{' '}
              {formatTime(selectedSlot.endTime, displayTimezone)}{' '}
              {getTimezoneAbbr(displayTimezone)}
            </p>

            {requiresAcknowledgment && (
              <label className="mt-4 flex items-start gap-3 cursor-pointer select-none border-t border-zinc-800 pt-4">
                <input
                  type="checkbox"
                  checked={Boolean(acknowledgedMinimum)}
                  onChange={(e) => onAcknowledgeMinimum?.(e.target.checked)}
                  className="mt-0.5 h-4 w-4 shrink-0 rounded-none border-zinc-800 bg-black accent-[#beb086]"
                />
                <span className="text-sm font-mono leading-relaxed text-zinc-400">
                  I understand Crypto Tax Made Easy&apos;s done-for-you service has a{' '}
                  <span className="text-white font-bold">${MINIMUM_ENGAGEMENT_USD.toLocaleString()} minimum</span>{' '}
                  engagement, and I&apos;m booking this call to discuss working together.
                </span>
              </label>
            )}

            {bookingError && (
              <p className="text-red-400 text-sm mt-2">{bookingError}</p>
            )}

              <motion.button
                type="button"
                onClick={onConfirm}
                disabled={isBooking || confirmBlocked}
                title={confirmBlocked ? 'Please confirm the minimum engagement above' : undefined}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="
                  mt-4 w-full rounded-none bg-[#beb086]
                  py-3 text-base font-bold text-black font-mono uppercase tracking-wider
                  transition-colors hover:bg-[#a69970]
                  disabled:opacity-50 disabled:cursor-not-allowed
                  cursor-pointer
                "
              >
                {isBooking ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
                    Booking…
                  </span>
                ) : (
                  '[ Confirm Booking ]'
                )}
              </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

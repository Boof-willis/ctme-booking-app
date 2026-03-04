'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarSlot, CalendarDay } from '@/types/survey';
import { FALLBACK_EMAIL } from '@/lib/constants';

interface SlotPickerProps {
  calendarTimezone: string;
  onSelect: (slot: CalendarSlot) => void;
  onConfirm: () => void;
  selectedSlot: CalendarSlot | null;
  isBooking: boolean;
  bookingError: string | null;
}

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

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

function getBusinessDayLimit(businessDays: number): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  let count = 0;
  while (count < businessDays) {
    d.setDate(d.getDate() + 1);
    const dow = d.getDay();
    if (dow !== 0 && dow !== 6) count++;
  }
  return d;
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

export default function SlotPicker({
  calendarTimezone,
  onSelect,
  onConfirm,
  selectedSlot,
  isBooking,
  bookingError,
}: SlotPickerProps) {
  const [days, setDays] = useState<CalendarDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [displayTimezone, setDisplayTimezone] = useState(calendarTimezone);
  const [tzPickerOpen, setTzPickerOpen] = useState(false);
  const tzRef = useRef<HTMLDivElement>(null);
  const [viewMonth, setViewMonth] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });

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

  const maxDate = useMemo(() => getBusinessDayLimit(5), []);

  const todayKey = toDateKey(today);
  const maxDateKey = toDateKey(maxDate);

  const fetchSlots = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const startDate = toDateKey(today);
      const end = new Date(maxDate);
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
  }, [calendarTimezone, today, maxDate, todayKey, maxDateKey]);

  useEffect(() => {
    fetchSlots();
  }, [fetchSlots]);

  const availableDates = useMemo(
    () => new Set(days.map((d) => d.date)),
    [days]
  );

  const slotsForSelectedDate = useMemo(
    () => days.find((d) => d.date === selectedDate)?.slots || [],
    [days, selectedDate]
  );

  const calendarGrid = useMemo(() => {
    const { year, month } = viewMonth;
    const firstOfMonth = new Date(year, month, 1);
    const startDow = firstOfMonth.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const cells: Array<{ date: Date; key: string; inMonth: boolean } | null> = [];

    for (let i = 0; i < startDow; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      cells.push({ date, key: toDateKey(date), inMonth: true });
    }

    return cells;
  }, [viewMonth]);

  const monthLabel = new Date(viewMonth.year, viewMonth.month).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const canGoPrev = (() => {
    const prev = new Date(viewMonth.year, viewMonth.month - 1, 1);
    const cur = new Date(today.getFullYear(), today.getMonth(), 1);
    return prev >= cur;
  })();

  const canGoNext = (() => {
    const nextStart = new Date(viewMonth.year, viewMonth.month + 1, 1);
    return nextStart <= maxDate;
  })();

  const navigateMonth = (dir: -1 | 1) => {
    setViewMonth((prev) => {
      let m = prev.month + dir;
      let y = prev.year;
      if (m < 0) { m = 11; y--; }
      if (m > 11) { m = 0; y++; }
      return { year: y, month: m };
    });
  };

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
              className="absolute z-20 top-full left-0 mt-1 w-56 rounded-xl border border-white/[0.08] bg-[#1a1a24] shadow-xl overflow-hidden"
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
                        w-full text-left px-3.5 py-2 text-sm transition-colors cursor-pointer
                        ${isActive
                          ? 'text-cyan-400 bg-cyan-500/10'
                          : 'text-zinc-300 hover:bg-white/[0.06] hover:text-white'
                        }
                      `}
                    >
                      {opt.label}
                      <span className="ml-1.5 text-zinc-500">{getTimezoneAbbr(opt.value)}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Month calendar */}
      {loading ? (
        <div className="animate-pulse space-y-3">
          <div className="h-6 w-40 bg-white/[0.06] rounded mx-auto" />
          <div className="grid grid-cols-7 gap-1">
            {[...Array(35)].map((_, i) => (
              <div key={i} className="h-10 bg-white/[0.06] rounded-lg" />
            ))}
          </div>
        </div>
      ) : (
        <div>
          {/* Month header */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={() => navigateMonth(-1)}
              disabled={!canGoPrev}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.06] disabled:opacity-0 disabled:pointer-events-none transition-colors cursor-pointer"
              aria-label="Previous month"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <span className="text-sm font-semibold text-white">{monthLabel}</span>
            <button
              type="button"
              onClick={() => navigateMonth(1)}
              disabled={!canGoNext}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.06] disabled:opacity-0 disabled:pointer-events-none transition-colors cursor-pointer"
              aria-label="Next month"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1 mb-1">
            {WEEKDAY_LABELS.map((label) => (
              <div key={label} className="text-center text-xs font-medium text-zinc-500 py-1">
                {label}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7 gap-1">
            {calendarGrid.map((cell, i) => {
              if (!cell) return <div key={`empty-${i}`} />;

              const isAvailable = availableDates.has(cell.key);
              const isInRange = cell.key >= todayKey && cell.key <= maxDateKey;
              const isSelected = cell.key === selectedDate;
              const isToday = cell.key === todayKey;
              const isDisabled = !isAvailable || !isInRange;

              return (
                <button
                  key={cell.key}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => handleDateClick(cell.key)}
                  className={`
                    relative h-10 rounded-lg text-sm font-medium transition-all cursor-pointer
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500
                    ${isSelected
                      ? 'bg-cyan-500 text-white shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                      : isAvailable && isInRange
                        ? 'text-white hover:bg-white/[0.08] active:bg-white/[0.12]'
                        : 'text-zinc-600 cursor-default'
                    }
                  `}
                >
                  {cell.date.getDate()}
                  {isToday && !isSelected && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-cyan-500" />
                  )}
                  {isAvailable && isInRange && !isSelected && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-emerald-400" />
                  )}
                </button>
              );
            })}
          </div>
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
                      rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors cursor-pointer
                      focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500
                      ${isActive
                        ? 'border-cyan-500/50 bg-cyan-500/15 text-white shadow-[0_0_12px_rgba(6,182,212,0.1)]'
                        : 'border-white/[0.06] bg-[#16161F] text-zinc-300 hover:border-white/[0.12] hover:text-white'
                      }
                    `}
                    aria-pressed={isActive}
                  >
                    {formatTime(slot.startTime, displayTimezone)}
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
            className="mt-6 rounded-xl border border-white/[0.08] bg-[#16161F] p-4"
          >
            <p className="text-sm text-zinc-400 mb-1">Selected time</p>
            <p className="text-white font-medium">
              {formatSelectedDate(selectedSlot.startTime.split('T')[0])},{' '}
              {formatTime(selectedSlot.startTime, displayTimezone)} –{' '}
              {formatTime(selectedSlot.endTime, displayTimezone)}{' '}
              {getTimezoneAbbr(displayTimezone)}
            </p>

            {bookingError && (
              <p className="text-red-400 text-sm mt-2">{bookingError}</p>
            )}

            <motion.button
              type="button"
              onClick={onConfirm}
              disabled={isBooking}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="
                mt-4 w-full rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500
                py-3 text-base font-semibold text-white
                shadow-[0_0_20px_rgba(59,130,246,0.25)]
                transition-opacity hover:opacity-90
                disabled:opacity-50 disabled:cursor-not-allowed
                cursor-pointer
              "
            >
              {isBooking ? (
                <span className="inline-flex items-center gap-2">
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Booking…
                </span>
              ) : (
                'Confirm Booking'
              )}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

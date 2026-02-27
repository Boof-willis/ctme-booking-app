'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarSlot, CalendarDay } from '@/types/survey';
import { FALLBACK_EMAIL } from '@/lib/constants';

interface SlotPickerProps {
  timezone: string;
  onSelect: (slot: CalendarSlot) => void;
  onConfirm: () => void;
  selectedSlot: CalendarSlot | null;
  isBooking: boolean;
  bookingError: string | null;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.getTime() === today.getTime()) return 'Today';
  if (date.getTime() === tomorrow.getTime()) return 'Tomorrow';

  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
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

function buildDateRange(offsetDays: number, rangeDays: number) {
  const start = new Date();
  start.setDate(start.getDate() + offsetDays);
  const end = new Date(start);
  end.setDate(end.getDate() + rangeDays);
  return {
    startDate: start.toISOString().split('T')[0],
    endDate: end.toISOString().split('T')[0],
  };
}

export default function SlotPicker({
  timezone,
  onSelect,
  onConfirm,
  selectedSlot,
  isBooking,
  bookingError,
}: SlotPickerProps) {
  const [days, setDays] = useState<CalendarDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [daysLoaded, setDaysLoaded] = useState(5);

  const fetchSlots = useCallback(
    async (offsetDays: number, rangeDays: number, append = false) => {
      setLoading(true);
      setError(null);
      try {
        const { startDate, endDate } = buildDateRange(offsetDays, rangeDays);
        const params = new URLSearchParams({ startDate, endDate, timezone });
        const res = await fetch(`/api/ghl/slots?${params}`);

        if (!res.ok) throw new Error('Failed to load available times');

        const data = await res.json();
        const newDays: CalendarDay[] = Object.entries(data)
          .map(([date, info]) => ({
            date,
            slots: ((info as { slots: Array<{ startTime: string; endTime: string }> }).slots || []).map(
              (s: { startTime: string; endTime: string }, i: number) => ({
                id: `${date}-${i}`,
                startTime: s.startTime,
                endTime: s.endTime,
              })
            ),
          }))
          .filter((d) => d.slots.length > 0)
          .sort((a, b) => a.date.localeCompare(b.date));

        setDays((prev) => (append ? [...prev, ...newDays] : newDays));
      } catch {
        setError('Unable to load available times right now.');
      } finally {
        setLoading(false);
      }
    },
    [timezone]
  );

  useEffect(() => {
    fetchSlots(0, 5);
  }, [fetchSlots]);

  const loadMore = () => {
    const newOffset = daysLoaded;
    setDaysLoaded((prev) => prev + 5);
    fetchSlots(newOffset, 5, true);
  };

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
          onClick={() => fetchSlots(0, 5)}
          className="mt-4 text-sm text-cyan-400 hover:text-cyan-300 underline cursor-pointer"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm text-zinc-500 mb-5">
        Times shown in {getTimezoneAbbr(timezone)}
      </p>

      {loading && days.length === 0 && (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-5 w-24 bg-white/[0.06] rounded mb-3" />
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[...Array(4)].map((_, j) => (
                  <div key={j} className="h-11 bg-white/[0.06] rounded-lg" />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-5">
        <AnimatePresence>
          {days.map((day) => (
            <motion.div
              key={day.date}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <h3 className="text-sm font-semibold text-zinc-300 mb-2.5">
                {formatDate(day.date)}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {day.slots.map((slot) => {
                  const isSelected = selectedSlot?.id === slot.id;
                  return (
                    <motion.button
                      key={slot.id}
                      type="button"
                      onClick={() => onSelect(slot)}
                      whileTap={{ scale: 0.97 }}
                      className={`
                        rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors cursor-pointer
                        focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500
                        ${
                          isSelected
                            ? 'border-cyan-500/50 bg-cyan-500/15 text-white shadow-[0_0_12px_rgba(6,182,212,0.1)]'
                            : 'border-white/[0.06] bg-[#16161F] text-zinc-300 hover:border-white/[0.12] hover:text-white'
                        }
                      `}
                      aria-pressed={isSelected}
                    >
                      {formatTime(slot.startTime, timezone)}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {!loading && days.length > 0 && (
        <button
          onClick={loadMore}
          className="mt-5 w-full text-center text-sm text-cyan-400 hover:text-cyan-300 cursor-pointer py-2"
        >
          Show more dates →
        </button>
      )}

      {loading && days.length > 0 && (
        <div className="mt-4 text-center">
          <div className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" />
        </div>
      )}

      {/* Confirm booking section */}
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
              {formatDate(selectedSlot.startTime.split('T')[0])},{' '}
              {formatTime(selectedSlot.startTime, timezone)} –{' '}
              {formatTime(selectedSlot.endTime, timezone)}{' '}
              {getTimezoneAbbr(timezone)}
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

'use client';

import { useState, useCallback, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import SlotPicker from '@/components/SlotPicker';
import { CalendarSlot } from '@/types/survey';
import { parseUTMParams } from '@/lib/utm';
import { UTMParams } from '@/types/survey';
import { trackAppointmentBooked } from '@/lib/tracking';

function BookingFlowInner() {
  const searchParams = useSearchParams();

  const [contactId] = useState(() => searchParams.get('contactId') || '');
  const [firstName, setFirstName] = useState(() => searchParams.get('firstName') || '');
  const [lastName, setLastName] = useState(() => searchParams.get('lastName') || '');
  const [email, setEmail] = useState(() => searchParams.get('email') || '');
  const [phone, setPhone] = useState(() => searchParams.get('phone') || '');

  const [selectedSlot, setSelectedSlot] = useState<CalendarSlot | null>(null);
  const [timezone, setTimezone] = useState('America/Denver');
  const [isBooking, setIsBooking] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [booked, setBooked] = useState(false);

  const [utmParams, setUtmParams] = useState<UTMParams>({});
  useEffect(() => {
    setUtmParams(parseUTMParams());
  }, []);

  const handleSlotSelect = useCallback((slot: CalendarSlot) => {
    setBookingError(null);
    setSelectedSlot(slot);
  }, []);

  const handleBook = useCallback(async () => {
    if (!contactId || !selectedSlot) return;

    setIsBooking(true);
    setBookingError(null);

    try {
      const trimmedFirstName = firstName.trim();
      const trimmedLastName = lastName.trim();
      const trimmedPhone = phone.trim();

      if (!trimmedFirstName) {
        setBookingError('First name is required.');
        setIsBooking(false);
        return;
      }

      const hasEdits =
        trimmedFirstName !== (searchParams.get('firstName') || '') ||
        trimmedLastName !== (searchParams.get('lastName') || '') ||
        trimmedPhone !== (searchParams.get('phone') || '');

      if (hasEdits) {
        const updates: Record<string, unknown> = { contactId };
        if (trimmedLastName) updates.lastName = trimmedLastName;
        if (trimmedPhone) updates.phone = trimmedPhone;
        if (Object.keys(utmParams).length > 0) updates.utmParams = utmParams;

        const updateRes = await fetch('/api/ghl/contact', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates),
        });

        if (!updateRes.ok) {
          console.error('Contact update failed, continuing with booking');
        }
      }

      const res = await fetch('/api/ghl/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contactId,
          startTime: selectedSlot.startTime,
          endTime: selectedSlot.endTime,
          timezone,
          firstName: trimmedFirstName,
          lastName: trimmedLastName,
          utmParams,
        }),
      });

      if (!res.ok) throw new Error('Booking failed');

      trackAppointmentBooked();
      setBooked(true);
    } catch {
      setBookingError('Something went wrong. Please try again.');
    } finally {
      setIsBooking(false);
    }
  }, [contactId, selectedSlot, timezone, firstName, lastName, phone, searchParams, utmParams]);

  if (!contactId) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-white mb-3">Invalid booking link</h1>
        <p className="text-zinc-400 text-sm">
          This link is missing required information. Please use the link from your email or SMS.
        </p>
      </div>
    );
  }

  if (booked) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
            className="inline-flex h-16 w-16 items-center justify-center rounded-none bg-[#beb086]/10 border border-[#beb086]/20 mb-4"
          >
            <span className="text-3xl grayscale">🎉</span>
          </motion.div>
          <h1 className="text-2xl sm:text-[28px] font-bold text-white mb-2">
            You&apos;re booked!
          </h1>
        </div>

        {selectedSlot && (
          <div className="rounded-none border border-zinc-800 bg-black p-4 mb-6">
            <p className="text-xs font-mono uppercase tracking-wider text-zinc-500 mb-1">[ Your appointment ]</p>
            <p className="text-[#beb086] font-mono">
              {new Date(selectedSlot.startTime).toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                timeZone: timezone,
              })}{' '}
              at{' '}
              {new Date(selectedSlot.startTime).toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                timeZone: timezone,
              })}
            </p>
          </div>
        )}

        <div className="rounded-none border border-[#beb086]/20 bg-[#beb086]/5 p-5 text-center">
          <p className="text-white font-mono text-sm">
            &gt; We&apos;ll send a confirmation email to{' '}
            <span className="font-bold text-[#beb086]">{email}</span>.
          </p>
          {selectedSlot && (
            <p className="text-zinc-500 font-mono text-xs mt-2">
              [ See you on {new Date(selectedSlot.startTime).toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                timeZone: timezone,
              })}! ]
            </p>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl sm:text-[28px] font-bold text-white mb-2">
        Finish your booking
      </h1>
      <p className="font-mono text-[#beb086] text-sm mb-6">&gt; Confirm your details and pick a time</p>

      {/* Contact info */}
      <div className="space-y-4 mb-8">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="bf-first" className="block text-xs font-mono uppercase tracking-wider text-zinc-500 mb-1.5">
              First name *
            </label>
            <input
              id="bf-first"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full rounded-none border border-zinc-800 bg-black px-3 py-2.5 text-sm text-white placeholder-zinc-600 font-mono focus:border-[#beb086] focus:outline-none transition-colors"
              placeholder="First name"
            />
          </div>
          <div>
            <label htmlFor="bf-last" className="block text-xs font-mono uppercase tracking-wider text-zinc-500 mb-1.5">
              Last name
            </label>
            <input
              id="bf-last"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full rounded-none border border-zinc-800 bg-black px-3 py-2.5 text-sm text-white placeholder-zinc-600 font-mono focus:border-[#beb086] focus:outline-none transition-colors"
              placeholder="Last name"
            />
          </div>
        </div>

        <div>
          <label htmlFor="bf-email" className="block text-xs font-mono uppercase tracking-wider text-zinc-500 mb-1.5">
            Email
          </label>
          <input
            id="bf-email"
            type="email"
            value={email}
            disabled
            className="w-full rounded-none border border-zinc-800 bg-black/50 px-3 py-2.5 text-sm text-zinc-500 font-mono cursor-not-allowed"
          />
        </div>

        <div>
          <label htmlFor="bf-phone" className="block text-xs font-mono uppercase tracking-wider text-zinc-500 mb-1.5">
            Phone
          </label>
          <input
            id="bf-phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-none border border-zinc-800 bg-black px-3 py-2.5 text-sm text-white placeholder-zinc-600 font-mono focus:border-[#beb086] focus:outline-none transition-colors"
            placeholder="Phone number"
          />
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-zinc-800 mb-6" />

      {/* Calendar */}
      <SlotPicker
        calendarTimezone={timezone}
        onSelect={handleSlotSelect}
        onConfirm={handleBook}
        selectedSlot={selectedSlot}
        isBooking={isBooking}
        bookingError={bookingError}
      />
    </div>
  );
}

export default function BookingFlow() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#beb086] border-t-transparent" />
        </div>
      }
    >
      <BookingFlowInner />
    </Suspense>
  );
}

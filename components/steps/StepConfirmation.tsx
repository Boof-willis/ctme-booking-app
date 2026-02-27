'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarSlot } from '@/types/survey';
import { COUNTRY_PHONE_CODES } from '@/lib/constants';
import { isValidPhone } from '@/lib/validation';

interface StepConfirmationProps {
  selectedSlot: CalendarSlot;
  timezone: string;
  email: string;
  country: string;
  lastName?: string;
  phone?: string;
  onSubmit: (lastName: string, phone: string) => void;
  isSubmitting: boolean;
  isComplete: boolean;
  error: string | null;
}

function formatBookingTime(slot: CalendarSlot, tz: string): string {
  const date = new Date(slot.startTime);
  const dateStr = date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    timeZone: tz,
  });
  const timeStr = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: tz,
  });
  return `${dateStr} at ${timeStr}`;
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

export default function StepConfirmation({
  selectedSlot,
  timezone,
  email,
  country,
  lastName: initialLastName,
  phone: initialPhone,
  onSubmit,
  isSubmitting,
  isComplete,
  error,
}: StepConfirmationProps) {
  const defaultCode = COUNTRY_PHONE_CODES[country] || '+1';
  const [lastName, setLastName] = useState(initialLastName || '');
  const [phone, setPhone] = useState(initialPhone || '');
  const [phonePrefix] = useState(defaultCode);
  const [lastNameError, setLastNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedLastName = lastName.trim();
    const fullPhone = `${phonePrefix}${phone.trim()}`;
    let valid = true;

    if (!trimmedLastName) {
      setLastNameError('Please enter your last name');
      valid = false;
    } else {
      setLastNameError('');
    }

    if (!phone.trim()) {
      setPhoneError('Please enter your phone number');
      valid = false;
    } else if (!isValidPhone(fullPhone)) {
      setPhoneError('Please enter a valid phone number');
      valid = false;
    } else {
      setPhoneError('');
    }

    if (valid) {
      onSubmit(trimmedLastName, fullPhone);
    }
  };

  const bookingTimeStr = formatBookingTime(selectedSlot, timezone);
  const tzAbbr = getTimezoneAbbr(timezone);

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
          className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-cyan-500/20 mb-4"
        >
          <span className="text-3xl">🎉</span>
        </motion.div>
        <h1 className="text-2xl sm:text-[28px] font-bold text-white mb-2">
          You&apos;re booked!
        </h1>
      </div>

      {/* Booking summary */}
      <div className="rounded-xl border border-white/[0.06] bg-[#16161F] p-4 mb-6">
        <p className="text-sm text-zinc-400 mb-1">Your appointment</p>
        <p className="text-white font-medium">{bookingTimeStr}</p>
        <p className="text-zinc-500 text-sm">{tzAbbr}</p>
      </div>

      <AnimatePresence mode="wait">
        {!isComplete ? (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <p className="text-zinc-400 text-base mb-6">
              Just a couple more details so we&apos;re fully prepared for your call
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-zinc-300 mb-1.5">
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => {
                    setLastName(e.target.value);
                    if (lastNameError) setLastNameError('');
                  }}
                  placeholder="Your last name"
                  autoComplete="family-name"
                  className={`
                    w-full rounded-xl border bg-[#16161F] px-4 py-3 text-white text-base
                    placeholder:text-zinc-600
                    focus:outline-none focus:ring-1
                    ${lastNameError
                      ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/30'
                      : 'border-white/[0.08] focus:border-cyan-500/50 focus:ring-cyan-500/30'
                    }
                  `}
                />
                {lastNameError && <p className="mt-1.5 text-sm text-red-400">{lastNameError}</p>}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-zinc-300 mb-1.5">
                  Phone Number
                </label>
                <div className="flex gap-2">
                  <div className="flex items-center rounded-xl border border-white/[0.08] bg-[#16161F] px-3 text-zinc-400 text-sm shrink-0">
                    {phonePrefix}
                  </div>
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (phoneError) setPhoneError('');
                    }}
                    placeholder="Your phone number"
                    autoComplete="tel-national"
                    className={`
                      w-full rounded-xl border bg-[#16161F] px-4 py-3 text-white text-base
                      placeholder:text-zinc-600
                      focus:outline-none focus:ring-1
                      ${phoneError
                        ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/30'
                        : 'border-white/[0.08] focus:border-cyan-500/50 focus:ring-cyan-500/30'
                      }
                    `}
                  />
                </div>
                {phoneError && <p className="mt-1.5 text-sm text-red-400">{phoneError}</p>}
              </div>

              {error && (
                <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3">
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="
                  w-full rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500
                  py-3.5 text-base font-semibold text-white
                  shadow-[0_0_20px_rgba(59,130,246,0.25)]
                  transition-opacity hover:opacity-90
                  disabled:opacity-50 disabled:cursor-not-allowed
                  cursor-pointer
                "
              >
                {isSubmitting ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Saving…
                  </span>
                ) : (
                  'Complete'
                )}
              </motion.button>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="done"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-5">
              <p className="text-white text-base">
                We&apos;ll send a confirmation email to{' '}
                <span className="font-medium text-cyan-400">{email}</span>.
              </p>
              <p className="text-zinc-400 text-sm mt-2">
                See you on {new Date(selectedSlot.startTime).toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  timeZone: timezone,
                })}!
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

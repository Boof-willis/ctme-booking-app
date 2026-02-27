'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import BackButton from '@/components/BackButton';
import SlotPicker from '@/components/SlotPicker';
import { CalendarSlot } from '@/types/survey';

interface StepCalendarProps {
  selectedSlot: CalendarSlot | null;
  onSlotSelect: (slot: CalendarSlot, timezone: string) => void;
  onBook: () => Promise<void>;
  onBack: () => void;
}

export default function StepCalendar({
  selectedSlot,
  onSlotSelect,
  onBook,
  onBack,
}: StepCalendarProps) {
  const [timezone, setTimezone] = useState('UTC');
  const [isBooking, setIsBooking] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  useEffect(() => {
    try {
      setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
    } catch {
      setTimezone('UTC');
    }
  }, []);

  const handleSelect = (slot: CalendarSlot) => {
    setBookingError(null);
    onSlotSelect(slot, timezone);
  };

  const handleConfirm = async () => {
    setIsBooking(true);
    setBookingError(null);
    try {
      await onBook();
    } catch {
      setBookingError('Something went wrong. Please try again.');
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      <BackButton onClick={onBack} />

      <h1 className="text-2xl sm:text-[28px] font-bold text-white mb-2">
        Pick a time that works for you
      </h1>
      <p className="text-zinc-400 text-base mb-6">&nbsp;</p>

      <SlotPicker
        timezone={timezone}
        onSelect={handleSelect}
        onConfirm={handleConfirm}
        selectedSlot={selectedSlot}
        isBooking={isBooking}
        bookingError={bookingError}
      />
    </motion.div>
  );
}

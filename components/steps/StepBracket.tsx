'use client';

import { motion } from 'framer-motion';
import BackButton from '@/components/BackButton';
import ButtonCard from '@/components/ButtonCard';

interface StepBracketProps<T extends string> {
  title: string;
  hint: string;
  options: readonly T[];
  value?: T;
  /** Called on click; the parent advances the flow (auto-advance, like the country step). */
  onSelect: (value: T) => void;
  onBack: () => void;
}

/**
 * One qualifier question per screen: a single-select list of ranges that
 * advances as soon as the user taps an answer.
 */
export default function StepBracket<T extends string>({
  title,
  hint,
  options,
  value,
  onSelect,
  onBack,
}: StepBracketProps<T>) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      <BackButton onClick={onBack} />

      <h1 className="text-2xl sm:text-[28px] font-bold text-white mb-2">{title}</h1>
      <p className="font-mono text-[#beb086] text-sm mb-8">&gt; {hint}</p>

      <div className="space-y-3">
        {options.map((opt) => (
          <ButtonCard
            key={opt}
            label={opt}
            selected={value === opt}
            onClick={() => onSelect(opt)}
          />
        ))}
      </div>
    </motion.div>
  );
}

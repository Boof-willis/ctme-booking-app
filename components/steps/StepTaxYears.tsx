'use client';

import { motion } from 'framer-motion';
import MultiSelectPill from '@/components/MultiSelectPill';
import BackButton from '@/components/BackButton';
import { TAX_YEARS } from '@/lib/constants';
import { TaxYear } from '@/types/survey';

interface StepTaxYearsProps {
  selected: TaxYear[];
  onChange: (years: TaxYear[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function StepTaxYears({ selected, onChange, onNext, onBack }: StepTaxYearsProps) {
  const toggle = (year: TaxYear) => {
    onChange(
      selected.includes(year)
        ? selected.filter((y) => y !== year)
        : [...selected, year]
    );
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
        Which tax years do you need help with?
      </h1>
      <p className="text-zinc-400 text-base mb-8">Select all that apply</p>

      <div className="flex flex-wrap gap-2.5 mb-8">
        {TAX_YEARS.map((year) => (
          <MultiSelectPill
            key={year}
            label={year}
            selected={selected.includes(year)}
            onClick={() => toggle(year)}
          />
        ))}
      </div>

      <motion.button
        type="button"
        onClick={onNext}
        disabled={selected.length === 0}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className="
          w-full rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500
          py-3.5 text-base font-semibold text-white
          shadow-[0_0_20px_rgba(59,130,246,0.25)]
          transition-opacity hover:opacity-90
          disabled:opacity-30 disabled:cursor-not-allowed
          cursor-pointer
        "
      >
        Next →
      </motion.button>
    </motion.div>
  );
}

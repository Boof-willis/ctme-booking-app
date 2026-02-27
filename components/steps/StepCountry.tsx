'use client';

import { motion } from 'framer-motion';
import ButtonCard from '@/components/ButtonCard';
import { COUNTRIES } from '@/lib/constants';
import { Country } from '@/types/survey';

const COUNTRY_ICONS: Record<string, string> = {
  Australia: '🇦🇺',
  Canada: '🇨🇦',
  'New Zealand': '🇳🇿',
  UK: '🇬🇧',
  USA: '🇺🇸',
  Other: '🌍',
};

interface StepCountryProps {
  onSelect: (country: Country) => void;
}

export default function StepCountry({ onSelect }: StepCountryProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      <h1 className="text-2xl sm:text-[28px] font-bold text-white mb-2">
        Let&apos;s make sure we can help you
      </h1>
      <p className="text-zinc-400 text-base mb-8">
        Where are you a tax resident?
      </p>

      <div className="space-y-3">
        {COUNTRIES.map((country) => (
          <ButtonCard
            key={country}
            label={country}
            icon={<span>{COUNTRY_ICONS[country]}</span>}
            onClick={() => onSelect(country)}
          />
        ))}
      </div>
    </motion.div>
  );
}

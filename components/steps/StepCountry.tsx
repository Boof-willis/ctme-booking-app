'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ButtonCard from '@/components/ButtonCard';
import { COUNTRIES } from '@/lib/constants';
import { OTHER_COUNTRIES } from '@/lib/countries';
import { Country } from '@/types/survey';

const COUNTRY_ICONS: Record<string, string> = {
  Australia: '\u{1F1E6}\u{1F1FA}',
  Canada: '\u{1F1E8}\u{1F1E6}',
  'New Zealand': '\u{1F1F3}\u{1F1FF}',
  UK: '\u{1F1EC}\u{1F1E7}',
  USA: '\u{1F1FA}\u{1F1F8}',
  Other: '\u{1F30D}',
};

interface StepCountryProps {
  onSelect: (country: Country, otherCountryName?: string, otherCountryCode?: string) => void;
}

export default function StepCountry({ onSelect }: StepCountryProps) {
  const [showOtherPicker, setShowOtherPicker] = useState(false);
  const [search, setSearch] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const filteredCountries = useMemo(() => {
    if (!search.trim()) return OTHER_COUNTRIES;
    const q = search.toLowerCase().trim();
    return OTHER_COUNTRIES.filter((c) => c.name.toLowerCase().includes(q));
  }, [search]);

  useEffect(() => {
    if (showOtherPicker && searchRef.current) {
      searchRef.current.focus();
    }
  }, [showOtherPicker]);

  const handleOtherClick = () => {
    setShowOtherPicker(true);
    setSearch('');
  };

  const handleCountryPick = (name: string, code: string) => {
    onSelect('Other', name, code);
  };

  const handleBackToMain = () => {
    setShowOtherPicker(false);
    setSearch('');
  };

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
      <p className="font-mono text-[#beb086] text-sm mb-8">
        &gt; Where are you a tax resident?
      </p>

      <AnimatePresence mode="wait">
        {!showOtherPicker ? (
          <motion.div
            key="main-countries"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="space-y-3"
          >
            {COUNTRIES.map((country) => (
              <ButtonCard
                key={country}
                label={country}
                icon={<span>{COUNTRY_ICONS[country]}</span>}
                onClick={
                  country === 'Other'
                    ? handleOtherClick
                    : () => onSelect(country)
                }
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="other-picker"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <button
              type="button"
              onClick={handleBackToMain}
              className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-zinc-500 hover:text-[#beb086] transition-colors mb-4 cursor-pointer"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Back
            </button>

            <div className="relative mb-3">
              <svg
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
                <path d="M11 11L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search countries..."
                className="w-full rounded-none border border-zinc-800 bg-zinc-950 pl-10 pr-4 py-3 text-white font-mono text-sm placeholder:text-zinc-600 focus:outline-none focus:border-[#beb086] focus:ring-1 focus:ring-[#beb086] transition-colors"
              />
            </div>

            <div
              ref={listRef}
              className="max-h-[320px] overflow-y-auto rounded-none border border-zinc-800 bg-black divide-y divide-zinc-900 overscroll-contain mt-1"
              style={{ scrollbarWidth: 'thin', scrollbarColor: '#3f3f46 transparent' }}
            >
              {filteredCountries.length > 0 ? (
                filteredCountries.map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => handleCountryPick(c.name, c.code)}
                    className="w-full text-left px-4 py-3 text-sm font-mono text-white hover:bg-zinc-900 hover:text-[#beb086] transition-colors cursor-pointer group flex items-center"
                  >
                    <span className="opacity-0 group-hover:opacity-100 text-[#beb086] mr-2 transition-opacity">&gt;</span>
                    {c.name}
                  </button>
                ))
              ) : (
                <div className="px-4 py-8 text-center text-sm font-mono text-zinc-600">
                  No countries found
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

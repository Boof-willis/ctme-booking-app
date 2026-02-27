'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ButtonCard from '@/components/ButtonCard';
import BackButton from '@/components/BackButton';
import { TAX_SOFTWARE_OPTIONS } from '@/lib/constants';
import { TaxSoftware } from '@/types/survey';

interface StepSoftwareProps {
  hasTaxSoftware?: boolean;
  taxSoftwareName?: TaxSoftware;
  onSelect: (hasSoftware: boolean, name?: TaxSoftware) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function StepSoftware({
  hasTaxSoftware,
  taxSoftwareName,
  onSelect,
  onNext,
  onBack,
}: StepSoftwareProps) {
  const [showDropdown, setShowDropdown] = useState(hasTaxSoftware === true);
  const [selectedSoftware, setSelectedSoftware] = useState<TaxSoftware | undefined>(taxSoftwareName);

  const handleYes = () => {
    setShowDropdown(true);
    onSelect(true, selectedSoftware);
  };

  const handleNo = () => {
    setShowDropdown(false);
    onSelect(false, undefined);
    onNext();
  };

  const handleSoftwareSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value as TaxSoftware;
    setSelectedSoftware(val);
    onSelect(true, val);
  };

  const handleContinue = () => {
    if (selectedSoftware) {
      onNext();
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
        Do you currently have crypto tax software set up?
      </h1>
      <p className="text-zinc-400 text-base mb-8">&nbsp;</p>

      <div className="space-y-3 mb-6">
        <ButtonCard
          label="Yes"
          selected={hasTaxSoftware === true}
          onClick={handleYes}
        />
        <ButtonCard
          label="No"
          selected={hasTaxSoftware === false}
          onClick={handleNo}
        />
      </div>

      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <label htmlFor="software-select" className="block text-sm font-medium text-zinc-300 mb-2">
              Which software?
            </label>
            <select
              id="software-select"
              value={selectedSoftware || ''}
              onChange={handleSoftwareSelect}
              className="
                w-full rounded-xl border border-white/[0.08] bg-[#16161F] px-4 py-3
                text-white text-base appearance-none
                focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30
                cursor-pointer
              "
            >
              <option value="" disabled>
                Select your software
              </option>
              {TAX_SOFTWARE_OPTIONS.map((sw) => (
                <option key={sw} value={sw}>
                  {sw}
                </option>
              ))}
            </select>

            <motion.button
              type="button"
              onClick={handleContinue}
              disabled={!selectedSoftware}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="
                mt-6 w-full rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500
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
        )}
      </AnimatePresence>
    </motion.div>
  );
}

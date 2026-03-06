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
      <p className="font-mono text-[#beb086] text-sm mb-8">&gt; Select yes or no</p>

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
            <label htmlFor="software-select" className="block text-xs font-mono uppercase tracking-wider text-zinc-500 mb-2">
              [ Which software? ]
            </label>
            <select
              id="software-select"
              value={selectedSoftware || ''}
              onChange={handleSoftwareSelect}
              className="
                w-full rounded-none border border-zinc-800 bg-black px-4 py-3
                text-white font-mono text-sm appearance-none
                focus:outline-none focus:border-[#beb086] focus:ring-1 focus:ring-[#beb086]
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
                mt-6 w-full rounded-none bg-[#beb086]
                py-3.5 text-base font-bold text-black font-mono uppercase tracking-wider
                transition-colors hover:bg-[#a69970]
                disabled:opacity-30 disabled:cursor-not-allowed
                cursor-pointer
              "
            >
              [ Next ]
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

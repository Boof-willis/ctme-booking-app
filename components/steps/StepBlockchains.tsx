'use client';

import { motion } from 'framer-motion';
import MultiSelectPill from '@/components/MultiSelectPill';
import BackButton from '@/components/BackButton';
import { BLOCKCHAINS } from '@/lib/constants';
import { Blockchain } from '@/types/survey';

interface StepBlockchainsProps {
  selected: Blockchain[];
  onChange: (chains: Blockchain[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function StepBlockchains({ selected, onChange, onNext, onBack }: StepBlockchainsProps) {
  const toggle = (chain: Blockchain) => {
    onChange(
      selected.includes(chain)
        ? selected.filter((c) => c !== chain)
        : [...selected, chain]
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
        Which blockchains have you used?
      </h1>
      <p className="font-mono text-[#beb086] text-sm mb-8">
        &gt; Select all that apply — this helps us prepare for your call
      </p>

      <div className="flex flex-wrap gap-2.5 mb-8">
        {BLOCKCHAINS.map((chain) => (
          <MultiSelectPill
            key={chain}
            label={chain}
            selected={selected.includes(chain)}
            onClick={() => toggle(chain)}
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
          w-full rounded-none bg-[#beb086]
          py-3.5 text-base font-bold text-black font-mono uppercase tracking-wider
          transition-colors hover:bg-[#a69970]
          disabled:opacity-30 disabled:cursor-not-allowed
          cursor-pointer
        "
      >
        [ Next ]
      </motion.button>
    </motion.div>
  );
}

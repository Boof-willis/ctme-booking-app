'use client';

import { motion } from 'framer-motion';

interface MultiSelectPillProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

export default function MultiSelectPill({ label, selected, onClick }: MultiSelectPillProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
      animate={selected ? { scale: [1, 1.05, 1] } : {}}
      transition={{ duration: 0.1 }}
      className={`
        rounded-none border px-5 py-2.5 text-sm font-mono transition-colors
        focus:outline-none focus-visible:ring-1 focus-visible:ring-[#beb086]
        ${
          selected
            ? 'border-[#beb086] bg-[#beb086]/10 text-white'
            : 'border-zinc-800 bg-black text-white hover:border-[#beb086] hover:text-white'
        }
        cursor-pointer
      `}
      aria-pressed={selected}
      role="checkbox"
      aria-checked={selected}
    >
      {selected ? <span className="mr-1.5 text-[#beb086]">[x]</span> : <span className="mr-1.5 text-zinc-600">[ ]</span>}
      {label}
    </motion.button>
  );
}

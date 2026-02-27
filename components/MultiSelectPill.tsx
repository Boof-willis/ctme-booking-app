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
        rounded-full border px-5 py-2.5 text-sm font-medium transition-colors
        focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0F]
        ${
          selected
            ? 'border-cyan-500/50 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-white shadow-[0_0_12px_rgba(6,182,212,0.15)]'
            : 'border-white/[0.08] bg-[#16161F] text-zinc-300 hover:border-white/[0.15] hover:text-white'
        }
        cursor-pointer
      `}
      aria-pressed={selected}
      role="checkbox"
      aria-checked={selected}
    >
      {selected && <span className="mr-1.5">✓</span>}
      {label}
    </motion.button>
  );
}

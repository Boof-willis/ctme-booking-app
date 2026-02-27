'use client';

import { motion } from 'framer-motion';

interface ButtonCardProps {
  label: string;
  sublabel?: string;
  icon?: React.ReactNode;
  selected?: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export default function ButtonCard({
  label,
  sublabel,
  icon,
  selected = false,
  onClick,
  disabled = false,
}: ButtonCardProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`
        relative w-full rounded-xl border px-5 py-4 text-left transition-colors
        focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0F]
        ${
          selected
            ? 'border-cyan-500/50 bg-cyan-500/10 text-white shadow-[0_0_20px_rgba(6,182,212,0.1)]'
            : 'border-white/[0.08] bg-[#16161F] text-white hover:border-white/[0.15] hover:bg-[#1C1C28]'
        }
        ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
      `}
      aria-pressed={selected}
    >
      <div className="flex items-center gap-3">
        {icon && <span className="text-xl shrink-0">{icon}</span>}
        <div>
          <span className="block text-base font-medium">{label}</span>
          {sublabel && (
            <span className="block mt-0.5 text-sm text-zinc-400">{sublabel}</span>
          )}
        </div>
      </div>
    </motion.button>
  );
}

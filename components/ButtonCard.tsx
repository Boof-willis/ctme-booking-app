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
        group relative w-full rounded-none border px-5 py-4 text-left transition-colors
        focus:outline-none focus-visible:ring-1 focus-visible:ring-[#beb086]
        ${
          selected
            ? 'border-[#beb086] bg-[#beb086]/10 text-white'
            : 'border-zinc-800 bg-black text-white hover:border-[#beb086] hover:text-white'
        }
        ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
      `}
      aria-pressed={selected}
    >
      <div className="flex items-center gap-3">
        <span className={`font-mono text-[#beb086] transition-opacity duration-200 ${selected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
          &gt;
        </span>
        {icon && (
          <span className={`text-xl shrink-0 transition-all duration-200 ${selected ? 'opacity-100' : 'opacity-100 group-hover:opacity-100'}`}>
            {icon}
          </span>
        )}
        <div>
          <span className="block text-base font-medium">{label}</span>
          {sublabel && (
            <span className="block mt-0.5 text-sm opacity-80">{sublabel}</span>
          )}
        </div>
      </div>
    </motion.button>
  );
}

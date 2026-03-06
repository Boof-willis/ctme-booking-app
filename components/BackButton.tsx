'use client';

import { motion } from 'framer-motion';

interface BackButtonProps {
  onClick: () => void;
}

export default function BackButton({ onClick }: BackButtonProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ x: -2 }}
      whileTap={{ scale: 0.95 }}
      className="
        mb-4 inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-zinc-500 transition-colors
        hover:text-[#beb086] focus:outline-none focus-visible:text-[#beb086]
        cursor-pointer
      "
      aria-label="Go back to previous step"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        className="shrink-0"
      >
        <path
          d="M10 12L6 8L10 4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      Back
    </motion.button>
  );
}

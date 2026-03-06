'use client';

import { motion } from 'framer-motion';

export default function DisqualifiedScreen() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center text-center px-6 py-16"
    >
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-none bg-black border border-zinc-800">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-[#beb086]">
          <path
            d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M12 8V12M12 16H12.01"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <h1 className="text-2xl font-bold text-white mb-3">
        We&apos;re not available in your region yet
      </h1>

      <p className="text-zinc-500 font-mono text-sm max-w-sm leading-relaxed">
        &gt; We currently serve clients in Australia, Canada, New Zealand, the UK, and the USA.
        We&apos;re expanding — check back soon.
      </p>
    </motion.div>
  );
}

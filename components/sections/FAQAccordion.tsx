'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FAQAccordionProps {
  question: string;
  answer: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}

export function FAQAccordion({ question, answer, isOpen, onToggle }: FAQAccordionProps) {
  return (
    <div className="border-b border-zinc-800">
      <button
        onClick={onToggle}
        className="w-full py-6 flex items-center justify-between text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#beb086] focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
        aria-expanded={isOpen}
      >
        <span className="text-lg font-bold text-white pr-8">{question}</span>
        <span className="shrink-0 text-[#beb086] text-xl font-mono w-6 h-6 flex items-center justify-center border border-zinc-800 bg-zinc-900">
          {isOpen ? '-' : '+'}
        </span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="pb-6 text-zinc-400 leading-relaxed max-w-3xl pr-12">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

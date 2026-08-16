'use client';

import { motion } from 'framer-motion';
import { STEPS } from '@/lib/constants';

interface ProgressBarProps {
  currentStep: number;
}

/**
 * Perceived progress is deliberately front-loaded: the bar jumps quickly
 * through the early one-tap questions and creeps toward the end, so the
 * survey feels shorter than it is. Ease-out curve; exponent tunes the bias.
 */
const EASE_EXPONENT = 1.8;
const START_PERCENT = 4;
const END_PERCENT = 96;

function perceivedProgress(step: number, total: number): number {
  const t = total > 1 ? step / (total - 1) : 1;
  const eased = 1 - Math.pow(1 - t, EASE_EXPONENT);
  return START_PERCENT + (END_PERCENT - START_PERCENT) * eased;
}

export default function ProgressBar({ currentStep }: ProgressBarProps) {
  const total = STEPS.length;
  const isComplete = currentStep >= total;
  const progressPercent = isComplete ? 100 : perceivedProgress(currentStep, total);
  const clampedProgress = Math.min(Math.max(progressPercent, 2), 100);

  const currentLabel = isComplete ? 'Booked' : (STEPS[currentStep]?.label || '');

  return (
    <div className="w-full mb-8">
      <div className="mb-2 font-mono">
        <span className="text-xs uppercase tracking-wider text-[#beb086]">{currentLabel}</span>
      </div>

      {/* Progress track */}
      <div className="relative h-[2px] w-full bg-zinc-800">
        <motion.div
          className="absolute left-0 top-0 h-full bg-[#beb086]"
          initial={{ width: '2%' }}
          animate={{ width: `${clampedProgress}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

'use client';

import { motion } from 'framer-motion';
import { STEPS } from '@/lib/constants';

interface ProgressBarProps {
  currentStep: number;
}

export default function ProgressBar({ currentStep }: ProgressBarProps) {
  const totalSegments = STEPS.length;
  const isComplete = currentStep >= totalSegments;
  const progressPercent = isComplete
    ? 100
    : ((currentStep + 0.15) / totalSegments) * 100;
  const clampedProgress = Math.min(Math.max(progressPercent, 2), 100);

  const currentLabel = isComplete ? 'Booked' : (STEPS[currentStep]?.label || '');
  const displayStep = isComplete ? totalSegments : currentStep + 1;

  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between mb-2 font-mono">
        <span className="text-xs uppercase tracking-wider text-[#beb086]">{currentLabel}</span>
        <span className="text-xs text-zinc-500">
          [ {displayStep} / {totalSegments} ]
        </span>
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

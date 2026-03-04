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
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-cyan-400">{currentLabel}</span>
        <span className="text-xs text-zinc-500">
          {displayStep} / {totalSegments}
        </span>
      </div>

      {/* Progress track */}
      <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
        <motion.div
          className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"
          initial={{ width: '2%' }}
          animate={{ width: `${clampedProgress}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

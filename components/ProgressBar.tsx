'use client';

import { motion } from 'framer-motion';
import { STEPS } from '@/lib/constants';

interface ProgressBarProps {
  currentStep: number;
}

export default function ProgressBar({ currentStep }: ProgressBarProps) {
  const totalSegments = STEPS.length;
  // Endowed progress: step 0 (first step) shows ~15% within its own segment
  const progressPercent = ((currentStep + 0.15) / totalSegments) * 100;
  const clampedProgress = Math.min(Math.max(progressPercent, 2), 100);

  return (
    <div className="w-full mb-8">
      {/* Segment labels — hidden on mobile */}
      <div className="hidden sm:grid sm:grid-cols-7 gap-1 mb-2">
        {STEPS.map((step, i) => (
          <span
            key={step.id}
            className={`text-[11px] text-center font-medium truncate ${
              i <= currentStep ? 'text-cyan-400' : 'text-zinc-600'
            }`}
          >
            {i < currentStep ? '✓ ' : ''}
            {step.label}
          </span>
        ))}
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

      {/* Step counter on mobile */}
      <div className="sm:hidden mt-2 text-center">
        <span className="text-xs text-zinc-500">
          Step {currentStep + 1} of {totalSegments}
        </span>
      </div>
    </div>
  );
}

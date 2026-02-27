'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import BackButton from '@/components/BackButton';
import { isValidEmail } from '@/lib/validation';

interface StepContactInfoProps {
  firstName?: string;
  email?: string;
  onSubmit: (firstName: string, email: string, honeypot: string) => void;
  onBack: () => void;
  isSubmitting: boolean;
  error: string | null;
}

export default function StepContactInfo({
  firstName: initialFirstName,
  email: initialEmail,
  onSubmit,
  onBack,
  isSubmitting,
  error,
}: StepContactInfoProps) {
  const [firstName, setFirstName] = useState(initialFirstName || '');
  const [email, setEmail] = useState(initialEmail || '');
  const [honeypot, setHoneypot] = useState('');
  const [emailError, setEmailError] = useState('');
  const [nameError, setNameError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = firstName.trim();
    const trimmedEmail = email.trim();

    let valid = true;

    if (!trimmedName) {
      setNameError('Please enter your first name');
      valid = false;
    } else {
      setNameError('');
    }

    if (!trimmedEmail) {
      setEmailError('Please enter your email');
      valid = false;
    } else if (!isValidEmail(trimmedEmail)) {
      setEmailError('Please enter a valid email address');
      valid = false;
    } else {
      setEmailError('');
    }

    if (valid) {
      onSubmit(trimmedName, trimmedEmail, honeypot);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      <BackButton onClick={onBack} />

      <h1 className="text-2xl sm:text-[28px] font-bold text-white mb-2">
        Great — let&apos;s find you a time to talk
      </h1>
      <p className="text-zinc-400 text-base mb-8">
        We&apos;ll use this to send your booking confirmation
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Honeypot — invisible to users */}
        <input
          type="text"
          name="website"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          style={{ position: 'absolute', left: '-9999px' }}
        />

        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-zinc-300 mb-1.5">
            First Name
          </label>
          <input
            id="firstName"
            type="text"
            value={firstName}
            onChange={(e) => {
              setFirstName(e.target.value);
              if (nameError) setNameError('');
            }}
            placeholder="Your first name"
            autoComplete="given-name"
            className={`
              w-full rounded-xl border bg-[#16161F] px-4 py-3 text-white text-base
              placeholder:text-zinc-600
              focus:outline-none focus:ring-1
              ${nameError
                ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/30'
                : 'border-white/[0.08] focus:border-cyan-500/50 focus:ring-cyan-500/30'
              }
            `}
          />
          {nameError && <p className="mt-1.5 text-sm text-red-400">{nameError}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-1.5">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (emailError) setEmailError('');
            }}
            placeholder="you@example.com"
            autoComplete="email"
            className={`
              w-full rounded-xl border bg-[#16161F] px-4 py-3 text-white text-base
              placeholder:text-zinc-600
              focus:outline-none focus:ring-1
              ${emailError
                ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/30'
                : 'border-white/[0.08] focus:border-cyan-500/50 focus:ring-cyan-500/30'
              }
            `}
          />
          {emailError && <p className="mt-1.5 text-sm text-red-400">{emailError}</p>}
        </div>

        {error && (
          <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="
            w-full rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500
            py-3.5 text-base font-semibold text-white
            shadow-[0_0_20px_rgba(59,130,246,0.25)]
            transition-opacity hover:opacity-90
            disabled:opacity-50 disabled:cursor-not-allowed
            cursor-pointer
          "
        >
          {isSubmitting ? (
            <span className="inline-flex items-center gap-2">
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Saving…
            </span>
          ) : (
            'See Available Times →'
          )}
        </motion.button>
      </form>
    </motion.div>
  );
}

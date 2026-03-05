'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import BackButton from '@/components/BackButton';
import { isValidEmail, isValidPhone } from '@/lib/validation';
import { getDialCodeForCountry } from '@/lib/countries';

interface StepContactInfoProps {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  country?: string;
  otherCountryCode?: string;
  onSubmit: (firstName: string, lastName: string | undefined, email: string, phone: string | undefined, honeypot: string, agreedToTos: boolean) => void;
  onBack: () => void;
  isSubmitting: boolean;
  error: string | null;
}

export default function StepContactInfo({
  firstName: initialFirstName,
  lastName: initialLastName,
  email: initialEmail,
  phone: initialPhone,
  country,
  otherCountryCode,
  onSubmit,
  onBack,
  isSubmitting,
  error,
}: StepContactInfoProps) {
  const defaultDialCode = getDialCodeForCountry(country, otherCountryCode);

  const initialFullName = [initialFirstName, initialLastName].filter(Boolean).join(' ');
  const [fullName, setFullName] = useState(initialFullName || '');
  const [email, setEmail] = useState(initialEmail || '');
  const [dialCode, setDialCode] = useState(() => {
    if (initialPhone && initialPhone.startsWith('+')) {
      const digits = initialPhone.replace(/[^+\d]/g, '');
      const defaultLen = defaultDialCode.length;
      return digits.slice(0, defaultLen) || defaultDialCode;
    }
    return defaultDialCode;
  });
  const [phone, setPhone] = useState(() => {
    if (initialPhone && initialPhone.startsWith('+')) {
      const digits = initialPhone.replace(/\D/g, '');
      const codeDigits = defaultDialCode.replace(/\D/g, '');
      if (digits.startsWith(codeDigits)) {
        return digits.slice(codeDigits.length);
      }
      return digits;
    }
    return initialPhone || '';
  });
  const [honeypot, setHoneypot] = useState('');
  const [agreedToTos, setAgreedToTos] = useState(false);
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [tosError, setTosError] = useState('');

  const handleDialCodeChange = (value: string) => {
    const cleaned = value.replace(/[^+\d]/g, '');
    if (!cleaned.startsWith('+')) {
      setDialCode('+' + cleaned);
    } else {
      setDialCode(cleaned);
    }
    if (phoneError) setPhoneError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim();
    let valid = true;

    if (!trimmedName) {
      setNameError('Please enter your name');
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

    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits) {
      const fullPhone = `${dialCode}${phoneDigits}`;
      if (!isValidPhone(fullPhone)) {
        setPhoneError('Please enter a valid phone number');
        valid = false;
      } else {
        setPhoneError('');
      }
    } else {
      setPhoneError('');
    }

    if (!agreedToTos) {
      setTosError('You must agree to continue');
      valid = false;
    } else {
      setTosError('');
    }

    if (valid) {
      const parts = trimmedName.split(/\s+/);
      const firstName = parts[0];
      const lastName = parts.length > 1 ? parts.slice(1).join(' ') : undefined;
      const fullPhone = phoneDigits ? `${dialCode}${phoneDigits}` : undefined;
      onSubmit(firstName, lastName, trimmedEmail, fullPhone, honeypot, agreedToTos);
    }
  };

  const inputBase = 'w-full rounded-xl border bg-[#16161F] px-4 py-3 text-white text-base placeholder:text-zinc-600 focus:outline-none focus:ring-1';
  const inputNormal = 'border-white/[0.08] focus:border-cyan-500/50 focus:ring-cyan-500/30';
  const inputError = 'border-red-500/50 focus:border-red-500 focus:ring-red-500/30';

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
          <label htmlFor="fullName" className="block text-sm font-medium text-zinc-300 mb-1.5">
            Name
          </label>
          <input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value);
              if (nameError) setNameError('');
            }}
            placeholder="Your full name"
            autoComplete="name"
            className={`${inputBase} ${nameError ? inputError : inputNormal}`}
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
            className={`${inputBase} ${emailError ? inputError : inputNormal}`}
          />
          {emailError && <p className="mt-1.5 text-sm text-red-400">{emailError}</p>}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-zinc-300 mb-1.5">
            Phone <span className="text-zinc-500 font-normal">(optional)</span>
          </label>
          <div className="flex gap-2">
            <input
              type="tel"
              value={dialCode}
              onChange={(e) => handleDialCodeChange(e.target.value)}
              aria-label="Country dial code"
              className={`
                w-[72px] shrink-0 rounded-xl border bg-[#16161F] px-3 py-3
                text-center text-white text-base
                focus:outline-none focus:ring-1
                ${phoneError ? inputError : inputNormal}
              `}
            />
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, '').slice(0, 15);
                setPhone(digits);
                if (phoneError) setPhoneError('');
              }}
              placeholder="Phone number"
              autoComplete="tel-national"
              className={`${inputBase} ${phoneError ? inputError : inputNormal}`}
            />
          </div>
          {phoneError && <p className="mt-1.5 text-sm text-red-400">{phoneError}</p>}
        </div>

        <div>
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={agreedToTos}
              onChange={(e) => {
                setAgreedToTos(e.target.checked);
                if (tosError) setTosError('');
              }}
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-white/20 bg-[#16161F] accent-cyan-500"
            />
            <span className={`text-sm leading-snug ${tosError ? 'text-red-400' : 'text-zinc-400'}`}>
              I agree to the{' '}
              <a
                href="https://cryptotaxmadeeasy.com/terms-of-service/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-white hover:text-cyan-400 transition-colors"
              >
                Terms of Service
              </a>{' '}
              and consent to being contacted by Crypto Tax Made Easy.
            </span>
          </label>
          {tosError && <p className="mt-1.5 ml-7 text-sm text-red-400">{tosError}</p>}
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

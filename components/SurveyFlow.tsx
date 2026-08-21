'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { useSurveyState } from '@/hooks/useSurveyState';
import ProgressBar from '@/components/ProgressBar';
import DisqualifiedScreen from '@/components/DisqualifiedScreen';
import StepCountry from '@/components/steps/StepCountry';
import StepBracket from '@/components/steps/StepBracket';
import StepTaxYears from '@/components/steps/StepTaxYears';
import StepBlockchains from '@/components/steps/StepBlockchains';
import StepSoftware from '@/components/steps/StepSoftware';
import StepContactInfo from '@/components/steps/StepContactInfo';
import StepCalendar from '@/components/steps/StepCalendar';
import {
  Country,
  CalendarSlot,
  TaxSoftware,
  GainsBracket,
  PortfolioBracket,
  TransactionBracket,
} from '@/types/survey';
import { isHoneypotFilled } from '@/lib/validation';
import {
  trackSurveyStarted,
  trackEmailCaptured,
  trackAppointmentBooked,
  trackQualified,
  trackQuoteRequested,
} from '@/lib/tracking';
import { STEPS, GAINS_BRACKETS, PORTFOLIO_BRACKETS, TRANSACTION_BRACKETS } from '@/lib/constants';
import { isQualified } from '@/lib/qualification';

export default function SurveyFlow({ tag }: { tag?: string } = {}) {
  const state = useSurveyState();
  const router = useRouter();
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactError, setContactError] = useState<string | null>(null);
  const [flowComplete, setFlowComplete] = useState(false);

  const handleCountrySelect = useCallback(
    (country: Country, otherCountryName?: string, otherCountryCode?: string) => {
      state.setCountry(country, otherCountryName, otherCountryCode);
      trackSurveyStarted();
      state.goNext();
    },
    [state]
  );

  const handleGainsSelect = useCallback(
    (gainsBracket: GainsBracket) => {
      state.setQualifier({ gainsBracket });
      state.goNext();
    },
    [state]
  );

  const handlePortfolioSelect = useCallback(
    (portfolioBracket: PortfolioBracket) => {
      state.setQualifier({ portfolioBracket });
      state.goNext();
    },
    [state]
  );

  // Last of the three qualifier questions: gate here. Evaluate against the
  // just-selected value since the state update hasn't flushed yet.
  const handleTransactionsSelect = useCallback(
    (transactionBracket: TransactionBracket) => {
      state.setQualifier({ transactionBracket });
      if (isQualified({ ...state.surveyData, transactionBracket })) {
        state.setLeadPath('call');
        trackQualified();
        state.goNext();
      } else {
        state.disqualify();
      }
    },
    [state]
  );

  const handleContactSubmit = useCallback(
    async (firstName: string, lastName: string | undefined, email: string, phone: string | undefined, honeypot: string, agreedToTos: boolean) => {
      const leadPath = state.surveyData.leadPath ?? 'call';
      const isQuote = leadPath === 'quote';

      if (isHoneypotFilled(honeypot)) {
        state.setContactInfo(firstName, lastName, email, phone, honeypot, agreedToTos);
        if (isQuote) {
          state.completeFlow();
          router.push('/consultation/quote-requested');
        } else {
          state.goNext();
        }
        return;
      }

      state.setContactInfo(firstName, lastName, email, phone, honeypot, agreedToTos);
      setContactSubmitting(true);
      setContactError(null);

      try {
        const res = await fetch('/api/ghl/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            firstName,
            lastName,
            email,
            phone,
            tag,
            leadPath,
            surveyData: {
              country: state.surveyData.country,
              otherCountryName: state.surveyData.otherCountryName,
              otherCountryCode: state.surveyData.otherCountryCode,
              gainsBracket: state.surveyData.gainsBracket,
              portfolioBracket: state.surveyData.portfolioBracket,
              transactionBracket: state.surveyData.transactionBracket,
              taxYears: state.surveyData.taxYears,
              blockchains: state.surveyData.blockchains,
              hasTaxSoftware: state.surveyData.hasTaxSoftware,
              taxSoftwareName: state.surveyData.taxSoftwareName,
              agreedToTos,
              utmParams: state.surveyData.utmParams,
            },
          }),
        });

        if (!res.ok) throw new Error('Failed to save contact');

        const data = await res.json();

        // Quote path ends here: no calendar, contact is tagged for the GHL
        // quote trigger. Don't store contactId — nothing downstream needs it.
        if (isQuote) {
          trackEmailCaptured('quote');
          trackQuoteRequested();
          state.completeFlow();
          router.push('/consultation/quote-requested');
          return;
        }

        state.setContactId(data.contactId);
        trackEmailCaptured();
        state.goNext();
      } catch {
        setContactError('Something went wrong. Please try again.');
      } finally {
        setContactSubmitting(false);
      }
    },
    [state, tag, router]
  );

  const handleSlotSelect = useCallback(
    (slot: CalendarSlot, timezone: string) => {
      state.setSelectedSlot(slot, timezone);
    },
    [state]
  );

  const handleBook = useCallback(async () => {
    const { contactId, selectedSlot, timezone, surveyData } = {
      contactId: state.surveyData.contactId,
      selectedSlot: state.surveyData.selectedSlot,
      timezone: state.surveyData.timezone,
      surveyData: state.surveyData,
    };

    if (!contactId || !selectedSlot || !timezone) {
      throw new Error('Missing booking data');
    }

    const res = await fetch('/api/ghl/book', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contactId,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        timezone,
        firstName: surveyData.firstName,
      }),
    });

    if (!res.ok) throw new Error('Booking failed');

    const data = await res.json();
    state.setAppointmentId(data.appointmentId);
    trackAppointmentBooked();

    const hasSoftware = state.surveyData.hasTaxSoftware ? 'yes' : 'no';
    try {
      sessionStorage.setItem('ctme_contact_id', state.surveyData.contactId || '');
    } catch { /* unavailable */ }

    state.completeFlow();
    router.push(`/consultation/thank-you?has_software=${hasSoftware}`);
  }, [state, router]);

  const handleSoftwareSelect = useCallback(
    (hasSoftware: boolean, name?: TaxSoftware) => {
      state.setTaxSoftware(hasSoftware, name);
    },
    [state]
  );

  if (!state.isHydrated) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" />
      </div>
    );
  }

  if (state.isDisqualified) {
    return (
      <DisqualifiedScreen
        reason="size"
        utmParams={state.surveyData.utmParams}
        onRequestQuote={state.requestQuote}
      />
    );
  }

  const isQuotePath = state.surveyData.leadPath === 'quote';

  const renderStep = () => {
    switch (state.currentStep) {
      case 0:
        return <StepCountry key="country" onSelect={handleCountrySelect} />;
      case 1:
        return (
          <StepBracket
            key="gains"
            title="Roughly, what are your total realized crypto gains?"
            hint="Across the years you need help with, approx. USD"
            options={GAINS_BRACKETS}
            value={state.surveyData.gainsBracket}
            onSelect={handleGainsSelect}
            onBack={state.goBack}
          />
        );
      case 2:
        return (
          <StepBracket
            key="portfolio"
            title="What's your current portfolio worth?"
            hint="All wallets and exchanges combined, approx. USD"
            options={PORTFOLIO_BRACKETS}
            value={state.surveyData.portfolioBracket}
            onSelect={handlePortfolioSelect}
            onBack={state.goBack}
          />
        );
      case 3:
        return (
          <StepBracket
            key="transactions"
            title="How many transactions, all time?"
            hint="Every wallet and exchange, rough estimate is fine"
            options={TRANSACTION_BRACKETS}
            value={state.surveyData.transactionBracket}
            onSelect={handleTransactionsSelect}
            onBack={state.goBack}
          />
        );
      case 4:
        return (
          <StepTaxYears
            key="tax-years"
            selected={state.surveyData.taxYears}
            onChange={state.setTaxYears}
            onNext={state.goNext}
            onBack={state.goBack}
          />
        );
      case 5:
        return (
          <StepBlockchains
            key="blockchains"
            hint={isQuotePath ? 'Select all that apply — this helps us scope your quote' : undefined}
            selected={state.surveyData.blockchains}
            onChange={state.setBlockchains}
            onNext={state.goNext}
            onBack={state.goBack}
          />
        );
      case 6:
        return (
          <StepSoftware
            key="software"
            hasTaxSoftware={state.surveyData.hasTaxSoftware}
            taxSoftwareName={state.surveyData.taxSoftwareName}
            onSelect={handleSoftwareSelect}
            onNext={state.goNext}
            onBack={state.goBack}
          />
        );
      case 7:
        return (
          <StepContactInfo
            key="contact-info"
            variant={isQuotePath ? 'quote' : 'call'}
            firstName={state.surveyData.firstName}
            lastName={state.surveyData.lastName}
            email={state.surveyData.email}
            phone={state.surveyData.phone}
            country={state.surveyData.country}
            otherCountryCode={state.surveyData.otherCountryCode}
            onSubmit={handleContactSubmit}
            onBack={state.goBack}
            isSubmitting={contactSubmitting}
            error={contactError}
          />
        );
      case 8:
        return (
          <StepCalendar
            key="calendar"
            selectedSlot={state.surveyData.selectedSlot || null}
            onSlotSelect={handleSlotSelect}
            onBook={handleBook}
            onBack={state.goBack}
            acknowledgedMinimum={state.surveyData.acknowledgedMinimum === true}
            onAcknowledgeMinimum={state.setAcknowledgedMinimum}
          />
        );
      default:
        return null;
    }
  };

  if (flowComplete) {
    const tz = state.surveyData.timezone || 'America/Denver';
    const slot = state.surveyData.selectedSlot;
    return (
      <div>
        <ProgressBar currentStep={STEPS.length} />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
              className="inline-flex h-16 w-16 items-center justify-center rounded-none bg-[#beb086]/10 border border-[#beb086]/20 mb-4"
            >
              <span className="text-3xl grayscale">🎉</span>
            </motion.div>
            <h1 className="text-2xl sm:text-[28px] font-bold text-white mb-2">
              You&apos;re booked!
            </h1>
          </div>

          {slot && (
            <div className="rounded-none border border-zinc-800 bg-black p-4 mb-6">
              <p className="text-xs font-mono uppercase tracking-wider text-zinc-500 mb-1">[ Your appointment ]</p>
              <p className="text-[#beb086] font-mono">
                {new Date(slot.startTime).toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  timeZone: tz,
                })}{' '}
                at{' '}
                {new Date(slot.startTime).toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                  timeZone: tz,
                })}
              </p>
            </div>
          )}

          <div className="rounded-none border border-[#beb086]/20 bg-[#beb086]/5 p-5 text-center">
            <p className="text-white font-mono text-sm">
              &gt; We&apos;ll send a confirmation email to{' '}
              <span className="font-bold text-[#beb086]">{state.surveyData.email}</span>.
            </p>
            {slot && (
              <p className="text-zinc-500 font-mono text-xs mt-2">
                [ See you on {new Date(slot.startTime).toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  timeZone: tz,
                })}! ]
              </p>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div>
      <ProgressBar
        currentStep={state.currentStep}
        totalSteps={isQuotePath ? STEPS.length - 1 : STEPS.length}
      />
      <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>
    </div>
  );
}

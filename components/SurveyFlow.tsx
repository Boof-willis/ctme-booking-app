'use client';

import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSurveyState } from '@/hooks/useSurveyState';
import ProgressBar from '@/components/ProgressBar';
import DisqualifiedScreen from '@/components/DisqualifiedScreen';
import StepCountry from '@/components/steps/StepCountry';
import StepTaxYears from '@/components/steps/StepTaxYears';
import StepBlockchains from '@/components/steps/StepBlockchains';
import StepSoftware from '@/components/steps/StepSoftware';
import StepContactInfo from '@/components/steps/StepContactInfo';
import StepCalendar from '@/components/steps/StepCalendar';
import { Country, CalendarSlot, TaxSoftware } from '@/types/survey';
import { isHoneypotFilled } from '@/lib/validation';
import { trackSurveyStarted, trackEmailCaptured, trackAppointmentBooked } from '@/lib/tracking';
import { STEPS } from '@/lib/constants';

export default function SurveyFlow() {
  const state = useSurveyState();
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

  const handleContactSubmit = useCallback(
    async (firstName: string, lastName: string | undefined, email: string, phone: string | undefined, honeypot: string, agreedToTos: boolean) => {
      if (isHoneypotFilled(honeypot)) {
        state.setContactInfo(firstName, lastName, email, phone, honeypot, agreedToTos);
        state.goNext();
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
            surveyData: {
              country: state.surveyData.country,
              otherCountryName: state.surveyData.otherCountryName,
              otherCountryCode: state.surveyData.otherCountryCode,
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
        state.setContactId(data.contactId);
        trackEmailCaptured();
        state.goNext();
      } catch {
        setContactError('Something went wrong. Please try again.');
      } finally {
        setContactSubmitting(false);
      }
    },
    [state]
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
    state.completeFlow();
    setFlowComplete(true);
  }, [state]);

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
    return <DisqualifiedScreen />;
  }

  const renderStep = () => {
    switch (state.currentStep) {
      case 0:
        return <StepCountry key="country" onSelect={handleCountrySelect} />;
      case 1:
        return (
          <StepTaxYears
            key="tax-years"
            selected={state.surveyData.taxYears}
            onChange={state.setTaxYears}
            onNext={state.goNext}
            onBack={state.goBack}
          />
        );
      case 2:
        return (
          <StepBlockchains
            key="blockchains"
            selected={state.surveyData.blockchains}
            onChange={state.setBlockchains}
            onNext={state.goNext}
            onBack={state.goBack}
          />
        );
      case 3:
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
      case 4:
        return (
          <StepContactInfo
            key="contact-info"
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
      case 5:
        return (
          <StepCalendar
            key="calendar"
            selectedSlot={state.surveyData.selectedSlot || null}
            onSlotSelect={handleSlotSelect}
            onBook={handleBook}
            onBack={state.goBack}
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
      <ProgressBar currentStep={state.currentStep} />
      <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>
    </div>
  );
}

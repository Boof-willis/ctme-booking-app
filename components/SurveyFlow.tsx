'use client';

import { useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useSurveyState } from '@/hooks/useSurveyState';
import ProgressBar from '@/components/ProgressBar';
import DisqualifiedScreen from '@/components/DisqualifiedScreen';
import StepCountry from '@/components/steps/StepCountry';
import StepTaxYears from '@/components/steps/StepTaxYears';
import StepBlockchains from '@/components/steps/StepBlockchains';
import StepSoftware from '@/components/steps/StepSoftware';
import StepContactInfo from '@/components/steps/StepContactInfo';
import StepCalendar from '@/components/steps/StepCalendar';
import StepConfirmation from '@/components/steps/StepConfirmation';
import { Country, CalendarSlot, TaxSoftware } from '@/types/survey';
import { isHoneypotFilled } from '@/lib/validation';
import { trackSurveyStarted, trackEmailCaptured, trackAppointmentBooked } from '@/lib/tracking';
import { VALID_COUNTRIES } from '@/lib/constants';

export default function SurveyFlow() {
  const state = useSurveyState();
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactError, setContactError] = useState<string | null>(null);
  const [confirmSubmitting, setConfirmSubmitting] = useState(false);
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const [flowComplete, setFlowComplete] = useState(false);

  const handleCountrySelect = useCallback(
    (country: Country) => {
      state.setCountry(country);
      if (VALID_COUNTRIES.includes(country)) {
        trackSurveyStarted();
        state.goNext();
      }
    },
    [state]
  );

  const handleContactSubmit = useCallback(
    async (firstName: string, email: string, honeypot: string) => {
      if (isHoneypotFilled(honeypot)) {
        // Silently "succeed" for bots
        state.setContactInfo(firstName, email, honeypot);
        state.goNext();
        return;
      }

      state.setContactInfo(firstName, email, honeypot);
      setContactSubmitting(true);
      setContactError(null);

      try {
        const res = await fetch('/api/ghl/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            firstName,
            email,
            surveyData: {
              country: state.surveyData.country,
              taxYears: state.surveyData.taxYears,
              blockchains: state.surveyData.blockchains,
              hasTaxSoftware: state.surveyData.hasTaxSoftware,
              taxSoftwareName: state.surveyData.taxSoftwareName,
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
    state.goNext();
  }, [state]);

  const handleConfirmSubmit = useCallback(
    async (lastName: string, phone: string) => {
      state.setFinalDetails(lastName, phone);
      setConfirmSubmitting(true);
      setConfirmError(null);

      try {
        const contactId = state.surveyData.contactId;
        if (!contactId) throw new Error('No contact ID');

        const res = await fetch('/api/ghl/contact', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contactId, lastName, phone }),
        });

        if (!res.ok) throw new Error('Failed to update contact');

        state.completeFlow();
        setFlowComplete(true);
      } catch {
        setConfirmError('Something went wrong. Please try again.');
      } finally {
        setConfirmSubmitting(false);
      }
    },
    [state]
  );

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
            email={state.surveyData.email}
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
      case 6:
        return state.surveyData.selectedSlot ? (
          <StepConfirmation
            key="confirmation"
            selectedSlot={state.surveyData.selectedSlot}
            timezone={state.surveyData.timezone || 'UTC'}
            email={state.surveyData.email || ''}
            country={state.surveyData.country || ''}
            lastName={state.surveyData.lastName}
            phone={state.surveyData.phone}
            onSubmit={handleConfirmSubmit}
            isSubmitting={confirmSubmitting}
            isComplete={flowComplete}
            error={confirmError}
          />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <div>
      <ProgressBar currentStep={state.currentStep} />
      <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>
    </div>
  );
}

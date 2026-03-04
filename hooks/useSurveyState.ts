'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { SurveyData, Country, TaxYear, Blockchain, TaxSoftware, CalendarSlot } from '@/types/survey';
import { SESSION_KEYS, STEPS } from '@/lib/constants';
import { parseUTMParams } from '@/lib/utm';

const DEFAULT_DATA: SurveyData = {
  country: undefined,
  otherCountryName: undefined,
  otherCountryCode: undefined,
  taxYears: [],
  blockchains: [],
  hasTaxSoftware: undefined,
  taxSoftwareName: undefined,
  firstName: undefined,
  lastName: undefined,
  email: undefined,
  phone: undefined,
  honeypot: undefined,
  utmParams: {},
  contactId: undefined,
  selectedSlot: undefined,
  timezone: undefined,
  appointmentId: undefined,
};

function loadSession(): { step: number; data: SurveyData } | null {
  if (typeof window === 'undefined') return null;
  try {
    const stepStr = sessionStorage.getItem(SESSION_KEYS.step);
    const dataStr = sessionStorage.getItem(SESSION_KEYS.data);
    if (stepStr && dataStr) {
      return { step: JSON.parse(stepStr), data: JSON.parse(dataStr) };
    }
  } catch {
    // corrupted
  }
  return null;
}

function saveSession(step: number, data: SurveyData) {
  try {
    sessionStorage.setItem(SESSION_KEYS.step, JSON.stringify(step));
    sessionStorage.setItem(SESSION_KEYS.data, JSON.stringify(data));
  } catch {
    // unavailable
  }
}

function clearSession() {
  try {
    sessionStorage.removeItem(SESSION_KEYS.step);
    sessionStorage.removeItem(SESSION_KEYS.data);
  } catch {
    // unavailable
  }
}

export function useSurveyState() {
  const [currentStep, setCurrentStep] = useState(0);
  const [surveyData, setSurveyData] = useState<SurveyData>(DEFAULT_DATA);
  const [isDisqualified, setIsDisqualified] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [direction, setDirection] = useState(1); // 1 forward, -1 backward
  const stepRef = useRef(0);
  const skipHashSync = useRef(false);

  useEffect(() => {
    const utmParams = parseUTMParams();
    const session = loadSession();

    if (session) {
      setCurrentStep(session.step);
      stepRef.current = session.step;
      setSurveyData({ ...session.data, utmParams: { ...session.data.utmParams, ...utmParams } });
    } else {
      setSurveyData((prev) => ({ ...prev, utmParams }));
    }

    // Restore from URL hash
    const hash = window.location.hash;
    if (hash && session) {
      const stepIndex = STEPS.findIndex((s) => s.hash === hash);
      if (stepIndex >= 0 && stepIndex <= session.step) {
        setCurrentStep(stepIndex);
        stepRef.current = stepIndex;
      }
    }

    setIsHydrated(true);
  }, []);

  // Sync hash on step change (only when not already pushed by goNext/goBack)
  useEffect(() => {
    if (!isHydrated) return;
    if (skipHashSync.current) {
      skipHashSync.current = false;
      return;
    }
    const step = STEPS[currentStep];
    if (step && !isDisqualified) {
      window.history.replaceState(null, '', step.hash);
    }
  }, [currentStep, isHydrated, isDisqualified]);

  // Save to session on changes
  useEffect(() => {
    if (!isHydrated) return;
    saveSession(currentStep, surveyData);
  }, [currentStep, surveyData, isHydrated]);

  // Handle browser back/forward
  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash;
      const stepIndex = STEPS.findIndex((s) => s.hash === hash);
      if (stepIndex >= 0 && stepIndex <= stepRef.current) {
        skipHashSync.current = true;
        setDirection(-1);
        setCurrentStep(stepIndex);
        stepRef.current = stepIndex;
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const goNext = useCallback(() => {
    const next = Math.min(stepRef.current + 1, STEPS.length - 1);
    window.history.pushState(null, '', STEPS[next].hash);
    skipHashSync.current = true;
    setDirection(1);
    setCurrentStep(next);
    stepRef.current = next;
  }, []);

  const goBack = useCallback(() => {
    const next = Math.max(stepRef.current - 1, 0);
    window.history.pushState(null, '', STEPS[next].hash);
    skipHashSync.current = true;
    setDirection(-1);
    setCurrentStep(next);
    stepRef.current = next;
  }, []);

  const setCountry = useCallback((country: Country, otherCountryName?: string, otherCountryCode?: string) => {
    setSurveyData((prev) => ({
      ...prev,
      country,
      otherCountryName: country === 'Other' ? otherCountryName : undefined,
      otherCountryCode: country === 'Other' ? otherCountryCode : undefined,
    }));
  }, []);

  const setTaxYears = useCallback((taxYears: TaxYear[]) => {
    setSurveyData((prev) => ({ ...prev, taxYears }));
  }, []);

  const setBlockchains = useCallback((blockchains: Blockchain[]) => {
    setSurveyData((prev) => ({ ...prev, blockchains }));
  }, []);

  const setTaxSoftware = useCallback((hasTaxSoftware: boolean, taxSoftwareName?: TaxSoftware) => {
    setSurveyData((prev) => ({ ...prev, hasTaxSoftware, taxSoftwareName }));
  }, []);

  const setContactInfo = useCallback((firstName: string, lastName: string | undefined, email: string, phone: string | undefined, honeypot?: string) => {
    setSurveyData((prev) => ({ ...prev, firstName, lastName, email, phone, honeypot }));
  }, []);

  const setContactId = useCallback((contactId: string) => {
    setSurveyData((prev) => ({ ...prev, contactId }));
  }, []);

  const setSelectedSlot = useCallback((slot: CalendarSlot, timezone: string) => {
    setSurveyData((prev) => ({ ...prev, selectedSlot: slot, timezone }));
  }, []);

  const setAppointmentId = useCallback((appointmentId: string) => {
    setSurveyData((prev) => ({ ...prev, appointmentId }));
  }, []);

  const setFinalDetails = useCallback((lastName: string, phone: string) => {
    setSurveyData((prev) => ({ ...prev, lastName, phone }));
  }, []);

  const completeFlow = useCallback(() => {
    clearSession();
  }, []);

  const currentStepDef = useMemo(() => STEPS[currentStep], [currentStep]);

  return {
    currentStep,
    currentStepDef,
    surveyData,
    isDisqualified,
    isHydrated,
    direction,
    goNext,
    goBack,
    setCountry,
    setTaxYears,
    setBlockchains,
    setTaxSoftware,
    setContactInfo,
    setContactId,
    setSelectedSlot,
    setAppointmentId,
    setFinalDetails,
    completeFlow,
  };
}

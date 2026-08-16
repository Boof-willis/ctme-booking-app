declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackSurveyStarted() {
  window.gtag?.('event', 'survey_started');
}

/**
 * Fired when a lead passes the gains/portfolio/transactions gate. Custom pixel
 * event so Meta can be pointed at "Qualified" as a conversion (or exclusion)
 * later without redefining Lead.
 */
export function trackQualified() {
  window.fbq?.('trackCustom', 'Qualified');
  window.gtag?.('event', 'qualified');
}

export function trackDisqualified() {
  window.fbq?.('trackCustom', 'Disqualified');
  window.gtag?.('event', 'disqualified');
}

export function trackCourseClick() {
  window.fbq?.('trackCustom', 'CourseClick');
  window.gtag?.('event', 'course_click');
}

export function trackEmailCaptured() {
  window.fbq?.('track', 'Lead');
  window.gtag?.('event', 'generate_lead');
}

export function trackAppointmentBooked() {
  window.fbq?.('track', 'Schedule');
  window.gtag?.('event', 'conversion', {
    send_to: process.env.NEXT_PUBLIC_GOOGLE_ADS_ID
      ? `${process.env.NEXT_PUBLIC_GOOGLE_ADS_ID}/appointment_booked`
      : undefined,
  });
}

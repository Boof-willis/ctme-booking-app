declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackSurveyStarted() {
  window.gtag?.('event', 'survey_started');
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

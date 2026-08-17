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

/**
 * Google Ads conversions are NOT fired from the client. Ockno does it server-side:
 * part 1 of this form creates the GHL contact (with gclid + ockno_id already
 * attached, see lib/ghl.ts), part 2 books the appointment, and the resulting GHL
 * pipeline stage change ("Call Booked") is what Ockno watches to push the
 * conversion into Google Ads. Firing a second, client-side gtag('event',
 * 'conversion') here would just create a duplicate, un-deduplicated conversion
 * next to the one Ockno already reports — so these only fire GA4/Meta events for
 * analytics, and Google Ads conversion reporting is intentionally left to Ockno.
 */
export function trackEmailCaptured() {
  window.fbq?.('track', 'Lead');
  window.gtag?.('event', 'generate_lead');
}

export function trackAppointmentBooked() {
  window.fbq?.('track', 'Schedule');
  window.gtag?.('event', 'appointment_booked');
}

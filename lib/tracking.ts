import type { LeadPath } from '@/types/survey';

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

/** Under-threshold lead tapped "Request Quote" (before any contact details). */
export function trackQuoteClick() {
  window.fbq?.('trackCustom', 'QuoteClick');
  window.gtag?.('event', 'quote_click');
}

/** Under-threshold lead submitted contact details for an email quote. */
export function trackQuoteRequested() {
  window.fbq?.('trackCustom', 'QuoteRequested');
  window.gtag?.('event', 'quote_requested');
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
 *
 * Quote requests (leadPath 'quote') never reach "Call Booked", so they only
 * report to Google Ads if Ockno is also pointed at the quote pipeline stage.
 * The Meta Lead still fires for both paths — a quote request is a real lead —
 * with lead_path attached so a Custom Conversion can split them if needed.
 */
export function trackEmailCaptured(leadPath: LeadPath = 'call') {
  window.fbq?.('track', 'Lead', { lead_path: leadPath });
  window.gtag?.('event', 'generate_lead', { lead_path: leadPath });
}

export function trackAppointmentBooked() {
  window.fbq?.('track', 'Schedule');
  window.gtag?.('event', 'appointment_booked');
}

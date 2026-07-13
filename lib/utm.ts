import { UTMParams } from '@/types/survey';

const UTM_KEYS: (keyof UTMParams)[] = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'placement',
  'site_source_name',
  'gclid',
  'fbclid',
  'ockno_id',
];

const LANDING_URL_STORAGE_KEY = 'ctme_landing_url';
const LANDING_UTMS_STORAGE_KEY = 'ctme_landing_utms';

const CONSULTATION_URL = 'https://book.ctme.io/consultation';

// Meta-style placeholders like {{campaign.name}} that weren't replaced should not
// be stored as if they were real values.
function isMacroPlaceholder(value: string): boolean {
  return /^\{\{.*\}\}$/.test(value.trim());
}

function isTrackingUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    if (!parsed.search) return false;
    for (const key of UTM_KEYS) {
      if (parsed.searchParams.has(key)) return true;
    }
    return false;
  } catch {
    return false;
  }
}

/**
 * Parse UTM / tracking params from the current URL, merging with any
 * landing-page values captured on first visit. The first landing URL that
 * contained tracking params is persisted to sessionStorage so the attribution
 * survives hash changes, refreshes, and step navigation inside the flow.
 */
export function parseUTMParams(): UTMParams {
  if (typeof window === 'undefined') return {};

  const params = new URLSearchParams(window.location.search);
  const utm: UTMParams = {};

  for (const key of UTM_KEYS) {
    const value = params.get(key);
    if (value && !isMacroPlaceholder(value)) {
      (utm as Record<string, string>)[key] = value;
    }
  }

  let storedUtms: UTMParams = {};
  let storedLandingUrl: string | undefined;
  try {
    const rawUtms = sessionStorage.getItem(LANDING_UTMS_STORAGE_KEY);
    if (rawUtms) storedUtms = JSON.parse(rawUtms) as UTMParams;
    storedLandingUrl = sessionStorage.getItem(LANDING_URL_STORAGE_KEY) || undefined;
  } catch {
    // sessionStorage unavailable
  }

  const hasCurrentTracking = Object.keys(utm).length > 0;
  const currentUrl = window.location.href;

  if (hasCurrentTracking && !storedLandingUrl) {
    try {
      sessionStorage.setItem(LANDING_URL_STORAGE_KEY, currentUrl);
      sessionStorage.setItem(LANDING_UTMS_STORAGE_KEY, JSON.stringify(utm));
      storedLandingUrl = currentUrl;
      storedUtms = utm;
    } catch {
      // ignore
    }
  }

  // Prefer current-URL values (re-arrivals with fresh params), fall back to stored.
  const merged: UTMParams = { ...storedUtms, ...utm };

  const landingUrl = hasCurrentTracking && !storedLandingUrl
    ? currentUrl
    : storedLandingUrl || (isTrackingUrl(currentUrl) ? currentUrl : undefined);

  if (landingUrl) merged.landing_url = landingUrl;

  return merged;
}

/**
 * Build the consultation destination URL for a landing-page CTA, carrying any
 * captured UTM params (from the current URL or sessionStorage) through to the
 * intake form. `utm_content` is always set to the section name so funnel
 * tracking still identifies which CTA was clicked.
 */
export function getConsultationURL(section: string): string {
  const params = new URLSearchParams();

  if (typeof window !== 'undefined') {
    const utms = parseUTMParams();
    for (const key of UTM_KEYS) {
      const value = utms[key];
      if (value) params.set(key, value);
    }
  }

  params.set('utm_content', section);

  return `${CONSULTATION_URL}?${params.toString()}`;
}

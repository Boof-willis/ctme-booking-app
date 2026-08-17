import {
  StepDefinition,
  Country,
  TaxYear,
  Blockchain,
  TaxSoftware,
  GainsBracket,
  PortfolioBracket,
  TransactionBracket,
} from '@/types/survey';

export const STEPS: StepDefinition[] = [
  { id: 'country', label: 'Country', number: 1, hash: '#step-1' },
  { id: 'gains', label: 'Gains', number: 2, hash: '#step-2' },
  { id: 'portfolio', label: 'Portfolio', number: 3, hash: '#step-3' },
  { id: 'transactions', label: 'Transactions', number: 4, hash: '#step-4' },
  { id: 'tax-years', label: 'Tax Years', number: 5, hash: '#step-5' },
  { id: 'blockchains', label: 'Blockchains', number: 6, hash: '#step-6' },
  { id: 'software', label: 'Software', number: 7, hash: '#step-7' },
  { id: 'contact-info', label: 'Your Info', number: 8, hash: '#step-8' },
  { id: 'calendar', label: 'Pick a Time', number: 9, hash: '#step-9' },
];

/**
 * Qualifier brackets. Order matters: index >= the QUALIFYING_INDEX for any one
 * dimension qualifies the lead for a consultation (see lib/qualification.ts).
 */
export const GAINS_BRACKETS: GainsBracket[] = ['Under $10k', '$10k – $50k', '$50k – $250k', '$250k+'];
export const PORTFOLIO_BRACKETS: PortfolioBracket[] = ['Under $25k', '$25k – $100k', '$100k – $500k', '$500k+'];
export const TRANSACTION_BRACKETS: TransactionBracket[] = ['Under 1,000', '1,000 – 6,000', '6,000 – 20,000', '20,000+'];

/** Thresholds per Matt: gains ≥ $50k, portfolio ≥ $100k, or ≥ 6k transactions. */
export const QUALIFYING_GAINS_INDEX = 2;
export const QUALIFYING_PORTFOLIO_INDEX = 2;
export const QUALIFYING_TRANSACTION_INDEX = 2;

export const MINIMUM_ENGAGEMENT_USD = 1500;
export const COURSE_URL = 'https://cryptotaxmadeeasy.com/crypto-tax-made-easy-course/';

/**
 * Extension-deadline window. Gates the seasonal banner and the FinalCTA urgency
 * line so they appear and disappear together.
 *
 * Evaluated at build time, not in the browser: this app is statically exported to
 * a Cloudflare worker, so the value is baked into the bundle. Flipping the window
 * requires a redeploy, which is intentional. It keeps the banner off the critical
 * render path and out of the client bundle entirely.
 */
export const EXTENSION_DEADLINE_WINDOW = {
  start: '2026-09-01',
  end: '2026-10-15',
} as const;

export function isExtensionSeasonActive(now: Date = new Date()): boolean {
  const today = now.toISOString().slice(0, 10);
  return today >= EXTENSION_DEADLINE_WINDOW.start && today <= EXTENSION_DEADLINE_WINDOW.end;
}

export const COUNTRIES: Country[] = [
  'Australia',
  'Canada',
  'New Zealand',
  'UK',
  'USA',
  'Other',
];

export const VALID_COUNTRIES: Country[] = [
  'Australia',
  'Canada',
  'New Zealand',
  'UK',
  'USA',
];

export const TAX_YEARS: TaxYear[] = [
  '2025',
  '2024',
  '2023',
  '2022',
  '2021',
  'Before 2021',
];

export const BLOCKCHAINS: Blockchain[] = [
  'Ethereum',
  'Bitcoin',
  'Solana',
  'Polygon',
  'Arbitrum',
  'Base',
  'Avalanche',
  'BNB Chain',
  'Other',
];

export const TAX_SOFTWARE_OPTIONS: TaxSoftware[] = [
  'Koinly',
  'Awaken',
  'Summ',
  'Netrunner',
  'Other',
];

export const COUNTRY_PHONE_CODES: Record<string, string> = {
  Australia: '+61',
  Canada: '+1',
  'New Zealand': '+64',
  UK: '+44',
  USA: '+1',
};

export const GHL_CUSTOM_FIELDS = {
  country: 'country',
  taxYears: 'which_tax_years_do_you_need_help_with',
  blockchainsUsed: 'blockchains_used',
  hasTaxSoftware: 'do_you_currently_have_crypto_tax_software_set_up',
  taxSoftwareName: 'if_yes_which_crypto_tax_software',
  estimatedGains: 'estimated_realized_gains',
  estimatedPortfolio: 'estimated_portfolio_value',
  estimatedTransactions: 'estimated_transaction_count',
  ocknoId: 'ockno_id',
  agreedToTos: 'agreed_to_tos',
  utmSource: 'utm_source',
  utmMedium: 'utm_medium',
  utmCampaign: 'utm_campaign',
  utmContent: 'utm_content',
  utmTerm: 'utm_term',
  placement: 'placement',
  siteSourceName: 'site_source_name',
  landingUrl: 'landing_url',
  gclid: 'gclid',
  fbclid: 'fbclid',
} as const;

export const SESSION_KEYS = {
  step: 'ctme_survey_step',
  data: 'ctme_survey_data',
} as const;

export const FALLBACK_EMAIL = 'hello@cryptotaxmadeeasy.com';

export const TOTAL_STEPS = STEPS.length;

import { StepDefinition, Country, TaxYear, Blockchain, TaxSoftware } from '@/types/survey';

export const STEPS: StepDefinition[] = [
  { id: 'country', label: 'Country', number: 1, hash: '#step-1' },
  { id: 'tax-years', label: 'Tax Years', number: 2, hash: '#step-2' },
  { id: 'blockchains', label: 'Blockchains', number: 3, hash: '#step-3' },
  { id: 'software', label: 'Software', number: 4, hash: '#step-4' },
  { id: 'contact-info', label: 'Your Info', number: 5, hash: '#step-5' },
  { id: 'calendar', label: 'Pick a Time', number: 6, hash: '#step-6' },
];

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
  ocknoId: 'ockno_id',
} as const;

export const SESSION_KEYS = {
  step: 'ctme_survey_step',
  data: 'ctme_survey_data',
} as const;

export const FALLBACK_EMAIL = 'hello@cryptotaxmadeeasy.com';

export const TOTAL_STEPS = STEPS.length;

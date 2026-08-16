export type Country = 'Australia' | 'Canada' | 'New Zealand' | 'UK' | 'USA' | 'Other';

export type TaxYear = '2025' | '2024' | '2023' | '2022' | '2021' | 'Before 2021';

export type Blockchain =
  | 'Ethereum'
  | 'Bitcoin'
  | 'Solana'
  | 'Polygon'
  | 'Arbitrum'
  | 'Base'
  | 'Avalanche'
  | 'BNB Chain'
  | 'Other';

export type TaxSoftware = 'Koinly' | 'Awaken' | 'Summ' | 'Netrunner' | 'Other';

export type GainsBracket = 'Under $10k' | '$10k – $50k' | '$50k – $250k' | '$250k+';
export type PortfolioBracket = 'Under $25k' | '$25k – $100k' | '$100k – $500k' | '$500k+';
export type TransactionBracket = 'Under 1,000' | '1,000 – 6,000' | '6,000 – 20,000' | '20,000+';

export interface UTMParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  placement?: string;
  site_source_name?: string;
  gclid?: string;
  fbclid?: string;
  ockno_id?: string;
  landing_url?: string;
}

export interface SurveyData {
  country?: Country;
  otherCountryName?: string;
  otherCountryCode?: string;
  gainsBracket?: GainsBracket;
  portfolioBracket?: PortfolioBracket;
  transactionBracket?: TransactionBracket;
  taxYears: TaxYear[];
  blockchains: Blockchain[];
  hasTaxSoftware?: boolean;
  taxSoftwareName?: TaxSoftware;
  acknowledgedMinimum?: boolean;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  honeypot?: string;
  agreedToTos?: boolean;
  utmParams: UTMParams;
  contactId?: string;
  selectedSlot?: CalendarSlot;
  timezone?: string;
  appointmentId?: string;
}

export interface CalendarSlot {
  id: string;
  startTime: string;
  endTime: string;
}

export interface CalendarDay {
  date: string;
  slots: CalendarSlot[];
}

export interface GHLContactResponse {
  contact: {
    id: string;
  };
}

export interface GHLSlotsResponse {
  [date: string]: {
    slots: Array<{
      startTime: string;
      endTime: string;
    }>;
  };
}

export interface GHLAppointmentResponse {
  id: string;
  status: string;
  startTime: string;
  endTime: string;
}

export type StepId =
  | 'country'
  | 'gains'
  | 'portfolio'
  | 'transactions'
  | 'tax-years'
  | 'blockchains'
  | 'software'
  | 'contact-info'
  | 'calendar';

export interface StepDefinition {
  id: StepId;
  label: string;
  number: number;
  hash: string;
}

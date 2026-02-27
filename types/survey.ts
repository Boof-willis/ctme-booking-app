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

export interface UTMParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  gclid?: string;
  fbclid?: string;
}

export interface SurveyData {
  country?: Country;
  taxYears: TaxYear[];
  blockchains: Blockchain[];
  hasTaxSoftware?: boolean;
  taxSoftwareName?: TaxSoftware;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  honeypot?: string;
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
  | 'tax-years'
  | 'blockchains'
  | 'software'
  | 'contact-info'
  | 'calendar'
  | 'confirmation';

export interface StepDefinition {
  id: StepId;
  label: string;
  number: number;
  hash: string;
}

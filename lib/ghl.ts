import { GHL_CUSTOM_FIELDS } from './constants';
import { SurveyData, GHLAppointmentResponse } from '@/types/survey';

const GHL_V1_BASE = 'https://rest.gohighlevel.com/v1';

function getHeaders() {
  return {
    Authorization: `Bearer ${process.env.GHL_API_KEY}`,
    'Content-Type': 'application/json',
  };
}

function buildCustomFields(data: SurveyData): Record<string, string> {
  const fields: Record<string, string> = {};

  const set = (key: string, value: string | undefined) => {
    if (value) fields[key] = value;
  };

  set(GHL_CUSTOM_FIELDS.country, data.country);
  set(GHL_CUSTOM_FIELDS.taxYears, data.taxYears.join(', '));
  set(GHL_CUSTOM_FIELDS.blockchainsUsed, data.blockchains.join(', '));
  set(GHL_CUSTOM_FIELDS.hasTaxSoftware, data.hasTaxSoftware === true ? 'yes' : data.hasTaxSoftware === false ? 'no' : undefined);
  set(GHL_CUSTOM_FIELDS.taxSoftwareName, data.taxSoftwareName);
  set(GHL_CUSTOM_FIELDS.utmSource, data.utmParams.utm_source);
  set(GHL_CUSTOM_FIELDS.utmMedium, data.utmParams.utm_medium);
  set(GHL_CUSTOM_FIELDS.utmCampaign, data.utmParams.utm_campaign);
  set(GHL_CUSTOM_FIELDS.utmContent, data.utmParams.utm_content);
  set(GHL_CUSTOM_FIELDS.utmTerm, data.utmParams.utm_term);
  set(GHL_CUSTOM_FIELDS.gclid, data.utmParams.gclid);
  set(GHL_CUSTOM_FIELDS.fbclid, data.utmParams.fbclid);

  return fields;
}

export async function createOrUpdateContact(data: SurveyData): Promise<Record<string, unknown>> {
  const customField = buildCustomFields(data);

  const body: Record<string, unknown> = {
    firstName: data.firstName,
    email: data.email,
  };

  if (Object.keys(customField).length > 0) {
    body.customField = customField;
  }

  if (data.lastName) body.lastName = data.lastName;
  if (data.phone) body.phone = data.phone;

  console.log('GHL create contact request:', JSON.stringify(body, null, 2));

  const res = await fetch(`${GHL_V1_BASE}/contacts/`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(body),
  });

  const responseText = await res.text();
  console.log('GHL create contact response:', res.status, responseText);

  if (!res.ok) {
    throw new Error(`GHL contact creation failed: ${res.status} ${responseText}`);
  }

  try {
    return JSON.parse(responseText);
  } catch {
    throw new Error(`GHL returned invalid JSON: ${responseText}`);
  }
}

export async function updateContact(
  contactId: string,
  updates: { lastName?: string; phone?: string }
): Promise<void> {
  const res = await fetch(`${GHL_V1_BASE}/contacts/${contactId}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(updates),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GHL contact update failed: ${res.status} ${text}`);
  }
}

export async function fetchAvailableSlots(
  startDate: string,
  endDate: string,
  timezone: string
): Promise<Record<string, unknown>> {
  const calendarId = process.env.GHL_CALENDAR_ID;
  const params = new URLSearchParams({
    calendarId: calendarId || '',
    startDate,
    endDate,
    timezone,
  });

  console.log('GHL fetch slots request:', `${GHL_V1_BASE}/appointments/slots?${params}`);

  const res = await fetch(
    `${GHL_V1_BASE}/appointments/slots?${params}`,
    { headers: getHeaders() }
  );

  const responseText = await res.text();
  console.log('GHL fetch slots response:', res.status, responseText.slice(0, 500));

  if (!res.ok) {
    throw new Error(`GHL slots fetch failed: ${res.status} ${responseText}`);
  }

  try {
    return JSON.parse(responseText);
  } catch {
    throw new Error(`GHL returned invalid JSON: ${responseText}`);
  }
}

export async function createAppointment(
  contactId: string,
  startTime: string,
  endTime: string,
  timezone: string,
  data: SurveyData
): Promise<GHLAppointmentResponse> {
  const body = {
    calendarId: process.env.GHL_CALENDAR_ID,
    contactId,
    startTime,
    endTime,
    timezone,
    title: `Crypto Tax Consultation - ${data.firstName} ${data.lastName || ''}`.trim(),
    status: 'confirmed',
  };

  console.log('GHL create appointment request:', JSON.stringify(body, null, 2));

  const res = await fetch(`${GHL_V1_BASE}/appointments/`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(body),
  });

  const responseText = await res.text();
  console.log('GHL create appointment response:', res.status, responseText);

  if (!res.ok) {
    throw new Error(`GHL appointment creation failed: ${res.status} ${responseText}`);
  }

  return JSON.parse(responseText);
}

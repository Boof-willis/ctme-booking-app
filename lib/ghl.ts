import { GHL_CUSTOM_FIELDS } from './constants';
import { SurveyData, GHLAppointmentResponse } from '@/types/survey';

const GHL_BASE = 'https://services.leadconnectorhq.com';

function getHeaders() {
  return {
    Authorization: `Bearer ${process.env.GHL_API_KEY}`,
    'Content-Type': 'application/json',
    Version: '2021-07-28',
  };
}

type FieldValue = string | string[];

function buildCustomFields(data: SurveyData): Array<{ key: string; field_value: FieldValue }> {
  const fields: Array<{ key: string; field_value: FieldValue }> = [];

  const set = (key: string, value: FieldValue | undefined) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value) && value.length === 0) return;
      if (typeof value === 'string' && !value) return;
      fields.push({ key, field_value: value });
    }
  };

  set(GHL_CUSTOM_FIELDS.country, data.country === 'Other' && data.otherCountryName ? data.otherCountryName : data.country);

  const taxYearMap: Record<string, string> = { 'Before 2021': 'Before-2021' };
  const mappedYears = data.taxYears.map((y) => taxYearMap[y] || y);
  set(GHL_CUSTOM_FIELDS.taxYears, mappedYears);

  set(GHL_CUSTOM_FIELDS.blockchainsUsed, data.blockchains.slice());

  set(GHL_CUSTOM_FIELDS.hasTaxSoftware, data.hasTaxSoftware === true ? 'Yes' : data.hasTaxSoftware === false ? 'No' : undefined);

  const softwareNameMap: Record<string, string> = {
    'Koinly': 'Koinly',
    'Awaken': 'Awaken',
    'Summ': 'Summ (Formerly Crypto Tax Calculator)',
    'Netrunner': 'Netrunner',
    'Other': 'Other',
  };
  set(GHL_CUSTOM_FIELDS.taxSoftwareName, data.taxSoftwareName ? softwareNameMap[data.taxSoftwareName] || data.taxSoftwareName : undefined);
  set(GHL_CUSTOM_FIELDS.ocknoId, data.utmParams.ockno_id);
  set(GHL_CUSTOM_FIELDS.agreedToTos, data.agreedToTos === true ? 'Yes' : data.agreedToTos === false ? 'No' : undefined);

  return fields;
}

export async function createOrUpdateContact(data: SurveyData): Promise<Record<string, unknown>> {
  const customFields = buildCustomFields(data);

  const body: Record<string, unknown> = {
    locationId: process.env.GHL_LOCATION_ID,
    firstName: data.firstName,
    email: data.email,
  };

  if (customFields.length > 0) {
    body.customFields = customFields;
  }

  if (data.lastName) body.lastName = data.lastName;
  if (data.phone) body.phone = data.phone;

  const countryCodeMap: Record<string, string> = {
    'Australia': 'AU',
    'Canada': 'CA',
    'New Zealand': 'NZ',
    'UK': 'GB',
    'USA': 'US',
  };
  if (data.country === 'Other' && data.otherCountryCode) {
    body.country = data.otherCountryCode;
  } else if (data.country && countryCodeMap[data.country]) {
    body.country = countryCodeMap[data.country];
  }

  console.log('GHL create contact request:', JSON.stringify(body, null, 2));

  const res = await fetch(`${GHL_BASE}/contacts/`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(body),
  });

  const responseText = await res.text();
  console.log('GHL create contact response:', res.status, responseText);

  if (res.status === 400) {
    try {
      const err = JSON.parse(responseText);
      const existingId = err?.meta?.contactId;
      if (existingId && /duplicate/i.test(err?.message || '')) {
        console.log('Duplicate contact detected, updating existing:', existingId);
        const updateBody: Record<string, unknown> = { firstName: data.firstName };
        if (customFields.length > 0) updateBody.customFields = customFields;
        if (data.lastName) updateBody.lastName = data.lastName;
        if (data.phone) updateBody.phone = data.phone;
        if (body.country) updateBody.country = body.country;

        const updateRes = await fetch(`${GHL_BASE}/contacts/${existingId}`, {
          method: 'PUT',
          headers: getHeaders(),
          body: JSON.stringify(updateBody),
        });
        const updateText = await updateRes.text();
        console.log('GHL update contact response:', updateRes.status, updateText);

        return { contact: { id: existingId } };
      }
    } catch { /* fall through to generic error */ }
  }

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
  const res = await fetch(`${GHL_BASE}/contacts/${contactId}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(updates),
  });

  if (res.status === 400 && updates.phone) {
    const text = await res.text();
    try {
      const err = JSON.parse(text);
      if (/duplicate/i.test(err?.message || '') && err?.meta?.matchingField === 'phone') {
        console.log('Phone duplicate conflict, retrying update without phone');
        const { phone: _, ...rest } = updates;
        if (Object.keys(rest).length > 0) {
          const retry = await fetch(`${GHL_BASE}/contacts/${contactId}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(rest),
          });
          if (!retry.ok) {
            const retryText = await retry.text();
            throw new Error(`GHL contact update failed: ${retry.status} ${retryText}`);
          }
        }
        return;
      }
    } catch (e) {
      if (e instanceof Error && e.message.startsWith('GHL')) throw e;
    }
    throw new Error(`GHL contact update failed: ${res.status} ${text}`);
  }

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

  const startEpoch = new Date(startDate).getTime();
  const endEpoch = new Date(endDate).getTime();

  const params = new URLSearchParams({
    startDate: String(startEpoch),
    endDate: String(endEpoch),
    timezone,
  });

  const url = `${GHL_BASE}/calendars/${calendarId}/free-slots?${params}`;
  console.log('GHL fetch slots request:', url);

  const res = await fetch(url, { headers: getHeaders() });

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
    locationId: process.env.GHL_LOCATION_ID,
    contactId,
    selectedTimezone: timezone,
    selectedSlot: startTime,
    startTime,
    endTime,
    title: `Crypto Tax Consultation - ${data.firstName} ${data.lastName || ''}`.trim(),
    appointmentStatus: 'confirmed',
  };

  console.log('GHL create appointment request:', JSON.stringify(body, null, 2));

  const res = await fetch(`${GHL_BASE}/calendars/events/appointments`, {
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

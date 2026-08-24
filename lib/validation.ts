import { isValidPhoneNumber } from 'libphonenumber-js/min';

// Practical (not full-RFC) email check: local part must start alphanumeric and
// use real address characters, domain labels must be valid, TLD alphabetic.
// Blocks junk like ****@gmail.com that a bare "x@y.z" regex lets through.
const EMAIL_RE =
  /^[A-Za-z0-9][A-Za-z0-9._%+'-]{0,63}@(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,24}$/;

export function isValidEmail(email: string): boolean {
  return email.length <= 254 && !email.includes('..') && EMAIL_RE.test(email);
}

/**
 * Expects an E.164-style string ("+61412345678"). The leading dial code
 * determines the country; the number must match that country's digit length.
 * The API route re-checks with full metadata (area-code patterns included).
 */
export function isValidPhone(phone: string): boolean {
  if (!phone.startsWith('+')) return false;
  try {
    return isValidPhoneNumber(phone);
  } catch {
    return false;
  }
}

export function sanitize(input: string): string {
  return input.trim().slice(0, 500);
}

export function isHoneypotFilled(value: string | undefined): boolean {
  return !!value && value.trim().length > 0;
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 7 && digits.length <= 15;
}

export function sanitize(input: string): string {
  return input.trim().slice(0, 500);
}

export function isHoneypotFilled(value: string | undefined): boolean {
  return !!value && value.trim().length > 0;
}

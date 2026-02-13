/**
 * Normalize a US phone number to E.164 format (+1XXXXXXXXXX).
 * Returns null if the input is not a valid 10-digit US number.
 */
export function normalizeUSPhone(input: string): string | null {
  const digits = input.replace(/\D/g, "");

  if (digits.length === 10) {
    return `+1${digits}`;
  }

  if (digits.length === 11 && digits.startsWith("1")) {
    return `+${digits}`;
  }

  return null;
}

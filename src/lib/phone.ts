/**
 * Normalises an Indonesian mobile number to "+62..." (digits only after +62).
 * Returns null when it cannot be a valid number. Accepts 08xx, 628xx, +628xx, 8xx.
 */
export function normalizePhoneId(input: string): string | null {
  let d = input.replace(/[\s\-().]/g, "");
  if (d.startsWith("+")) d = d.slice(1);
  if (!/^\d+$/.test(d)) return null;
  if (d.startsWith("62")) d = d.slice(2);
  else if (d.startsWith("0")) d = d.slice(1);
  // Indonesian mobile numbers: 8xx..., 9-12 digits after the country code.
  if (!/^8\d{8,11}$/.test(d)) return null;
  return `+62${d}`;
}

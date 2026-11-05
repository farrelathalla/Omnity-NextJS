import { z } from "zod";
import { normalizePhoneId } from "@/lib/phone";

export const emailField = z
  .string()
  .trim()
  .toLowerCase()
  .email("Format email belum benar")
  .max(190, "Email terlalu panjang");

export const passwordField = z
  .string()
  .min(8, "Kata sandi minimal 8 karakter")
  .max(100, "Kata sandi maksimal 100 karakter");

export const nameField = z.string().trim().min(2, "Nama minimal 2 karakter").max(120, "Nama terlalu panjang");

export const companyField = z
  .string()
  .trim()
  .min(2, 'Isi nama perusahaan, atau tulis "Perorangan"')
  .max(160, "Nama perusahaan terlalu panjang");

/** Indonesian mobile number, normalised to +62... */
export const phoneField = z
  .string()
  .trim()
  .min(1, "Nomor ponsel wajib diisi")
  .transform((v, ctx) => {
    const n = normalizePhoneId(v);
    if (!n) {
      ctx.addIssue({ code: "custom", message: "Nomor ponsel Indonesia, mis. 0812xxxxxxxx" });
      return z.NEVER;
    }
    return n;
  });

export type FieldErrors<K extends string = string> = Partial<Record<K, string>>;

/** First error message per field from a zod failure. */
export function fieldErrors<K extends string>(error: z.ZodError): FieldErrors<K> {
  const out: Record<string, string> = {};
  for (const i of error.issues) {
    const k = String(i.path[0] ?? "");
    if (k && !out[k]) out[k] = i.message;
  }
  return out as FieldErrors<K>;
}

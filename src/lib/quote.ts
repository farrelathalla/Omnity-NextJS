import { z } from "zod";

/** Quote model and arithmetic. Pure module: shared by the editor (live preview) and the server (authoritative). */

export const formatRupiah = (n: number) =>
  `Rp ${Math.round(n).toLocaleString("id-ID")}`;

export type QuoteItem = { label: string; detail: string; qty: number; unitPrice: number };

const str = (max: number) => z.string().trim().max(max);

export const quoteItemSchema = z.object({
  label: str(120).min(1, "Nama item wajib diisi"),
  detail: str(300),
  qty: z.number().int().min(1, "Jumlah minimal 1").max(1000),
  unitPrice: z.number().int().min(0, "Harga tidak boleh negatif").max(10_000_000_000),
});

export const quoteInputSchema = z.object({
  items: z.array(quoteItemSchema).min(1, "Tambahkan minimal satu item").max(30),
  discount: z.number().int().min(0).max(10_000_000_000),
  dpPercent: z.number().int().min(0).max(100),
  timeline: str(200),
  /** yyyy-mm-dd, interpreted as the end of that day (Asia/Jakarta) */
  validUntil: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Tanggal berlaku belum benar").or(z.literal("")),
  scope: str(1000),
  revisions: z.number().int().min(0).max(20),
  domainHosting: str(200),
  terms: str(3000),
});

export type QuoteInput = z.infer<typeof quoteInputSchema>;

export function computeTotals(items: QuoteItem[], discount: number, dpPercent: number) {
  const subtotal = items.reduce((n, i) => n + i.qty * i.unitPrice, 0);
  const disc = Math.min(Math.max(0, discount), subtotal);
  const total = subtotal - disc;
  const dpAmount = Math.round((total * dpPercent) / 100);
  return { subtotal, discount: disc, total, dpAmount, remaining: total - dpAmount };
}

export function parseItems(json: string): QuoteItem[] {
  try {
    const parsed = z.array(quoteItemSchema).safeParse(JSON.parse(json));
    return parsed.success ? parsed.data : [];
  } catch {
    return [];
  }
}

/** End of the chosen day in Jakarta (UTC+7), as a UTC Date for storage. */
export function endOfDayJakarta(yyyyMmDd: string): Date {
  return new Date(`${yyyyMmDd}T23:59:59+07:00`);
}

export const isExpired = (validUntil: Date | null | undefined) =>
  !!validUntil && validUntil.getTime() < Date.now();

export const DEFAULT_TERMS = [
  "Penawaran ini berlaku sampai tanggal yang tertera.",
  "Pengerjaan dimulai setelah penawaran disetujui dan uang muka (DP) diterima.",
  "Sisa pembayaran dilunasi sebelum website dipublikasikan.",
  "Revisi di luar jumlah yang tercantum dihitung terpisah.",
  "Konten (teks, foto, logo) disediakan klien kecuali disebutkan lain.",
].join("\n");

export const DEFAULT_ITEMS: QuoteItem[] = [
  { label: "Desain dan pembuatan website", detail: "Sesuai cakupan di bawah", qty: 1, unitPrice: 0 },
];

/** yyyy-mm-dd, `days` from now (UTC date; good enough for a default offer validity). */
export const defaultValidUntil = (days = 14) =>
  new Date(Date.now() + days * 86_400_000).toISOString().slice(0, 10);

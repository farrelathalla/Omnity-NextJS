import { z } from "zod";
import { templates } from "@/content/templates";

/** Design Anything survey (brief chapter 08). Pure module: shared by the wizard and the server. */

export const INDUSTRIES = [
  "Umum / company profile",
  "Retail / F&B",
  "Jasa profesional",
  "Manufaktur / B2B",
  "Pendidikan",
  "Lainnya",
] as const;

export const GOALS = [
  { id: "profil", label: "Profil perusahaan", hint: "Kenalkan bisnis dan layanan Anda." },
  { id: "katalog", label: "Katalog produk", hint: "Tampilkan produk tanpa transaksi online." },
  { id: "toko", label: "Toko online", hint: "Jual dan terima pesanan langsung." },
  { id: "lead", label: "Cari calon pelanggan", hint: "Kumpulkan kontak dan permintaan penawaran." },
  { id: "lainnya", label: "Lainnya", hint: "Ceritakan di kolom bawah." },
] as const;

export const FEATURES = [
  { id: "kontak", label: "Form kontak" },
  { id: "whatsapp", label: "Tombol chat WhatsApp" },
  { id: "booking", label: "Pemesanan / booking" },
  { id: "pembayaran", label: "Pembayaran online" },
  { id: "bahasa", label: "Multi-bahasa" },
  { id: "blog", label: "Blog / artikel" },
  { id: "galeri", label: "Galeri foto" },
  { id: "member", label: "Login member" },
] as const;

export const COLOR_PRESETS = [
  { id: "oranye", label: "Oranye hangat", swatch: "#E8501E" },
  { id: "biru", label: "Biru tenang", swatch: "#2F5BDA" },
  { id: "hijau", label: "Hijau segar", swatch: "#12A150" },
  { id: "gelap", label: "Hitam elegan", swatch: "#0E1220" },
  { id: "netral", label: "Netral lembut", swatch: "#B9B4A6" },
] as const;

export const STEPS = [
  { id: 1, title: "Bisnis", hint: "Siapa Anda dan apa yang Anda kerjakan." },
  { id: 2, title: "Tujuan website", hint: "Apa yang ingin dicapai website Anda." },
  { id: 3, title: "Domain & hosting", hint: "Apa yang sudah Anda punya." },
  { id: 4, title: "Template & referensi", hint: "Gaya yang Anda sukai." },
  { id: 5, title: "Halaman / menu", hint: "Halaman apa saja yang dibutuhkan." },
  { id: 6, title: "Brand & aset", hint: "Warna, logo, teks, dan foto." },
  { id: 7, title: "Fitur tambahan", hint: "Fungsi yang perlu ada." },
  { id: 8, title: "Ringkasan", hint: "Periksa lalu kirim." },
] as const;

const short = (max: number) => z.string().trim().max(max);
const yesNo = z.enum(["", "yes", "no"]);

/** Per-field limits keep a hostile client from stuffing the JSON column. */
export const surveySchema = z.object({
  business: z.object({
    name: short(160),
    industry: short(60),
    description: short(1500),
    oldSite: short(300),
  }),
  goals: z.array(z.enum(GOALS.map((g) => g.id) as [string, ...string[]])).max(5),
  goalsOther: short(400),
  domain: z.object({
    hasDomain: yesNo,
    domainName: short(160),
    hasHosting: yesNo,
    provider: short(120),
    needHelp: yesNo,
  }),
  design: z.object({
    template: short(40),
    refUrls: z.array(short(300)).max(3),
    /** upload ids of reference screenshots */
    refFiles: z.array(z.string().regex(/^[a-f0-9]{32}$/)).max(3),
  }),
  pages: z.array(short(60)).max(30),
  /** once the user edits the page list we stop auto-filling it from the industry */
  pagesCustomised: z.boolean(),
  brand: z.object({
    colors: short(160),
    /** upload id of the logo */
    logo: z.string().regex(/^[a-f0-9]{32}$/).nullable(),
    hasText: yesNo,
    hasPhotos: yesNo,
  }),
  features: z.array(z.enum(FEATURES.map((f) => f.id) as [string, ...string[]])).max(10),
  featuresOther: short(400),
});

export type Survey = z.infer<typeof surveySchema>;

export const emptySurvey = (): Survey => ({
  business: { name: "", industry: "", description: "", oldSite: "" },
  goals: [],
  goalsOther: "",
  domain: { hasDomain: "", domainName: "", hasHosting: "", provider: "", needHelp: "" },
  design: { template: "", refUrls: [], refFiles: [] },
  pages: [],
  pagesCustomised: false,
  brand: { colors: "", logo: null, hasText: "", hasPhotos: "" },
  features: [],
  featuresOther: "",
});

/** Default menu for an industry (brief chapter 08 table). */
export function recommendedPages(industry: string): string[] {
  const t = templates.find((x) => x.industry === industry);
  return [...(t ?? templates[0]).menu];
}

/** Parses stored JSON, tolerating older or partial drafts by merging onto the empty survey. */
export function parseSurvey(raw: string | null | undefined): Survey {
  const base = emptySurvey();
  if (!raw) return base;
  try {
    const parsed = JSON.parse(raw) as Partial<Survey>;
    const merged = {
      ...base,
      ...parsed,
      business: { ...base.business, ...parsed.business },
      domain: { ...base.domain, ...parsed.domain },
      design: { ...base.design, ...parsed.design },
      brand: { ...base.brand, ...parsed.brand },
    };
    const ok = surveySchema.safeParse(merged);
    return ok.success ? ok.data : base;
  } catch {
    return base;
  }
}

/** What must be filled before a survey can be sent. Returns a message per step number. */
export function missingForSubmit(s: Survey): Record<number, string> {
  const out: Record<number, string> = {};
  if (s.business.name.trim().length < 2) out[1] = "Isi nama bisnis atau perusahaan.";
  else if (!s.business.industry) out[1] = "Pilih bidang industri.";
  else if (s.business.description.trim().length < 10) out[1] = "Tulis deskripsi singkat bisnis Anda (minimal 10 karakter).";
  else if (s.business.oldSite && !/^(https?:\/\/)?[\w.-]+\.[a-z]{2,}(\/\S*)?$/i.test(s.business.oldSite.trim()))
    out[1] = "Alamat website lama belum benar.";
  if (s.goals.length === 0) out[2] = "Pilih minimal satu tujuan.";
  if (s.pages.length === 0) out[5] = "Pilih minimal satu halaman.";
  return out;
}

const yn = (v: string) => (v === "yes" ? "Ya" : v === "no" ? "Tidak" : "-");

export type SummarySection = { step: number; title: string; items: [string, string][] };

/** Human-readable answers grouped by survey step. Used by the wizard summary and the project pages. */
export function summaryRows(s: Survey, hasLogo: boolean): SummarySection[] {
  const goals = s.goals.map((g) => GOALS.find((x) => x.id === g)?.label ?? g).join(", ") || "-";
  const feats = s.features.map((f) => FEATURES.find((x) => x.id === f)?.label ?? f).join(", ") || "-";
  const tpl = templates.find((t) => t.id === s.design.template)?.name ?? "Tanpa template";
  const extra = (label: string, v: string): [string, string][] => (v ? [[label, v]] : []);
  return [
    {
      step: 1,
      title: "Bisnis",
      items: [
        ["Nama", s.business.name || "-"],
        ["Industri", s.business.industry || "-"],
        ["Deskripsi", s.business.description || "-"],
        ["Website lama", s.business.oldSite || "-"],
      ],
    },
    { step: 2, title: "Tujuan", items: [["Tujuan", goals], ...extra("Lainnya", s.goalsOther)] },
    {
      step: 3,
      title: "Domain & hosting",
      items: [
        ["Domain", s.domain.hasDomain === "yes" ? s.domain.domainName || "Sudah punya" : yn(s.domain.hasDomain)],
        ["Hosting", s.domain.hasHosting === "yes" ? s.domain.provider || "Sudah punya" : yn(s.domain.hasHosting)],
        ["Dibantu belikan", yn(s.domain.needHelp)],
      ],
    },
    {
      step: 4,
      title: "Template & referensi",
      items: [
        ["Template", tpl],
        ["Referensi", s.design.refUrls.filter(Boolean).join(", ") || "-"],
        ["Screenshot", `${s.design.refFiles.length} file`],
      ],
    },
    { step: 5, title: "Halaman", items: [["Menu", s.pages.join(", ") || "-"]] },
    {
      step: 6,
      title: "Brand & aset",
      items: [
        ["Warna", s.brand.colors || "-"],
        ["Logo", hasLogo ? "Terunggah" : "-"],
        ["Sudah punya teks", yn(s.brand.hasText)],
        ["Sudah punya foto", yn(s.brand.hasPhotos)],
      ],
    },
    { step: 7, title: "Fitur", items: [["Fitur", feats], ...extra("Lainnya", s.featuresOther)] },
  ];
}

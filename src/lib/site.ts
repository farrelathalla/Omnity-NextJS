/**
 * Company facts and runtime flags. Facts marked "CONFIRM" come from the old
 * WordPress site or the brief and are listed in docs/CONTENT_TODO.md.
 */

export type SiteEnv = "production" | "staging" | "development";

export const siteEnv: SiteEnv =
  process.env.SITE_ENV === "staging"
    ? "staging"
    : process.env.NODE_ENV === "production"
      ? "production"
      : "development";

export const isStaging = siteEnv === "staging";

export const siteUrl = (
  process.env.SITE_URL ?? "http://localhost:3000"
).replace(/\/$/, "");

export const site = {
  name: "Omnity",
  legalName: "PT Omnity Solusi Integrasi",
  tagline: "Platform solusi digital: produk, layanan, dan website untuk bisnis Anda.",
  email: "corporate@omnity.co.id",
  // From the old site: head office. CONFIRM before launch.
  address: {
    line1: "JustCo, Sequis Tower Level 17",
    line2: "Jl. Jend. Sudirman No. 71",
    city: "Jakarta 12190",
  },
  // CONFIRM: the client has not given a WhatsApp / phone number yet.
  phone: null as string | null,
  social: [] as { label: string; href: string }[],
  // CONFIRM with the client: real numbers ("isi angka asli dari klien").
  proof: { clients: "50+", projects: "100+" },
  // Optional bar above the header (brief chapter 05). null = hidden.
  announcement: {
    text: "Baru: Design Anything. Ceritakan kebutuhan website Anda, kami buatkan mockup-nya.",
    href: "/mulai",
    cta: "Coba sekarang",
  } as { text: string; href: string; cta: string } | null,
};

export const mailFrom = process.env.MAIL_FROM ?? "Omnity <no-reply@omnity.co.id>";

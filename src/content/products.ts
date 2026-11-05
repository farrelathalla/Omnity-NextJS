import type { IconName } from "@/components/icon";

export type Product = {
  slug: string;
  name: string;
  /** One line used in menus and cards. */
  short: string;
  /** Value proposition used in product heroes. */
  tagline: string;
  icon: IconName;
  badge?: string;
};

/**
 * Product copy is rewritten from the old site (brief chapter 10).
 * Detail sections (features, FAQ, ...) are added in phase 3.
 */
export const products: Product[] = [
  {
    slug: "omnipay",
    name: "OmniPay",
    short: "Platform pembayaran digital all-in-one.",
    tagline:
      "Terima pembayaran kartu, QRIS, dan e-wallet dalam satu platform yang cepat, aman, dan berstandar PCI DSS.",
    icon: "wallet",
  },
  {
    slug: "omnidoc",
    name: "Omnidoc",
    short: "HRIS mobile-first untuk enterprise.",
    tagline:
      "Otomatiskan proses HR, dapatkan insight, dan capai tujuan HR strategis dari satu aplikasi mobile.",
    icon: "users",
  },
  {
    slug: "omnicard",
    name: "OmniCard",
    short: "Sistem kartu prabayar dengan monitoring real-time.",
    tagline:
      "Kelola kartu prabayar, laporan transaksi, dan pengguna dengan pemantauan real-time.",
    icon: "credit-card",
  },
  {
    slug: "omniassettracker",
    name: "OmniAssetTracker",
    short: "Persiapan hingga disposisi aset lebih cepat.",
    tagline:
      "Persiapan, pengajuan, dan persetujuan dokumen atau aset yang lebih cepat, lengkap dengan disposisi dan kolaborasi.",
    icon: "boxes",
  },
  {
    slug: "omniwhere",
    name: "OmniWHERE",
    short: "Monitoring kendaraan real-time.",
    tagline:
      "Pantau lokasi, konektivitas, bahan bakar, dan rekaman suara kendaraan secara real-time.",
    icon: "map-pin",
  },
  {
    slug: "omnipos",
    name: "OmniPOS",
    short: "Point of sale terintegrasi dengan e-commerce.",
    tagline:
      "Kasir yang menyatu dengan marketing, penjualan, inventori, dan toko online.",
    icon: "store",
  },
  {
    slug: "omnitrans",
    name: "OmniTRANS",
    short: "Sistem transportasi publik terpadu.",
    tagline:
      "Software, hardware, dan komunikasi terpadu untuk penumpang dan operator transportasi publik.",
    icon: "bus",
  },
  {
    slug: "solusi-ai",
    name: "Solusi AI",
    short: "Chatbot, otomasi dokumen, dan analitik prediktif.",
    tagline:
      "Chatbot dan asisten AI, otomasi dokumen, analitik dan prediksi, serta integrasi AI ke produk yang sudah ada.",
    icon: "sparkles",
    badge: "Baru",
  },
];

export const productBySlug = (slug: string) =>
  products.find((p) => p.slug === slug);

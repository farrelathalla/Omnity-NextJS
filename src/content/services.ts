import type { IconName } from "@/components/icon";

export type Service = {
  slug: string;
  name: string;
  short: string;
  /** Two-sentence description for cards (phase 3 adds the full detail page). */
  blurb: string;
  /** Three things the client gets. */
  points: string[];
  icon: IconName;
  /** Services Farrel showcases first (client request): consulting, audit, solutioning. */
  highlight?: boolean;
};

export const services: Service[] = [
  {
    slug: "konsultasi-it",
    name: "Konsultasi IT",
    short: "Strategi dan perencanaan teknologi.",
    blurb:
      "Kami memetakan kebutuhan bisnis Anda ke strategi teknologi yang realistis: apa yang dibangun, dibeli, atau diintegrasikan, dan dalam urutan apa.",
    points: ["Peta jalan teknologi", "Pemilihan arsitektur & vendor", "Estimasi biaya dan prioritas"],
    icon: "compass",
    highlight: true,
  },
  {
    slug: "audit-it-keamanan",
    name: "Audit IT & Keamanan",
    short: "Asesmen sistem dan rekomendasi perbaikan.",
    blurb:
      "Kami memeriksa sistem, jaringan, dan proses Anda untuk menemukan celah keamanan dan inefisiensi, lalu menyusun rekomendasi perbaikan yang bisa langsung dikerjakan.",
    points: ["Laporan temuan berprioritas", "Rekomendasi perbaikan", "Pendampingan tindak lanjut"],
    icon: "shield-check",
    highlight: true,
  },
  {
    slug: "solutioning",
    name: "Solutioning",
    short: "Merancang solusi end-to-end untuk masalah bisnis.",
    blurb:
      "Dari masalah bisnis sampai rancangan solusi end-to-end: proses, sistem, integrasi, dan rencana implementasi dalam satu paket yang utuh.",
    points: ["Rancangan solusi end-to-end", "Prototipe dan proof of concept", "Rencana implementasi bertahap"],
    icon: "puzzle",
    highlight: true,
  },
  {
    slug: "software-dev-integrasi",
    name: "Software Dev & Integrasi",
    short: "Web, mobile, dan sistem enterprise.",
    blurb:
      "Aplikasi web, mobile, dan sistem enterprise yang dibangun sesuai kebutuhan, serta integrasi dengan sistem yang sudah Anda pakai.",
    points: ["Web & mobile app", "Integrasi API dan sistem lama", "Pengujian dan dokumentasi"],
    icon: "code",
  },
  {
    slug: "managed-it",
    name: "Managed IT Services",
    short: "Monitoring, server, backup, dan update keamanan.",
    blurb:
      "Kami menjaga infrastruktur Anda tetap sehat: monitoring, pengelolaan server, backup, dan pembaruan keamanan secara berkala.",
    points: ["Monitoring berkelanjutan", "Backup dan pemulihan", "Patch dan pembaruan keamanan"],
    icon: "server",
  },
  {
    slug: "network",
    name: "Network Services",
    short: "Desain, instalasi, dan maintenance jaringan.",
    blurb:
      "Desain, instalasi, dan pemeliharaan jaringan kantor maupun multi-lokasi yang stabil dan aman.",
    points: ["Desain & survei jaringan", "Instalasi dan konfigurasi", "Pemeliharaan berkala"],
    icon: "network",
  },
  {
    slug: "pembuatan-website",
    name: "Pembuatan Website",
    short: "Terhubung langsung ke Design Anything.",
    blurb:
      "Website company profile, toko online, hingga portal bisnis. Mulai dari survei singkat, lihat mockup-nya dulu, baru setuju.",
    points: ["Mockup sebelum bayar", "Desain responsif dan cepat", "Domain dan hosting opsional"],
    icon: "globe",
  },
];

export const serviceBySlug = (slug: string) =>
  services.find((s) => s.slug === slug);

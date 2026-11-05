import type { IconName } from "@/components/icon";

export type Service = {
  slug: string;
  name: string;
  short: string;
  icon: IconName;
  /** Services Farrel showcases first (client request): consulting, audit, solutioning. */
  highlight?: boolean;
};

export const services: Service[] = [
  {
    slug: "konsultasi-it",
    name: "Konsultasi IT",
    short: "Strategi dan perencanaan teknologi.",
    icon: "compass",
    highlight: true,
  },
  {
    slug: "audit-it-keamanan",
    name: "Audit IT & Keamanan",
    short: "Asesmen sistem dan rekomendasi perbaikan.",
    icon: "shield-check",
    highlight: true,
  },
  {
    slug: "solutioning",
    name: "Solutioning",
    short: "Merancang solusi end-to-end untuk masalah bisnis.",
    icon: "puzzle",
    highlight: true,
  },
  {
    slug: "software-dev-integrasi",
    name: "Software Dev & Integrasi",
    short: "Web, mobile, dan sistem enterprise.",
    icon: "code",
  },
  {
    slug: "managed-it",
    name: "Managed IT Services",
    short: "Monitoring, server, backup, dan update keamanan.",
    icon: "server",
  },
  {
    slug: "network",
    name: "Network Services",
    short: "Desain, instalasi, dan maintenance jaringan.",
    icon: "network",
  },
  {
    slug: "pembuatan-website",
    name: "Pembuatan Website",
    short: "Terhubung langsung ke Design Anything.",
    icon: "globe",
  },
];

export const serviceBySlug = (slug: string) =>
  services.find((s) => s.slug === slug);

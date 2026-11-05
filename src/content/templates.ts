/**
 * Starting points offered in the hero prompt box and (phase 6) the template picker.
 * `menu` is the recommended page list per industry (brief chapter 08).
 */
export type Template = {
  id: string;
  name: string;
  industry: string;
  menu: string[];
};

export const templates: Template[] = [
  {
    id: "company-profile",
    name: "Company profile",
    industry: "Umum / company profile",
    menu: ["Beranda", "Tentang Kami", "Layanan", "Portofolio", "Blog", "Kontak"],
  },
  {
    id: "retail-fnb",
    name: "Toko & F&B",
    industry: "Retail / F&B",
    menu: ["Beranda", "Menu/Produk", "Promo", "Lokasi Outlet", "Pesan Online", "Kontak"],
  },
  {
    id: "jasa-profesional",
    name: "Jasa profesional",
    industry: "Jasa profesional",
    menu: ["Beranda", "Layanan", "Tim", "Studi Kasus", "Testimoni", "Konsultasi"],
  },
  {
    id: "manufaktur-b2b",
    name: "Manufaktur & B2B",
    industry: "Manufaktur / B2B",
    menu: ["Beranda", "Produk", "Fasilitas", "Sertifikasi", "Klien", "Minta Penawaran"],
  },
  {
    id: "pendidikan",
    name: "Pendidikan",
    industry: "Pendidikan",
    menu: ["Beranda", "Program", "Pengajar", "Pendaftaran", "Berita", "Kontak"],
  },
];

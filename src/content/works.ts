/**
 * Portfolio ("Karya"). Screenshots are produced by `npm run capture:work`
 * (tools/capture-work.mjs) and live in public/work/<slug>/{d,m}-<n>.webp.
 */

export type WorkShot = {
  src: string;
  kind: "desktop" | "mobile";
  caption: string;
  width: number;
  height: number;
};

export type Work = {
  slug: string;
  name: string;
  category: string;
  url: string;
  host: string;
  summary: string;
  role: string;
  highlights: string[];
  shots: WorkShot[];
};

function shot(
  slug: string,
  kind: "desktop" | "mobile",
  n: number,
  caption: string,
): WorkShot {
  return {
    src: `/work/${slug}/${kind === "desktop" ? "d" : "m"}-${n}.webp`,
    kind,
    caption,
    width: kind === "desktop" ? 1600 : 780,
    height: kind === "desktop" ? 1000 : 1688,
  };
}

export const works: Work[] = [
  {
    slug: "saiga-conservation",
    name: "Saiga Conservation Alliance",
    category: "Organisasi",
    url: "https://saiga-conservation.org/",
    host: "saiga-conservation.org",
    summary:
      "Situs resmi aliansi internasional pelindung antelop saiga. Tipografi editorial yang hangat, angka dampak, program lapangan, berita, dan ajakan donasi.",
    role: "Desain & pengembangan website",
    highlights: [
      "Hero editorial dengan foto layar penuh",
      "Kartu angka dampak dan program kerja",
      "Berita, newsletter, dan ajakan donasi",
    ],
    shots: [
      shot("saiga-conservation", "desktop", 0, "Hero: foto satwa layar penuh dan ajakan donasi"),
      shot("saiga-conservation", "desktop", 1, "Pengenalan spesies dengan foto dan poin utama"),
      shot("saiga-conservation", "desktop", 2, "Angka dampak dalam kartu ringkas"),
      shot("saiga-conservation", "desktop", 3, "Program lapangan pilihan"),
      shot("saiga-conservation", "desktop", 4, "Berita terbaru dan ajakan donasi"),
      shot("saiga-conservation", "mobile", 0, "Tampilan mobile: hero"),
      shot("saiga-conservation", "mobile", 1, "Tampilan mobile: pendekatan kerja"),
      shot("saiga-conservation", "mobile", 2, "Tampilan mobile: berita"),
    ],
  },
  {
    slug: "lextera-survey",
    name: "Lextera Survey Indonesia",
    category: "Perusahaan",
    url: "https://lexterasurveyindonesia.com/",
    host: "lexterasurveyindonesia.com",
    summary:
      "Situs distributor teknologi survei dan geospasial. Slider produk, katalog, mitra dan klien, berita, serta form permintaan penawaran.",
    role: "Desain & pengembangan website",
    highlights: [
      "Slider produk dengan detail per unit",
      "Katalog produk, mitra, dan klien",
      "Form permintaan penawaran",
    ],
    shots: [
      shot("lextera-survey", "desktop", 0, "Hero: slider produk unggulan"),
      shot("lextera-survey", "desktop", 1, "Profil perusahaan dan katalog produk"),
      shot("lextera-survey", "desktop", 2, "Katalog produk dan keunggulan layanan"),
      shot("lextera-survey", "desktop", 3, "Mitra prinsipal dan klien"),
      shot("lextera-survey", "desktop", 4, "Manajemen, berita, dan kemitraan"),
      shot("lextera-survey", "desktop", 5, "Form permintaan penawaran dan kontak"),
      shot("lextera-survey", "mobile", 0, "Tampilan mobile: hero dengan navigasi bawah"),
      shot("lextera-survey", "mobile", 1, "Tampilan mobile: keunggulan layanan"),
      shot("lextera-survey", "mobile", 3, "Tampilan mobile: form penawaran"),
    ],
  },
  {
    slug: "ncb-living",
    name: "NCB Living",
    category: "Arsitektur & konstruksi",
    url: "https://nirwanacb.com/en",
    host: "nirwanacb.com",
    summary:
      "Situs studio arsitektur, rekayasa, dan konstruksi. Dwibahasa (Indonesia dan Inggris), portofolio proyek, alur proses, dan panel admin agar klien bisa mengelola kontennya sendiri.",
    role: "Desain & pengembangan website",
    highlights: [
      "Dwibahasa Indonesia dan Inggris",
      "Portofolio proyek dengan galeri foto dan video",
      "Panel admin untuk proyek, layanan, dan teks",
    ],
    shots: [
      shot("ncb-living", "desktop", 0, "Hero arsitektur dengan foto proyek"),
      shot("ncb-living", "desktop", 1, "Proyek pilihan dalam grid editorial"),
      shot("ncb-living", "desktop", 3, "Alur kerja empat tahap: dari ide sampai serah terima"),
      shot("ncb-living", "desktop", 4, "Pernyataan nilai dan detail material"),
      shot("ncb-living", "desktop", 5, "Ajakan memulai proyek dan footer"),
      shot("ncb-living", "mobile", 0, "Tampilan mobile: hero"),
      shot("ncb-living", "mobile", 1, "Tampilan mobile: proyek pilihan"),
      shot("ncb-living", "mobile", 2, "Tampilan mobile: alur kerja"),
    ],
  },
];

export const workBySlug = (slug: string) => works.find((w) => w.slug === slug);

export const workCategories = [...new Set(works.map((w) => w.category))];

/** Round-robin across sites so neighbouring tiles differ, split into two marquee rows. */
export function marqueeRows() {
  const queues = works.map((w) =>
    w.shots.map((s) => ({ ...s, workSlug: w.slug, workName: w.name })),
  );
  const flat: (typeof queues)[number] = [];
  for (let i = 0; flat.length < queues.reduce((n, q) => n + q.length, 0); i++) {
    for (const q of queues) if (q[i]) flat.push(q[i]);
  }
  return [flat.filter((_, i) => i % 2 === 0), flat.filter((_, i) => i % 2 === 1)];
}

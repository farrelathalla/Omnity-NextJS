/**
 * Portfolio ("Karya").
 *
 * Two kinds of entries:
 * - Live sites: screenshots from `npm run capture:work` (tools/capture-work.mjs)
 *   in public/work/<slug>/{d,m}-<n>.webp plus a full-page capture fp.webp for
 *   the scrolling preview.
 * - Interactive rebuilds (`demo`): older projects whose original material was a
 *   low-resolution image or a dated site. They are rebuilt as clickable React
 *   demos in src/components/work-demos/<slug>.tsx; the screenshots used for
 *   cards and the homepage marquee are captured FROM those demos by
 *   `npm run capture:demos` (tools/capture-demos.mjs).
 */

export type WorkShot = {
  src: string;
  kind: "desktop" | "mobile";
  caption: string;
  width: number;
  height: number;
};

export type WorkType = "Website" | "Platform & web app" | "Aplikasi mobile";

export type Work = {
  slug: string;
  name: string;
  /** Industry, shown as a badge. */
  category: string;
  /** What was built; drives the filter on /karya. */
  type: WorkType;
  year?: string;
  /** Live link. Omitted when the project is no longer online. */
  url?: string;
  host?: string;
  /** Button label for the live link (defaults to "Kunjungi <host>"). */
  linkLabel?: string;
  summary: string;
  role: string;
  highlights: string[];
  shots: WorkShot[];
  /** Interactive rebuild shown on the detail page. */
  demo?: {
    frame: "browser" | "phone";
    /** Address shown in the browser bar. */
    host: string;
    note: string;
  };
  /** Full-page capture for the scrolling preview of a live site. */
  fullPage?: { src: string; width: number; height: number };
  related?: { label: string; href: string };
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

function fullPage(slug: string, height: number) {
  return { src: `/work/${slug}/fp.webp`, width: 1200, height };
}

export const works: Work[] = [
  {
    slug: "omnipay-console",
    name: "OmniPay Console",
    category: "Fintech & pembayaran",
    type: "Platform & web app",
    year: "2020",
    summary:
      "Platform middleware pembayaran untuk EDC Android: kartu debit dan kredit, QRIS, dan e-money dalam satu alur, lengkap dengan konsol web untuk memantau perangkat, transaksi, settlement, dan kanal acquirer.",
    role: "Produk Omnity: arsitektur, aplikasi EDC, dan konsol web",
    highlights: [
      "Manajemen perangkat EDC, diagnostik, dan pembaruan OTA",
      "Laporan transaksi dan settlement multi-acquirer",
      "Transaksi terenkripsi TLE dari terminal sampai host bank",
    ],
    demo: {
      frame: "browser",
      host: "OmniPay Console",
      note: "Coba tombol Simulasikan transaksi: bayar dari terminal EDC, lalu lihat transaksinya masuk ke konsol. Semua data di sini adalah data contoh.",
    },
    related: { label: "Lihat produk OmniPay", href: "/produk/omnipay" },
    shots: [
      shot("omnipay-console", "desktop", 0, "Ringkasan transaksi dan perangkat secara real-time"),
      shot("omnipay-console", "desktop", 1, "Simulasi pembayaran di terminal EDC Android"),
      shot("omnipay-console", "desktop", 2, "Manajemen perangkat dengan diagnostik dan OTA"),
    ],
  },
  {
    slug: "sb-hospitality",
    name: "SB Hospitality",
    category: "Hospitality",
    type: "Website",
    year: "2026",
    url: "https://sbhospitality.id/",
    host: "sbhospitality.id",
    summary:
      "Situs PT Smanda Berkah Hospitality, mitra pengembangan SDM dan manajemen untuk hotel dan restoran. Tipografi serif yang tenang, palet hijau tua dan emas, dan alur yang mengarah ke konsultasi.",
    role: "Desain & pengembangan website",
    highlights: [
      "Hero editorial dengan nilai perusahaan",
      "Enam layanan dengan halaman detail",
      "Profil pendiri dan form permintaan konsultasi",
    ],
    fullPage: fullPage("sb-hospitality", 5176),
    shots: [
      shot("sb-hospitality", "desktop", 0, "Hero: membangun hospitality yang bertumbuh"),
      shot("sb-hospitality", "desktop", 2, "Visi perusahaan dan angka pengalaman"),
      shot("sb-hospitality", "desktop", 3, "Enam layanan hospitality"),
      shot("sb-hospitality", "desktop", 4, "Tiga pilar kepemimpinan"),
      shot("sb-hospitality", "mobile", 0, "Tampilan mobile: hero"),
      shot("sb-hospitality", "mobile", 1, "Tampilan mobile: angka pengalaman"),
      shot("sb-hospitality", "mobile", 2, "Tampilan mobile: pilar kepemimpinan"),
    ],
  },
  {
    slug: "c-access",
    name: "C-Access",
    category: "Transportasi",
    type: "Aplikasi mobile",
    url: "https://play.google.com/store/apps/details?id=com.kci.access",
    host: "Google Play",
    linkLabel: "Lihat di Google Play",
    summary:
      "Aplikasi resmi KAI Commuter untuk pengguna Commuter Line: jadwal, tarif, posisi kereta real-time, tiket QR, isi ulang saldo KMT, dan tiket KA Bandara dalam satu aplikasi. Lebih dari satu juta unduhan.",
    role: "Pengembangan aplikasi mobile",
    highlights: [
      "Tiket QR hingga empat penumpang sekaligus",
      "Isi ulang saldo kartu KMT lewat NFC",
      "Posisi kereta dan jadwal real-time",
    ],
    demo: {
      frame: "phone",
      host: "C-Access",
      note: "Pratinjau interaktif alur utama aplikasi. Ketuk menu di ponsel atau pilih fitur di sampingnya. Jadwal dan saldo adalah data contoh.",
    },
    shots: [
      shot("c-access", "desktop", 0, "Alur utama aplikasi C-Access"),
      shot("c-access", "mobile", 0, "Beranda dengan saldo KMT"),
      shot("c-access", "mobile", 1, "Jadwal Commuter Line"),
      shot("c-access", "mobile", 2, "Tiket QR"),
    ],
  },
  {
    slug: "saiga-conservation",
    name: "Saiga Conservation Alliance",
    category: "Organisasi",
    type: "Website",
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
    fullPage: fullPage("saiga-conservation", 5573),
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
    slug: "resort-academy",
    name: "Resort Academy",
    category: "Edukasi & pelatihan",
    type: "Platform & web app",
    summary:
      "Learning center untuk staf resort: modul pembelajaran, jadwal pelatihan, kuis praktik, progres belajar, dan sertifikat. Nuansa hijau hutan dan krem yang selaras dengan karakter resort.",
    role: "Desain UI & pengembangan platform pembelajaran",
    highlights: [
      "Dashboard belajar dengan progres per peserta",
      "Modul dan kuis praktik layanan tamu",
      "Sertifikat terbuka setelah evaluasi selesai",
    ],
    demo: {
      frame: "browser",
      host: "Resort Academy · Learning Center",
      note: "Buka modul Service Excellence lalu kerjakan kuisnya; progres dan sertifikat ikut berubah.",
    },
    shots: [
      shot("resort-academy", "desktop", 0, "Dashboard peserta dan perjalanan belajar"),
      shot("resort-academy", "desktop", 1, "Modul pembelajaran dengan daftar materi"),
      shot("resort-academy", "desktop", 2, "Kuis praktik layanan tamu"),
    ],
  },
  {
    slug: "lextera-survey",
    name: "Lextera Survey Indonesia",
    category: "Perusahaan",
    type: "Website",
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
    fullPage: fullPage("lextera-survey", 3698),
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
    slug: "cleanvy-asalta",
    name: "Cleanvy Asalta Indonesia",
    category: "Manufaktur",
    type: "Website",
    year: "2020",
    url: "https://cleanvyasalta.co.id/",
    host: "cleanvyasalta.co.id",
    summary:
      "Situs PT Cleanvy Asalta Indonesia, perwakilan sistem pembersih industri CLEANVY dari Jepang. Katalog mesin yang bisa dicari menurut aplikasi dan jenis cairan pembersih, dengan halaman detail dan konsultasi.",
    role: "Desain & pengembangan website",
    highlights: [
      "Pencarian produk menurut aplikasi dan jenis pembersih",
      "Halaman detail mesin dengan keunggulan utama",
      "Profil perusahaan dan form konsultasi",
    ],
    demo: {
      frame: "browser",
      host: "cleanvyasalta.co.id",
      note: "Pilih aplikasi (misalnya Mold) atau jenis pembersih untuk menyaring mesin, lalu buka detailnya.",
    },
    shots: [
      shot("cleanvy-asalta", "desktop", 0, "Hero dan pencarian produk"),
      shot("cleanvy-asalta", "desktop", 1, "Katalog mesin yang tersaring"),
      shot("cleanvy-asalta", "desktop", 2, "Detail mesin dan konsultasi"),
    ],
  },
  {
    slug: "cipma",
    name: "CiPMa Training & Consulting",
    category: "Edukasi & pelatihan",
    type: "Website",
    summary:
      "Situs lembaga pelatihan dan sertifikasi kompetensi. Katalog program yang bisa disaring, detail program, dan pendaftaran langsung dari halaman.",
    role: "Desain & pengembangan website",
    highlights: [
      "Katalog program dengan filter kategori",
      "Detail program: durasi, format, dan sasaran",
      "Pendaftaran dan konsultasi pelatihan",
    ],
    demo: {
      frame: "browser",
      host: "cipma.id",
      note: "Saring program, buka detailnya, lalu coba daftar.",
    },
    shots: [
      shot("cipma", "desktop", 0, "Hero dan nilai utama"),
      shot("cipma", "desktop", 1, "Katalog program yang bisa disaring"),
      shot("cipma", "desktop", 2, "Detail dan pendaftaran program"),
    ],
  },
  {
    slug: "ncb-living",
    name: "NCB Living",
    category: "Arsitektur & konstruksi",
    type: "Website",
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
    fullPage: fullPage("ncb-living", 3638),
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
  {
    slug: "linggar-audio",
    name: "Linggar Audio & Variasi",
    category: "Otomotif",
    type: "Website",
    summary:
      "Situs bengkel audio dan aksesori mobil. Tampilan gelap dengan aksen amber, layanan per kategori, perakit paket yang interaktif, dan pemesanan jadwal konsultasi.",
    role: "Desain & pengembangan website",
    highlights: [
      "Layanan audio, interior, dan lighting dalam satu tampilan",
      "Perakit paket upgrade sesuai jenis mobil",
      "Pemesanan jadwal konsultasi",
    ],
    demo: {
      frame: "browser",
      host: "Linggar Audio & Variasi",
      note: "Ganti tab layanan, lalu rakit paket upgrade dan pilih jadwal konsultasi.",
    },
    shots: [
      shot("linggar-audio", "desktop", 0, "Hero gelap dengan aksen amber"),
      shot("linggar-audio", "desktop", 1, "Layanan per kategori"),
      shot("linggar-audio", "desktop", 2, "Perakit paket upgrade"),
    ],
  },
  {
    slug: "azrigah",
    name: "Azrigah Sejahtera",
    category: "Maritim",
    type: "Website",
    url: "https://azrigah.com/",
    host: "azrigah.com",
    summary:
      "Situs PT Azrigah Sejahtera, perusahaan ship management dan crewing agency sejak 2010. Profil perusahaan, visi dan misi, klien pemilik kapal, sertifikasi, dan lamaran kru online.",
    role: "Desain & pengembangan website",
    highlights: [
      "Profil layanan ship management dan crewing",
      "Klien dan sertifikasi ISO serta Lloyd's Register",
      "Halaman lamaran kru online",
    ],
    fullPage: fullPage("azrigah", 2485),
    shots: [
      shot("azrigah", "desktop", 0, "Hero ship management"),
      shot("azrigah", "desktop", 2, "Keunggulan, visi, dan misi"),
      shot("azrigah", "desktop", 4, "Klien dan sertifikasi"),
      shot("azrigah", "mobile", 0, "Tampilan mobile: hero"),
      shot("azrigah", "mobile", 1, "Tampilan mobile: keunggulan"),
      shot("azrigah", "mobile", 2, "Tampilan mobile: klien"),
    ],
  },
  {
    slug: "lumei",
    name: "Lumei",
    category: "Manufaktur",
    type: "Website",
    year: "2019",
    summary:
      "Situs PT Anugrah Lumei Raya, pemasok kemasan kosmetik nasional sejak 2002: botol kaca, botol PET, jar, pump, dan tutup. Katalog per kategori, perjalanan perusahaan, dan permintaan sampel.",
    role: "Desain & pengembangan website",
    highlights: [
      "Katalog kemasan per kategori",
      "Perjalanan perusahaan sejak 2002",
      "Permintaan sampel langsung dari halaman",
    ],
    demo: {
      frame: "browser",
      host: "lumei.id",
      note: "Rilis 2019, dibangun ulang sebagai pratinjau. Ganti kategori kemasan lalu coba minta sampel.",
    },
    shots: [
      shot("lumei", "desktop", 0, "Hero kemasan kosmetik"),
      shot("lumei", "desktop", 1, "Katalog per kategori"),
      shot("lumei", "desktop", 2, "Perjalanan perusahaan dan klien"),
    ],
  },
  {
    slug: "codelearn",
    name: "CoDe:learn",
    category: "Edukasi & pelatihan",
    type: "Website",
    summary:
      "Situs konsultan dan penyedia pelatihan korporat. Produk pelatihan, metodologi training dan konsultasi, jadwal public training, dan kontak.",
    role: "Desain & pengembangan website",
    highlights: [
      "Enam produk pelatihan korporat",
      "Metodologi training dan konsultasi bertahap",
      "Jadwal public training dengan pendaftaran",
    ],
    demo: {
      frame: "browser",
      host: "CoDe:learn",
      note: "Dibangun ulang sebagai pratinjau. Pilih produk, ganti metodologi, dan daftar public training.",
    },
    shots: [
      shot("codelearn", "desktop", 0, "Hero konsultan dan training"),
      shot("codelearn", "desktop", 1, "Produk pelatihan"),
      shot("codelearn", "desktop", 2, "Metodologi bertahap"),
    ],
  },
  {
    slug: "fun-bpk-2020",
    name: "FUN BPK 2020",
    category: "Event & pemerintahan",
    type: "Website",
    year: "2020",
    summary:
      "Situs festival BPK RI \"FUN BPK 2020: Festival untuk Negeri\" bertema Akuntabilitas untuk Semua, sekaligus menyemarakkan HUT ke-75 Kemerdekaan RI. Empat lomba virtual dengan ketentuan, hadiah, jadwal, dan pendaftaran per kategori.",
    role: "Desain & pengembangan microsite event",
    highlights: [
      "Empat lomba dalam satu halaman",
      "Ketentuan, hadiah, dan jadwal per lomba",
      "Pendaftaran per kategori peserta",
    ],
    demo: {
      frame: "browser",
      host: "FUN BPK 2020",
      note: "Event Agustus sampai Desember 2020, dibangun ulang sebagai pratinjau. Buka tiap lomba untuk melihat ketentuan, hadiah, dan jadwal.",
    },
    shots: [
      shot("fun-bpk-2020", "desktop", 0, "Hero festival"),
      shot("fun-bpk-2020", "desktop", 1, "Empat lomba virtual"),
      shot("fun-bpk-2020", "desktop", 2, "Detail lomba dan jadwal"),
    ],
  },
];

export const workBySlug = (slug: string) => works.find((w) => w.slug === slug);

export const workTypes: WorkType[] = ["Website", "Platform & web app", "Aplikasi mobile"];

/** First desktop shot, used for cards and Open Graph. */
export const workCover = (w: Work) => w.shots.find((s) => s.kind === "desktop") ?? w.shots[0];

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

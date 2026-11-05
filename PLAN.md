# PLAN: Omnity Website Revamp (Next.js)

Rencana induk untuk membangun ulang **omnity.co.id** (PT Omnity Solusi Integrasi)
dari brosur produk OmniPay menjadi **etalase solusi**: produk, layanan
konsultasi/audit/solusi, galeri karya, blog, forum, dan fitur **Design Anything**.

Sumber: `Omnity_Website_Revamp_Brief.pdf` v1.0 (5 Nov 2026) dan referensi gaya
aidesigner.ai. Dokumen ini menjawab **apa dan kenapa**. Urutan kerja, centang
tugas, dan definisi selesai per fase ada di [`IMPLEMENTATION_PLAN.md`](./IMPLEMENTATION_PLAN.md).

---

## 1. Tujuan

1. **Menjual layanan**: jelaskan produk dan layanan Omnity dengan jalur konversi
   yang jelas ("Mulai Proyek", "Jadwalkan konsultasi").
2. **Menghasilkan lead**: Design Anything mengubah pengunjung menjadi lead
   berkualitas (data diri + kebutuhan lengkap lewat survei, lalu penawaran).
3. **Membangun kepercayaan**: galeri karya, blog, studi kasus AI, forum.

Ukuran keberhasilan (dari brief): survei terkirim per bulan, % mockup yang lanjut
ke pembayaran, registrasi baru, Lighthouse >= 90 dan load < 2,5 dtk di mobile.

## 2. Ruang lingkup pekerjaan ini

Dikerjakan **Langkah 1-7** dari Lampiran A brief:

| Fase | Isi | Fase brief |
|---|---|---|
| 1 | Fondasi & design system | Fase 1 |
| 2 | Homepage H1-H8 | Fase 1 |
| 3 | Halaman statis, form konsultasi, SEO | Fase 1 |
| 4 | Blog + admin posting | Fase 1 |
| 5 | Registrasi & login | Fase 2 |
| 6 | Design Anything (survei, template, dashboard pengguna) | Fase 2 |
| 7 | Admin proyek & penawaran (mockup, status, PDF, email) | Fase 2 |

**Di luar lingkup (sengaja ditunda):** Langkah 8 (payment gateway dan forum
penuh), komentar blog, studi kasus AI lengkap, draf mockup otomatis dengan AI,
kalkulator penawaran otomatis, versi bahasa Inggris. Halaman `/forum` tampil
sebagai "Segera hadir" agar tidak ada link mati.

## 3. Keputusan teknis

| Topik | Keputusan | Alasan |
|---|---|---|
| Framework | **Next.js 16.4 (App Router) + TypeScript** | Sesuai brief; SSR untuk SEO. Dokumentasi bawaan paket dibaca dulu karena API berubah (`proxy.ts` menggantikan middleware, `params` async). |
| Caching | **Model klasik** (`cacheComponents` dimatikan) | Banyak halaman dinamis (sesi, dashboard, DB). Cache Components menuntut Suspense/`use cache` di setiap pembacaan data dan memperbesar risiko error build. Halaman marketing tetap statis secara default. |
| Styling | **Tailwind CSS v4** + komponen gaya shadcn yang ditulis tangan (`src/components/ui`) | Token desain di `@theme`; tanpa dependensi UI berat. |
| Animasi | **`motion`** (Framer Motion), CSS keyframes untuk marquee | Marquee dan efek ketik ringan; semua hormati `prefers-reduced-motion`. |
| Ikon | Lucide, stroke 1.5 | Sesuai brief. |
| Font | Instrument Serif (judul) + Inter (UI) lewat `next/font` | Sesuai brief dan aidesigner.ai. |
| Database | **MySQL/MariaDB** lewat **Drizzle ORM** + `mysql2` | Hostinger Business menyediakan MySQL di server yang sama. Supabase (saran brief) tidak dipakai karena situs harus berjalan penuh di Hostinger tanpa layanan eksternal. Row Level Security diganti pemeriksaan kepemilikan di server (setiap query dibatasi `userId`). |
| Auth | Sesi cookie JWT (`jose`), password `bcryptjs`, Google OAuth (`arctic`), verifikasi email | Tanpa vendor; mudah dihosting sendiri. |
| Email | `nodemailer` (SMTP Hostinger/perusahaan); di dev ditulis ke log | Notifikasi transaksional. |
| Editor blog | Tiptap | Pengalaman mirip WordPress, mendukung sisip gambar. |
| PDF penawaran | `pdf-lib` (server) | Ringan, tanpa headless browser di shared hosting. |
| Gambar | `sharp` (crop 16:9, WebP) | Kompres otomatis saat upload. |
| Validasi | `zod` | Skema yang sama untuk form dan server action. |
| Bahasa | **Indonesia** saja | Sesuai brief; EN di fase berikutnya. |

## 4. Arsitektur informasi

```
Beranda
|-- Produk            /produk, /produk/[slug]   (OmniPay, Omnidoc, OmniCard, OmniAssetTracker, OmniWHERE, OmniPOS, OmniTRANS, Solusi AI)
|-- Layanan           /layanan, /layanan/[slug] (Konsultasi IT, Audit IT & Keamanan, Solutioning, Software Dev & Integrasi, Managed IT, Network, Pembuatan Website)
|-- Karya             /karya, /karya/[slug]
|-- Blog              /blog, /blog/[slug]
|-- Forum             /forum  (Segera hadir)
|-- Perusahaan        /tentang, /journey, /karier, /kontak, /privasi, /syarat
|-- Design Anything   /mulai (pilih template), /mulai/survei
|-- Akun              /masuk, /daftar, /lupa-password, /profil
|-- Dashboard         /proyek, /proyek/[id]
`-- Admin             /admin, /admin/proyek, /admin/blog, /admin/pengguna
```

Matriks akses: pengunjung membaca semua halaman publik; pengguna terdaftar
memakai Design Anything dan (kelak) forum/komentar; admin menulis blog dan
mengelola proyek. Pengunjung boleh mengetik prompt di hero, lalu diminta daftar
dan prompt dibawa ke survei.

## 5. Sistem desain (ringkas)

Rasa aidesigner.ai (tenang, premium, banyak ruang kosong) dengan identitas Omnity.

- **Warna:** canvas `#FAFAF7`, ink `#0E1220`, Omnity orange `#E8501E`, muted `#6B7280`, border `#E5E7EB`.
- **Tipografi:** judul Instrument Serif besar dengan satu kata miring bergradien abu; teks Inter 16/1,6.
- **Latar:** dot-grid tipis + glow radial oranye/biru di sudut hero.
- **Gerak:** hero masuk 0,6 dtk (fade + naik 20 px), marquee dua baris berlawanan arah (lambat, pause saat hover), placeholder prompt yang mengetik, kartu naik 2 px saat hover, footer sticky yang "terungkap" di bawah sheet bersudut bulat. Semua dimatikan/dikurangi pada `prefers-reduced-motion`.
- **Komponen:** Button, Card, Badge, Input/Textarea/Select, Navbar (mega menu), Footer gelap + wordmark raksasa, SectionHeader (kicker + judul serif), PromptBox, Marquee, Reveal.
- **Responsif:** mobile-first; breakpoint 640/768/1024/1280; lebar konten maks 1200 px; diuji di 375 px dan 1440 px.
- **Aksesibilitas:** kontras AA, fokus keyboard terlihat, alt text, skip link.

Yang ditiru dari aidesigner.ai hanya **gaya dan pola** (diukur langsung dari
situsnya: h1 serif 96px, letter-spacing -0,025em, kata miring bergradien; marquee
130-140 dtk linear; footer `sticky bottom-0` di bawah sheet bersudut bulat).
Tidak ada logo, teks, atau gambar yang disalin.

## 6. Model data (MySQL)

`users`, `sessions` (opsional, JWT stateless + `token_version`), `email_tokens`
(verifikasi/reset), `inquiries` (form konsultasi), `posts`, `post_media`,
`projects` (permintaan Design Anything + survei JSON), `mockups`, `quotes`,
`project_events` (riwayat status), `notifications`, `templates`, `rate_limits`.
Detail kolom ada di `src/db/schema.ts` dan ditambah per fase lewat migrasi
Drizzle di folder `drizzle/`.

Status proyek: `requested -> in_review -> mockup_in_progress -> mockup_ready ->
awaiting_payment -> in_progress -> completed` (+ `revision_requested`,
`cancelled`).

## 7. Portofolio ("Karya")

Tiga situs nyata yang sudah dibuat, ditampilkan dengan screenshot sorotan
(desktop 1440 px dan mobile 390 px, resolusi 1,5-2x, WebP):

| Slug | Situs | Sorotan |
|---|---|---|
| `saiga-conservation` | saiga-conservation.org | Hero editorial, angka dampak, kartu program, donasi |
| `lextera-survey` | lexterasurveyindonesia.com | Slider produk, katalog, mitra & klien, form penawaran |
| `ncb-living` | nirwanacb.com/en | Hero arsitektur, proyek pilihan, alur proses, CTA |

Screenshot dibuat ulang dengan `npm run capture:work` (Playwright + Chrome lokal),
hasil dikonversi ke WebP di `public/work/`. Dipakai di marquee beranda (H2),
halaman `/karya`, dan detail `/karya/[slug]`.

## 8. Deployment & strategi "situs lama tetap aman"

Situs WordPress lama **tetap berjalan** di `omnity.co.id` (Hostinger,
`public_html`; cPanel lama di `103.140.90.234` masih menjadi server email).
Situs baru **tidak menyentuhnya**.

1. **Staging dulu:** situs baru dideploy ke **`staging.omnity.co.id`** sebagai
   website Node.js terpisah di akun Hostinger yang sama. Env `SITE_ENV=staging`
   memberi `X-Robots-Tag: noindex`, `robots.txt` Disallow, dan banner "Pratinjau".
   DNS: satu record baru `staging` di zona DNS (diedit di cPanel lama, NS
   serverbos); tidak mengubah record yang ada.
2. **Cutover (nanti, atas persetujuan klien):** tukar domain utama ke website
   Node.js di hPanel, atau ubah A record. Runbook langkah demi langkah ada di
   `docs/SWITCHING.md`.
3. **Rollback satu langkah:** kembalikan domain/A record ke situs WordPress.
   File dan database WordPress tidak diubah, jadi rollback tidak butuh restore.
4. Backup zona DNS sebelum perubahan sudah ada
   (`dns-zone-backup-2026-11-05.json`, di luar repo).

Fallback: bila subdomain staging tidak bisa dibuat, pakai domain utama, tetapi
hanya setelah ada konfirmasi eksplisit karena itu menggantikan situs yang live.

Konfigurasi runtime lewat environment variable (lihat `.env.example`); rahasia
tidak pernah masuk repo. Upload disimpan di `UPLOAD_DIR` **di luar** folder
aplikasi agar tidak terhapus tiap deploy.

## 9. Risiko dan mitigasi

| Risiko | Mitigasi |
|---|---|
| Angka social proof, harga paket, studi kasus AI belum diberikan klien | Disimpan sebagai konstanta di `src/content/` dan dicatat di `docs/CONTENT_TODO.md`; tidak ada harga publik, penawaran diketik admin. |
| Logo asli (SVG) belum ada; yang ada hanya PNG 80 px | Tanda cincin dibuat ulang sebagai SVG; ganti `public/brand/omnity-mark.svg` saat file asli datang. |
| Build Next.js berat di shared hosting | Build di mesin lokal/CI bila perlu; `next start` ringan. Dicek di fase deploy. |
| Data pribadi (UU PDP) | Email/ponsel tidak tampil publik, halaman Privasi, persetujuan saat daftar, query selalu dibatasi pemilik. |
| Spam form/registrasi | Honeypot, waktu minimum, rate limit per IP di DB. |
| Email tidak terkirim di Hostinger | Transport SMTP dapat dikonfigurasi; setiap email penting juga tercatat di tabel `notifications`. |

# IMPLEMENTATION PLAN: Omnity Website Revamp

Urutan kerja serial. Setiap fase selesai berarti: kode jalan, lolos
`npm run lint`, `npx tsc --noEmit` dan `npm run build`, dicek di browser pada
375 px dan 1440 px (termasuk animasi), lalu **commit + push ke `main`**. Centang
di bawah diperbarui di commit fase yang sama. Latar belakang keputusan ada di
[`PLAN.md`](./PLAN.md).

Aturan commit: pesan format `phase N: ringkasan`, tanpa co-author.

**Definition of done per halaman (dari brief):** responsif di 375 dan 1440 px,
tanpa teks placeholder, semua link berfungsi, meta SEO terisi, Lighthouse >= 90,
dicek di Chrome (Safari bila tersedia).

Legenda: `[x]` selesai, `[ ]` belum.

---

## Fase 0: Rencana dan lingkungan

- [x] Baca brief PDF (24 halaman) dan lampiran prompt per fase
- [x] Pelajari gaya aidesigner.ai (computed style, keyframes, footer, marquee)
- [x] Screenshot portofolio: saiga-conservation.org, lexterasurveyindonesia.com, nirwanacb.com/en (desktop + mobile)
- [x] Clone `Omnity-NextJS`, scaffold Next.js 16.4, baca dokumentasi bawaan paket
- [x] Database dev terpisah (MariaDB 10.4, port 3307, di luar repo)
- [x] Tulis `PLAN.md` dan `IMPLEMENTATION_PLAN.md`

Commit: `docs: add PLAN.md and IMPLEMENTATION_PLAN.md`

## Fase 1: Fondasi & design system (Langkah 1)

- [ ] Dependensi: `motion`, `lucide-react`, `clsx`, `tailwind-merge`, `class-variance-authority`
- [ ] `next.config.ts`: matikan `cacheComponents`; header keamanan; flag `SITE_ENV`
- [ ] Token desain di `globals.css` (`@theme`): warna, radius, shadow, font, keyframes (hero-enter, marquee-left/right, caret)
- [ ] Font: Instrument Serif (regular + italic) dan Inter via `next/font`
- [ ] Logo: `OmnityMark` + `OmnityLogo` (SVG), wordmark OMNITY
- [ ] Util: `cn()`, `site` config (nama, alamat, email, sosial), `SITE_ENV`
- [ ] Komponen UI: Button (primer/sekunder/ghost/pill), Card, Badge, Input, Textarea, Select, Kicker, SectionHeader (kicker + judul serif + kata miring), Container
- [ ] Gerak: `Reveal` (motion, hormati reduced motion), `Marquee` (CSS, 2 arah, pause hover)
- [ ] `AnnouncementBar` (opsional, bisa ditutup)
- [ ] `Navbar`: logo | Produk v (mega menu 2 kolom + Solusi AI) | Layanan v | Karya | Blog | Forum || Proyek Saya (nanti, setelah login) | Mulai Proyek | Masuk; mobile: drawer layar penuh dengan CTA di bawah
- [ ] `Footer` gelap: kolom Brand/Produk/Layanan/Perusahaan, tombol putih "Mulai Proyek", ikon sosial, badge PCI DSS, wordmark OMNITY raksasa terpotong, efek sticky reveal
- [ ] Latar `DotGrid` + glow radial
- [ ] Halaman `/styleguide` menampilkan semua komponen (noindex)
- [ ] Skip link, fokus terlihat, `lang="id"`, metadata dasar
- [ ] `.env.example`, `.gitignore` (izinkan `.env.example`), README proyek
- [ ] `tools/shot.mjs`: screenshot responsif (Playwright + Chrome lokal)
- [ ] Verifikasi: lint, tsc, build, screenshot `/styleguide` di 375 dan 1440 px, tes drawer mobile + mega menu

Commit: `phase 1: foundation and design system`

## Fase 2: Homepage H1-H8 (Langkah 2)

- [ ] Konten tipe-aman di `src/content/`: `products.ts`, `services.ts`, `works.ts`, `use-cases.ts`, `templates.ts`
- [ ] Screenshot portofolio ke `public/work/*.webp` (script `tools/capture-work.mjs` ikut di repo)
- [ ] **H1 Hero:** judul serif "Bangun *apa pun.*", sub, tab Website / Mobile App / Solusi IT, `PromptBox` (placeholder mengetik, "Pilih template", "Mulai Desain"), bukti sosial; prompt disimpan di `sessionStorage` untuk dibawa ke survei
- [ ] **H2 Marquee karya:** dua baris berlawanan arah dari screenshot, pause saat hover, klik ke `/karya`
- [ ] **H3 Produk:** grid kartu (OmniPay besar + strip logo pembayaran, Omnidoc, OmniCard, OmniAssetTracker, OmniWHERE, OmniPOS, OmniTRANS, Solusi AI)
- [ ] **H4 Layanan:** kartu bento dengan ikon garis, CTA "Jadwalkan konsultasi"
- [ ] **H5 Cara kerja:** 4 langkah bernomor serif
- [ ] **H6 Use case & studi kasus AI:** kartu masalah -> solusi -> hasil (isi sementara ditandai di `CONTENT_TODO.md`)
- [ ] **H7 Blog terbaru + Forum:** 3 artikel + 3 pertanyaan forum (data statis dulu, tersambung ke DB di Fase 4)
- [ ] **H8 CTA penutup** + footer
- [ ] Animasi masuk per section (`Reveal`), hover kartu, tab aktif bergeser halus
- [ ] Verifikasi: screenshot 375/1440, cek "reveals tersembunyi = 0", cek prefers-reduced-motion, Lighthouse lokal

Commit: `phase 2: homepage sections H1-H8`

## Fase 3: Halaman statis, form konsultasi, SEO (Langkah 3)

- [ ] Fondasi DB: `drizzle-orm`, `mysql2`, `drizzle-kit`, `src/db/` (koneksi, skema), migrasi pertama, `npm run db:migrate`
- [ ] `zod`, rate limit berbasis DB, honeypot + timing
- [ ] Mailer (`nodemailer`) dengan transport dev ke log
- [ ] `/produk` + `/produk/[slug]` (template: hero, masalah, fitur 3-6, screenshot, use case, integrasi/sertifikasi, FAQ + CTA)
- [ ] `/layanan` + `/layanan/[slug]` (deskripsi, deliverable, proses, form "Jadwalkan konsultasi")
- [ ] `/karya` (filter kategori) + `/karya/[slug]` (frame perangkat, galeri sorotan desktop + mobile)
- [ ] `/tentang`, `/journey`, `/karier`, `/privasi`, `/syarat`, `/forum` ("Segera hadir"), 404 dan error page
- [ ] `/kontak`: form -> tabel `inquiries` -> email ke admin + konfirmasi ke pengirim
- [ ] SEO: `generateMetadata` per halaman, Open Graph image, `sitemap.ts`, `robots.ts`, JSON-LD (Organization, BreadcrumbList, Product/Service)
- [ ] Konten lama dimigrasikan dan ditulis ulang (tanpa placeholder; typo email diperbaiki)
- [ ] Verifikasi: semua link internal (crawler script), form end-to-end, screenshot 375/1440

Commit: `phase 3: static pages, contact form, seo`

## Fase 4: Blog + admin posting (Langkah 4)

- [ ] Tabel `posts` (judul, slug, cover, isi HTML, ringkasan, status draft/terbit/terjadwal, `published_at`, `author_id`), **tanpa kategori**
- [ ] Inti auth minimal untuk admin: tabel `users` (role), hash bcrypt, sesi cookie JWT, `requireAdmin()`, seed admin dari env, `/masuk`
- [ ] `/blog` (artikel unggulan besar + grid kartu, cari, "Muat lebih banyak") dan `/blog/[slug]` (cover, serif, penulis, tanggal, waktu baca, lebar baca ~680 px, share, artikel terkait)
- [ ] `/admin/blog`: daftar + cari + hapus (konfirmasi), buat/edit dengan Tiptap (heading, bold, list, link, kutipan, sisip foto), upload cover (crop 16:9, WebP), slug otomatis, ringkasan otomatis, draft/terbit/jadwalkan, preview
- [ ] Pelayan file upload (`UPLOAD_DIR`) dengan cache header
- [ ] Beranda H7 membaca artikel terbaru dari DB; sitemap memuat artikel
- [ ] Verifikasi: tulis artikel contoh end-to-end, cek jadwal terbit, screenshot

Commit: `phase 4: blog and admin posting`

## Fase 5: Registrasi & login (Langkah 5)

- [ ] Registrasi: nama lengkap, nama perusahaan ("Perorangan" boleh), ponsel +62, email, password >= 8, persetujuan Syarat & Privasi
- [ ] Verifikasi email lewat link bertanda tangan + kedaluwarsa; kirim ulang; lupa/reset password
- [ ] Google sign-in (`arctic`), muncul hanya bila env diisi; setelah login pertama wajib lengkapi perusahaan + ponsel (`/profil/lengkapi`)
- [ ] **Modal** daftar/masuk yang bisa dipanggil dari mana saja; setelah sukses kembali ke aksi sebelumnya; prompt hero ikut terbawa
- [ ] Navbar sadar-login: "Proyek Saya" + badge, avatar + menu (Profil, Proyek Saya, Keluar)
- [ ] `/profil`: ubah data dan password; email/ponsel tidak pernah tampil publik
- [ ] Keamanan: rate limit login, `token_version` untuk cabut sesi, cookie `httpOnly`/`sameSite`/`secure`, CSRF lewat server actions + cek Origin
- [ ] Verifikasi: alur daftar -> verifikasi -> masuk -> keluar, reset password, akses admin ditolak untuk user biasa

Commit: `phase 5: registration and login`

## Fase 6: Design Anything (Langkah 6)

- [ ] `/mulai`: pilih template (grid per industri + filter, opsi "tidak pakai template")
- [ ] Wizard survei 8 langkah (`/mulai/survei`): Bisnis, Tujuan, Domain & hosting, Template & referensi, Halaman/menu (rekomendasi per industri, pilih/tambah/hapus), Brand & aset (warna, upload logo), Fitur tambahan, Ringkasan
- [ ] Progress bar, satu topik per langkah, **autosave draft** (server) dan pemulihan saat kembali
- [ ] Prefill dari prompt hero dan profil (perusahaan, ponsel); upload logo dan screenshot referensi
- [ ] Kirim -> proyek berstatus `requested`, catatan di `project_events`, email konfirmasi + estimasi waktu (2-3 hari kerja)
- [ ] `/proyek`: daftar proyek dengan badge status; `/proyek/[id]`: timeline status, jawaban survei, file; tab Mockup dan Penawaran (kosong sampai Fase 7)
- [ ] Hak akses: pengguna hanya melihat proyeknya sendiri (dites)
- [ ] Verifikasi: isi survei penuh lalu lanjutkan dari draft, screenshot tiap langkah di 375/1440

Commit: `phase 6: design anything survey and user dashboard`

## Fase 7: Admin proyek & penawaran (Langkah 7)

- [ ] `/admin/proyek`: inbox + filter status + cari + urutkan; detail proyek (survei, file, catatan internal)
- [ ] Ubah status dengan validasi transisi; setiap perubahan tercatat di `project_events` dan mengirim email ke pengguna
- [ ] Upload mockup berversi (gambar/PDF/link Figma) + catatan; pengguna melihat preview layar penuh (toggle desktop/mobile) dan bisa "Minta revisi" (status `revision_requested`)
- [ ] Penyusun penawaran: item, harga, DP %, timeline, masa berlaku, syarat, cakupan mockup (mis. "beranda + 4 halaman"), jumlah revisi, domain/hosting termasuk atau tidak
- [ ] Generate **PDF penawaran** (`pdf-lib`), unduh oleh admin dan pengguna
- [ ] Pengguna: tab Penawaran (rincian + unduh PDF) dan tombol "Setujui penawaran" -> `awaiting_payment` (gateway pembayaran = Langkah 8, belum dikerjakan)
- [ ] Notifikasi dalam aplikasi (tabel `notifications`) + email: mockup siap, penawaran siap, revisi diminta, penawaran disetujui; admin diberi email "permintaan baru"
- [ ] `/admin/pengguna` + ekspor CSV
- [ ] Verifikasi: alur lengkap dua akun (pengguna dan admin) dari survei sampai penawaran disetujui

Commit: `phase 7: admin projects, mockups, quotes`

## Fase 8: Deploy staging (di luar Langkah 1-7, atas permintaan)

- [ ] `docs/DEPLOYMENT.md`: variabel env, build/start, MySQL Hostinger, `UPLOAD_DIR`, migrasi
- [ ] `docs/SWITCHING.md`: cutover dan rollback ke WordPress lama (satu langkah)
- [ ] `docs/CONTENT_TODO.md`: daftar konten yang harus dikonfirmasi klien
- [ ] Buat `staging.omnity.co.id` (website Node.js baru + A record `staging` di zona DNS) dan deploy
- [ ] Bila subdomain tidak bisa: tanya dulu sebelum memakai domain utama

Commit: `docs: deployment and switching runbooks`

---

## Catatan fase

(Diisi saat tiap fase selesai: keputusan, temuan, utang teknis.)

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

- [x] Dependensi: `motion`, `lucide-react`, `clsx`, `tailwind-merge`, `class-variance-authority`
- [x] `next.config.ts`: matikan `cacheComponents`; header keamanan; flag `SITE_ENV`
- [x] Token desain di `globals.css` (`@theme`): warna, radius, shadow, font, keyframes (hero-enter, marquee-left/right, caret)
- [x] Font: Instrument Serif (regular + italic) dan Inter via `next/font`
- [x] Logo: `OmnityMark` + `OmnityLogo` (SVG), wordmark OMNITY
- [x] Util: `cn()`, `site` config (nama, alamat, email, sosial), `SITE_ENV`
- [x] Komponen UI: Button (primer/sekunder/ghost/pill), Card, Badge, Input, Textarea, Select, Kicker, SectionHeader (kicker + judul serif + kata miring), Container
- [x] Gerak: `Reveal` (motion, hormati reduced motion), `Marquee` (CSS, 2 arah, pause hover)
- [x] `AnnouncementBar` (opsional, bisa ditutup)
- [x] `Navbar`: logo | Produk v (mega menu 2 kolom + Solusi AI) | Layanan v | Karya | Blog | Forum || Proyek Saya (nanti, setelah login) | Mulai Proyek | Masuk; mobile: drawer layar penuh dengan CTA di bawah
- [x] `Footer` gelap: kolom Brand/Produk/Layanan/Perusahaan, tombol putih "Mulai Proyek", ikon sosial, badge PCI DSS, wordmark OMNITY raksasa terpotong, efek sticky reveal
- [x] Latar `DotGrid` + glow radial
- [x] Halaman `/styleguide` menampilkan semua komponen (noindex)
- [x] Skip link, fokus terlihat, `lang="id"`, metadata dasar
- [x] `.env.example`, `.gitignore` (izinkan `.env.example`), README proyek
- [x] `tools/shot.mjs`: screenshot responsif (Playwright + Chrome lokal)
- [x] Verifikasi: lint, tsc, build, screenshot `/styleguide` di 375 dan 1440 px, tes drawer mobile + mega menu

Commit: `phase 1: foundation and design system`

## Fase 2: Homepage H1-H8 (Langkah 2)

- [x] Konten tipe-aman di `src/content/`: `products.ts`, `services.ts`, `works.ts`, `use-cases.ts`, `templates.ts`
- [x] Screenshot portofolio ke `public/work/*.webp` (script `tools/capture-work.mjs` ikut di repo)
- [x] **H1 Hero:** judul serif "Bangun *apa pun.*", sub, tab Website / Mobile App / Solusi IT, `PromptBox` (placeholder mengetik, "Pilih template", "Mulai Desain"), bukti sosial; prompt disimpan di `sessionStorage` untuk dibawa ke survei
- [x] **H2 Marquee karya:** dua baris berlawanan arah dari screenshot, pause saat hover, klik ke `/karya`
- [x] **H3 Produk:** grid kartu (OmniPay besar + strip logo pembayaran, Omnidoc, OmniCard, OmniAssetTracker, OmniWHERE, OmniPOS, OmniTRANS, Solusi AI)
- [x] **H4 Layanan:** kartu bento dengan ikon garis, CTA "Jadwalkan konsultasi"
- [x] **H5 Cara kerja:** 4 langkah bernomor serif
- [x] **H6 Use case & studi kasus AI:** kartu masalah -> solusi -> hasil (isi sementara ditandai di `CONTENT_TODO.md`)
- [x] **H7 Blog terbaru + Forum:** 3 artikel + 3 pertanyaan forum (data statis dulu, tersambung ke DB di Fase 4)
- [x] **H8 CTA penutup** + footer
- [x] Animasi masuk per section (`Reveal`), hover kartu, tab aktif bergeser halus
- [x] Verifikasi: screenshot 375/1440, cek "reveals tersembunyi = 0", cek prefers-reduced-motion, Lighthouse lokal

Commit: `phase 2: homepage sections H1-H8`

## Fase 3: Halaman statis, form konsultasi, SEO (Langkah 3)

- [x] Fondasi DB: `drizzle-orm`, `mysql2`, `drizzle-kit`, `src/db/` (koneksi, skema), migrasi pertama, `npm run db:migrate`
- [x] `zod`, rate limit berbasis DB, honeypot + timing
- [x] Mailer (`nodemailer`) dengan transport dev ke log
- [x] `/produk` + `/produk/[slug]` (template: hero, masalah, fitur 3-6, screenshot, use case, integrasi/sertifikasi, FAQ + CTA)
- [x] `/layanan` + `/layanan/[slug]` (deskripsi, deliverable, proses, form "Jadwalkan konsultasi")
- [x] `/karya` (filter kategori) + `/karya/[slug]` (frame perangkat, galeri sorotan desktop + mobile)
- [x] `/tentang`, `/journey`, `/karier`, `/privasi`, `/syarat`, `/forum` ("Segera hadir"), 404 dan error page
- [x] `/kontak`: form -> tabel `inquiries` -> email ke admin + konfirmasi ke pengirim
- [x] SEO: `generateMetadata` per halaman, Open Graph image, `sitemap.ts`, `robots.ts`, JSON-LD (Organization, BreadcrumbList, Product/Service)
- [x] Konten lama dimigrasikan dan ditulis ulang (tanpa placeholder; typo email diperbaiki)
- [x] Verifikasi: semua link internal (crawler script), form end-to-end, screenshot 375/1440

Commit: `phase 3: static pages, contact form, seo`

## Fase 4: Blog + admin posting (Langkah 4)

- [x] Tabel `posts` (judul, slug, cover, isi HTML, ringkasan, status draft/terbit/terjadwal, `published_at`, `author_id`), **tanpa kategori**
- [x] Inti auth minimal untuk admin: tabel `users` (role), hash bcrypt, sesi cookie JWT, `requireAdmin()`, seed admin dari env, `/masuk`
- [x] `/blog` (artikel unggulan besar + grid kartu, cari, "Muat lebih banyak") dan `/blog/[slug]` (cover, serif, penulis, tanggal, waktu baca, lebar baca ~680 px, share, artikel terkait)
- [x] `/admin/blog`: daftar + cari + hapus (konfirmasi), buat/edit dengan Tiptap (heading, bold, list, link, kutipan, sisip foto), upload cover (crop 16:9, WebP), slug otomatis, ringkasan otomatis, draft/terbit/jadwalkan, preview
- [x] Pelayan file upload (`UPLOAD_DIR`) dengan cache header
- [x] Beranda H7 membaca artikel terbaru dari DB; sitemap memuat artikel
- [x] Verifikasi: tulis artikel contoh end-to-end, cek jadwal terbit, screenshot

Commit: `phase 4: blog and admin posting`

## Fase 5: Registrasi & login (Langkah 5)

- [x] Registrasi: nama lengkap, nama perusahaan ("Perorangan" boleh), ponsel +62, email, password >= 8, persetujuan Syarat & Privasi
- [x] Verifikasi email lewat link bertanda tangan + kedaluwarsa; kirim ulang; lupa/reset password
- [x] Google sign-in (`arctic`), muncul hanya bila env diisi; setelah login pertama wajib lengkapi perusahaan + ponsel (`/profil/lengkapi`)
- [x] **Modal** daftar/masuk yang bisa dipanggil dari mana saja; setelah sukses kembali ke aksi sebelumnya; prompt hero ikut terbawa
- [x] Navbar sadar-login: "Proyek Saya" + badge, avatar + menu (Profil, Proyek Saya, Keluar)
- [x] `/profil`: ubah data dan password; email/ponsel tidak pernah tampil publik
- [x] Keamanan: rate limit login, `token_version` untuk cabut sesi, cookie `httpOnly`/`sameSite`/`secure`, CSRF lewat server actions + cek Origin
- [x] Verifikasi: alur daftar -> verifikasi -> masuk -> keluar, reset password, akses admin ditolak untuk user biasa

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

### Fase 5
- Alur: daftar -> email verifikasi (tautan 24 jam, sekali pakai, hanya hash SHA-256 di DB) -> klik tautan = terverifikasi **dan langsung masuk**, lalu kembali ke `next` (mis. `/mulai`). Login ditolak sebelum verifikasi, tetapi pesannya baru muncul setelah sandi benar (tidak membocorkan akun). Daftar dengan email yang sudah ada mendapat respons netral yang sama dan pemilik akun diberi tahu lewat email.
- Reset password: tautan 1 jam sekali pakai (UPDATE atomik), `token_version` dinaikkan sehingga semua sesi lama (termasuk di browser lain) keluar. Ubah password di `/profil` mempertahankan sesi browser ini saja.
- Modal (`<dialog>` bawaan: fokus terjebak, Esc, klik latar) bisa dibuka dari navbar dan dari hero prompt. Prompt hero disimpan di `sessionStorage` dan registrasi dari modal mengingat tujuan `/mulai`. Navbar sadar-login tanpa membuat halaman marketing dinamis: sesi diambil dari `/api/session` setelah hidrasi dan diperbarui tiap perpindahan rute.
- Google sign-in (arctic, PKCE S256, state di cookie httpOnly): tombol hanya muncul bila `GOOGLE_CLIENT_ID/SECRET` diisi; akun Google baru wajib melengkapi perusahaan + ponsel di `/profil/lengkapi`; email Google yang sudah terverifikasi ditautkan ke akun email yang sama. **Belum diuji end-to-end** (butuh kredensial OAuth asli dari klien): yang teruji adalah bentuk URL otorisasi, cookie, penolakan state palsu, dan tombol on/off.
- Bug serius yang ditemukan lewat tes dan diperbaiki: (1) di MariaDB dengan `explicit_defaults_for_timestamp=OFF`, kolom `TIMESTAMP` yang dimaksud nullable berubah jadi `NOT NULL DEFAULT current_timestamp() ON UPDATE ...` (akun baru langsung "terverifikasi", `published_at` ikut berubah tiap edit, `used_at` berisi 0000-00-00); semua momen nullable kini `DATETIME` (migrasi 0003, UTC). (2) file `"use server"` mengekspos setiap fungsi ekspor sebagai endpoint: `finishVerification(userId)` dipindah ke `src/lib/account.ts`. (3) `<form>` bersarang (kirim ulang verifikasi di dalam form login) ikut memicu login. (4) Cookie yang disetel di server action membuat Next me-render ulang halaman, sehingga reset password sukses malah menampilkan "tautan tidak berlaku": kini `redirect()` dari server. (5) Logout dari `/` me-redirect ke `/` yang sama, state klien basi: kini `signOut()` + refresh eksplisit.
- Teruji end-to-end (50 asersi Playwright): validasi + nilai form tidak hilang, verifikasi, resend, link usang/bekas ditolak, duplikat netral, forgot/reset, sesi lain dicabut, profil + ubah sandi, modal (buka, tab, Esc), hero -> modal -> verifikasi -> `/mulai`, halaman terlindungi.
- `/proyek` sementara berupa keadaan kosong yang jujur sampai Fase 6.

### Fase 4
- Struktur: route group `(site)` (navbar + footer) dan `(admin)` (shell sendiri). `SiteShell` dipakai juga oleh `not-found.tsx` agar 404 tetap punya navigasi. Navbar belum sadar-login (Fase 5) supaya halaman marketing tetap statis dan cepat.
- Auth inti: JWT HS256 (`jose`) di cookie httpOnly, `token_version` dicek ke DB tiap request (cabut sesi seketika), bcrypt cost 12 dengan hash palsu untuk akun tak ada (waktu respons sama), rate limit login per IP dan per email, `safeNext()` menolak open redirect. `proxy.ts` hanya gerbang optimistis (cek ada cookie, menjaga `?next=` penuh); pemeriksaan sebenarnya (`requireAdmin`) ada di layout, setiap halaman, setiap action, dan route upload.
- Editor Tiptap v3 (StarterKit sudah memuat Link dan Underline). HTML disanitasi saat simpan (`sanitize-html`): script, iframe, `on*`, `javascript:`, style, dan gambar di luar `/uploads` atau https dibuang; tautan eksternal otomatis `rel=noopener`. Teruji dengan payload XSS lewat form sungguhan.
- Upload gambar: divalidasi dengan men-decode (bukan percaya ekstensi), maks 8 MB, cover dipotong 16:9 (`position: attention`), semua jadi WebP tanpa metadata, nama acak, tersimpan di `UPLOAD_DIR`. API upload: admin saja, cek Origin, rate limit 60/jam.
- "Terjadwal" = status terbit dengan `published_at` di masa depan; publik hanya melihat `published_at <= NOW()`. Beranda dan `/blog/[slug]` memakai ISR (5 menit dan 60 detik) plus `revalidatePath` saat simpan/hapus, sehingga build tidak butuh DB.
- Bug yang ditemukan lewat tes dan diperbaiki: ringkasan otomatis menyambung blok tanpa spasi dan "membeku" setelah simpan pertama; zona waktu sesi MySQL dipaku ke UTC.
- Teruji end-to-end (Playwright): redirect login dengan `next`, salah sandi, user biasa ditolak dari `/admin` dan API upload (401), buat/terbitkan artikel dengan editor + cover + gambar sisipan, tolak file non-gambar, artikel tampil di `/blog`, beranda, sitemap; draf dan terjadwal tidak terlihat publik (404) tapi bisa dipratinjau admin; cari; hapus dengan konfirmasi.
- Disk lokal sempat penuh (C: tersisa 1 MB) saat Lighthouse menulis JSON; file scratch milik sesi dihapus, tidak ada file pengguna yang disentuh.

### Fase 3
- DB: MySQL/MariaDB lewat Drizzle. Migrasi di `drizzle/`, dijalankan `npm run db:migrate` (hanya butuh dependensi runtime, jadi bisa dijalankan di server). Dev DB: MariaDB terpisah di port 3307 (lihat `.env.example`).
- Form konsultasi: honeypot, stempel waktu (min 2,5 dtk), rate limit 5/jam/IP (tabel `rate_limits`), simpan ke `inquiries` **sebelum** email dikirim; email ke admin + konfirmasi ke pengirim, dan di dev ditulis ke `storage/outbox/`. Telepon dinormalisasi ke +62. Teruji end-to-end (validasi, honeypot, rate limit, DB, email).
- Bug yang ditemukan lewat tes: React 19 me-reset field setelah `<form action>` (isian hilang saat error validasi dan stempel waktu kembali 0), jadi form memakai `onSubmit` + `startTransition` dan input stempel dikontrol state.
- Next 16: `priority` pada `next/image` deprecated (pakai `loading="eager"` + `fetchPriority="high"`), `images.qualities` wajib terdaftar, prop `unstable_retry` pada `error.tsx`, `PageProps<"/route">` bertipe lewat `next typegen`.
- `Reveal` ditulis ulang: server merender konten TERLIHAT, setelah mount hanya elemen di bawah layar yang disembunyikan lalu diungkap. Ini memperbaiki LCP halaman dalam (3,3 dtk menjadi 0,8 dtk) karena konten di atas layar tidak lagi menunggu hidrasi.
- Kontras: teks oranye kecil memakai token `accent` `#C2410C` (5,2:1); `brand` `#E8501E` (3,75:1) hanya untuk fill dan teks besar.
- Optimizer gambar dibatasi ke WebP (AVIF boros CPU di shared hosting). First-hit tiap ukuran gambar lebih lambat sampai cache terisi.
- Lighthouse mobile (build produksi lokal): beranda 100/100/100/100, produk, layanan, karya, tentang, kontak, privasi 93-100 untuk performa dan 100 untuk A11y, BP, SEO. `npm run check:links` merayapi 32 halaman: 0 link rusak.
- Stub jujur untuk fase berikutnya: `/blog` (Fase 4), `/masuk` (Fase 4-5), `/mulai` (Fase 6), `/forum` (menunggu Langkah 8).
- Konten draf yang butuh tinjauan: visi-misi, tahapan Journey, Kebijakan Privasi, Syarat & Ketentuan (lihat `docs/CONTENT_TODO.md`).

### Fase 2
- Hasil Lighthouse lokal (build produksi): mobile Perf 100 / A11y 100 / SEO 100 / Best-practices 96 (turun dari 100 hanya karena 404 prefetch menuju halaman Fase 3); desktop Perf 100 / A11y 97 / SEO 100.
- Masalah yang ditemukan dan diperbaiki: (1) `next/image` Next 16 menolak `quality` yang tidak terdaftar (HTTP 400), jadi `images.qualities` diset; (2) `blur-2xl` pada glow besar membuat render mobile berat, LCP 3,8-4,3 dtk, dihapus (radial-gradient sudah halus) dan LCP jadi 1,0 dtk; (3) duplikat marquee berisi link fokusable di dalam `aria-hidden`, kini `inert`; (4) kontras teks footer/placeholder; (5) wordmark footer dipindah ke pseudo-element agar bukan teks DOM; (6) label tab hero membungkus di 375 px.
- Marquee: dua baris 130 dtk dan 140 dtk, arah berlawanan, 25 tile (desktop + mobile), pause saat hover, `prefers-reduced-motion` menghentikannya.
- Prompt hero disimpan di `sessionStorage` (`omnity:hero-prompt`) dan dibaca di Fase 6. Tab Mobile App / Solusi IT mengarah ke `/kontak?topik=...&pesan=...` (dibuat di Fase 3).
- Karya = tiga situs nyata; konten kasus AI sengaja diberi label "Contoh skenario" dan tanpa angka. Lihat `docs/CONTENT_TODO.md`.
- Link ke halaman Fase 3 masih 404 di tahap ini (diperiksa crawler di Fase 3).

### Fase 1
- Next 16.4 memakai `proxy.ts` (bukan middleware) dan mengaktifkan Cache Components di scaffold; dimatikan sesuai PLAN.md. Typed `LayoutProps` butuh `next typegen` (sudah masuk script `typecheck`).
- Reveal dibuat dengan IntersectionObserver + transisi CSS (bukan `motion`) supaya tidak ada hydration mismatch; `motion` dipakai untuk mega menu, drawer, dan accordion. Reduced motion dihormati di CSS dan lewat `MotionConfig`.
- Bug yang ditemukan lewat tes interaksi dan sudah diperbaiki: `onFocus` membuka mega menu lalu Enter menutupnya; klik mouse setelah hover menutup menu.
- Footer sticky "reveal" hanya aktif di layar >= 1024 px dan tinggi >= 760 px (varian `reveal`), agar footer yang lebih tinggi dari viewport tidak terpotong.
- Logo cincin adalah rekonstruksi SVG; SVG asli dari klien masih diminta.
- `tools/shot.mjs` menandai FAIL untuk link 404; pada Fase 1-2 itu wajar (halaman Fase 3 belum ada).

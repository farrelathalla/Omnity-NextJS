# Omnity (omnity.co.id) - Next.js

Website baru PT Omnity Solusi Integrasi: etalase solusi (produk, layanan, karya,
blog) dan fitur **Design Anything** (survei -> mockup -> penawaran).

- Rencana: [`PLAN.md`](./PLAN.md) - Urutan kerja & status: [`IMPLEMENTATION_PLAN.md`](./IMPLEMENTATION_PLAN.md)
- Brief klien: `Omnity_Website_Revamp_Brief.pdf` (di luar repo)
- Situs WordPress lama **tidak diubah** oleh repo ini. Lihat `docs/SWITCHING.md` (fase 8).

## Stack

Next.js 16 (App Router) - TypeScript - Tailwind CSS v4 - motion - Lucide.
Database MySQL/MariaDB (Drizzle ORM). Detail alasan di PLAN.md.

> Next.js 16 berbeda dari versi lama (mis. `proxy.ts` menggantikan middleware).
> Baca `node_modules/next/dist/docs/` sebelum menulis kode baru.

## Menjalankan

```bash
npm install
cp .env.example .env.local   # isi sesuai kebutuhan
npm run dev                  # http://localhost:3000
```

| Script | Fungsi |
|---|---|
| `npm run dev` | Dev server (Turbopack) |
| `npm run build` / `npm start` | Build produksi / jalankan |
| `npm run lint` | ESLint |
| `npm run db:generate` | Buat migrasi SQL dari `src/db/schema.ts` (ke folder `drizzle/`) |
| `npm run db:migrate` | Terapkan migrasi (hanya butuh dependensi runtime, aman dijalankan di server) |
| `npm run db:seed` | Buat/reset admin pertama dari `ADMIN_EMAIL` / `ADMIN_PASSWORD` |
| `npm run check:links` | Rayapi situs dan laporkan link rusak |
| `npm run capture:work` | Ambil ulang screenshot portofolio ke `public/work/` |
| `npm run typecheck` | `next typegen` + `tsc --noEmit` |
| `npm run shot -- <baseUrl> <outDir> <route...>` | Screenshot responsif + cek overflow, reveal, link mati (Playwright + Chrome lokal) |

Di Git Bash (Windows) awali perintah dengan `MSYS_NO_PATHCONV=1` bila argumen
berawalan `/`, dan beri path output gaya Windows (`C:/...`).

## Database dan admin

1. Siapkan MySQL 8 atau MariaDB 10.4+ dan satu database kosong (`utf8mb4`).
2. Isi `DATABASE_URL`, `AUTH_SECRET` (32+ karakter acak), `ADMIN_EMAIL`, `ADMIN_PASSWORD` di `.env.local`.
3. `npm run db:migrate` lalu `npm run db:seed`.
4. Masuk di `/masuk`. Admin ada di `/admin`: tulis, jadwalkan, dan hapus artikel blog (editor Tiptap, foto sampul 16:9 otomatis).

### Akun pengguna

Registrasi (`/daftar` atau modal), verifikasi email, login, lupa/reset sandi, dan `/profil` sudah aktif.
Email dikirim lewat SMTP (`SMTP_*`); tanpa SMTP, tautan verifikasi/reset ditulis ke `storage/outbox/`
(buka file JSON terbaru untuk tautannya). **Google sign-in** aktif bila `GOOGLE_CLIENT_ID` dan
`GOOGLE_CLIENT_SECRET` diisi; daftarkan redirect URI `<SITE_URL>/api/auth/google/callback` di Google Cloud Console.

Upload disimpan di `UPLOAD_DIR` (default `./storage/uploads`, diabaikan git) dan disajikan lewat
`/uploads/...`. **Di produksi arahkan ke folder di luar aplikasi** agar deploy tidak menghapusnya.
Tanpa `SMTP_HOST`, email ditulis ke `storage/outbox/` (cocok untuk dev).

## Struktur

```
src/app/(site)/          halaman publik (navbar + footer)
src/app/(admin)/admin/   panel admin (shell terpisah, wajib admin)
src/app/actions/         server action bersama (form konsultasi, login)
src/db/                  skema Drizzle + koneksi; migrasi di drizzle/
src/lib/                 auth, storage, html (sanitasi), posts, mail, rate-limit
src/components/ui/       Button, Card, Badge, form, Section*
src/components/layout/   Navbar (mega menu), Footer, AnnouncementBar, Backdrop
src/components/motion/   Reveal, Marquee, MotionProvider
src/components/brand/    Logo
src/content/             data produk, layanan, karya (typed)
tools/                   skrip dev (screenshot, capture portofolio)
public/                  aset statis
```

## Design system

Token ada di `src/app/globals.css` (`@theme`). Halaman `/styleguide` menampilkan
semua komponen. Aturan singkat: judul serif besar dengan satu kata miring,
kartu putih border 1 px radius 16 px, ikon Lucide stroke 1,5, gerak 200-300 ms
dan selalu menghormati `prefers-reduced-motion`.

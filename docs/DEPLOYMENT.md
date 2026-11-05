# Deployment (Hostinger, Node.js)

Panduan men-deploy aplikasi ini ke hosting Hostinger (paket Business, akun bersama). Staging
berjalan di `https://staging.omnity.co.id`. Cara pindah ke domain utama ada di
[SWITCHING.md](./SWITCHING.md).

> Akun Hostinger yang sama juga menjadi host situs klien lain. Hanya sentuh website
> `omnity.co.id` dan `staging.omnity.co.id`.

## 1. Gambaran

| Hal | Nilai |
|---|---|
| Runtime | Node.js 22, npm |
| Build | `npm run build` = `next build --webpack` (lihat 4. Catatan penting) |
| Output | Hostinger mendeteksi *standalone output* dan menjalankannya (`0.0.0.0:3000`) |
| Database | MySQL Hostinger, host aplikasi `127.0.0.1:3306` |
| Migrasi | Otomatis saat start bila `AUTO_MIGRATE=1` (`src/instrumentation.ts`, `src/lib/startup.ts`) |
| Upload | `UPLOAD_DIR`, di luar folder aplikasi supaya selamat dari deploy berikutnya |
| Email | SMTP (belum diisi di staging, lihat 6.) |

## 2. Variabel environment

Diset di hPanel > Websites > (domain) > Node.js > Environment variables, atau lewat API
`hosting_nodejs_replace-environment-variables` (mengganti SELURUH set, jadi kirim semuanya).
Jangan pernah memasukkan nilai asli ke repo. Daftar kunci ada di `.env.example`.

| Kunci | Staging | Produksi |
|---|---|---|
| `SITE_ENV` | `staging` (menambah `noindex` + lencana pratinjau) | `production` |
| `SITE_URL` | `https://staging.omnity.co.id` | `https://omnity.co.id` |
| `DATABASE_URL` | `mysql://<user>:<password>@127.0.0.1:3306/<db>` | database terpisah |
| `AUTH_SECRET` | acak, 32+ byte (`openssl rand -base64 48`) | **berbeda** dari staging |
| `AUTO_MIGRATE` | `1` | `1` |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME` | admin pertama; hanya dibuat bila belum ada admin | idem |
| `UPLOAD_DIR` | `/home/u398445816/domains/staging.omnity.co.id/storage/uploads` | `.../domains/omnity.co.id/storage/uploads` |
| `OUTBOX_DIR` | folder di luar app; dipakai bila SMTP kosong | tidak perlu bila SMTP terisi |
| `MAIL_FROM`, `MAIL_ADMIN_TO` | `Omnity <no-reply@omnity.co.id>`, `corporate@omnity.co.id` | idem |
| `SMTP_HOST/PORT/USER/PASS` | kosong | wajib |
| `GOOGLE_CLIENT_ID/SECRET` | kosong (tombol Google tersembunyi) | opsional |
| `BUILD_CPUS` | opsional, default 2 | idem |

Variabel yang dibaca saat build (di Next, yang berawalan `NEXT_PUBLIC_`) butuh build ulang;
aplikasi ini tidak memakainya. Perubahan variabel lain cukup restart aplikasi.

Database dibuat lewat hPanel > Databases atau API `hosting_databases_create`. Hostinger
menambahkan awalan akun: nama `omnity_staging` menjadi `u398445816_omnity_staging`, dan
user `omnity_stg` menjadi `u398445816_omnity_stg`. Dari aplikasi selalu pakai
`127.0.0.1:3306`, bukan host `srvNNNN.hstgr.io` (itu hanya untuk koneksi dari luar).

## 3. Cara deploy

### A. Unggah arsip (yang dipakai saat ini)

Repo GitHub bersifat privat dan belum terhubung ke Git hPanel, jadi staging di-deploy dari
arsip. Dari folder repo:

1. `git archive --format=zip -o app.zip HEAD` (hanya file yang di-track: `.env.local`,
   `node_modules`, dan `.next` tidak ikut).
2. Minta kredensial unggah: `hosting_files_generate-upload-url` (`username`, `domain`).
3. Unggah lewat TUS ke `public_html/app.zip`: `POST` lalu `PATCH` ke
   `{url}/app.zip?override=true` dengan header `X-Auth`, `X-Auth-Rest`, `Tus-Resumable: 1.0.0`
   (contoh curl ada di deskripsi operasi tersebut). Batas 50 MB untuk jalur sekali-panggil;
   arsip ini sekitar 2,4 MB.
4. `hosting_nodejs_start-build` dengan `node_version: 22`, `app_type: next`,
   `root_directory: ./`, `output_directory: .next`, `build_script: build`,
   `package_manager: npm`, `source_type: archive`, `source_options.archive_path: app.zip`.
5. Pantau dengan `hosting_get-deployment` (state `completed` atau `failed`). Build sekitar 2
   menit. Log jalan: `hosting_nodejs_runtime-logs`.

**Build menimpa seluruh isi website** (kecuali `.htaccess` dan folder subdomain). Itu aman di
staging; di domain utama lihat peringatan di SWITCHING.md.

### B. Git otomatis (lebih nyaman, perlu satu kali setup)

Hubungkan GitHub ke Hostinger di hPanel > Websites > Manage > Advanced > Git, beri akses ke
`farrelathalla/Omnity-NextJS`, lalu `hosting_deploy` dengan
`git: { repository: "farrelathalla/Omnity-NextJS", branch: "main" }`, `type: "nodejs"`.
Setelah itu setiap push ke `main` ter-deploy otomatis. (Percobaan awal gagal dengan
"Repository ... was not found in your 1 active Git installation(s)" karena repo belum diberi
akses.)

## 4. Catatan penting (temuan saat deploy pertama)

- **Build memakai webpack, bukan Turbopack.** Turbopack menjalankan proses Node terpisah
  untuk memproses CSS dan proses itu langsung mati di lingkungan build Hostinger
  (`evaluate_webpack_loader ... node process exited before we could connect to it`).
  Karena itu `npm run build` = `next build --webpack`, dan Tailwind v4 dipasang lewat
  `@tailwindcss/postcss` + `postcss.config.mjs` (bukan loader khusus Turbopack).
  `npm run dev` tetap memakai Turbopack.
- **Batasi worker prerender.** Server melaporkan 55 core; tanpa batas Next membuat 55 worker
  dan build mati `SIGABRT` (kehabisan memori). `next.config.ts` memakai
  `experimental.cpus = BUILD_CPUS || 2`.
- **Folder `drizzle/` harus ikut ke output standalone.** Hostinger hanya menyalin file yang
  ter-trace; migrasi dibaca dari disk saat start. `outputFileTracingIncludes` di
  `next.config.ts` menyertakannya. Tanpanya log menampilkan
  `[startup] failed: Can't find meta/_journal.json file` dan halaman berbasis DB
  (`/blog`) memberi 500.
- **Saat build, database tidak tersedia/kosong.** Log `[posts] getLatestPosts failed` saat
  build itu wajar: query ditangkap, halaman statis dibuat tanpa artikel, dan beranda (ISR 5
  menit) terisi pada permintaan berikutnya.
- **Path lokal dengan tanda petik** (mis. `C:\Users\Farrel's Laptop\...`) merusak build
  webpack di Windows (`Module parse failed` / `Empty dependency`). Build produksi
  yang sahih adalah build di Hostinger (Linux) atau di path tanpa tanda petik. `next build`
  (Turbopack) di path itu tetap jalan untuk pengecekan lokal.
- Disk lokal hampir penuh membuat cache webpack gagal ditulis (`ENOSPC`); hapus `.next`
  sebelum build ulang bila perlu.

## 5. Verifikasi setelah deploy

1. `hosting_get-deployment`: state `completed`.
2. `hosting_nodejs_runtime-logs`: harus ada `[startup] migrations are up to date`; pada
   boot pertama juga `[startup] first admin created: ...`.
3. Buka `/`, `/blog`, `/masuk`; `/admin` tanpa sesi harus mengarah ke `/masuk?next=%2Fadmin`.
4. Masuk sebagai admin, buka `/admin/blog`, `/admin/proyek`, `/admin/pengguna`.
5. Unggah gambar lewat editor blog: harus tersimpan di `UPLOAD_DIR` dan tampil dari
   `/uploads/...`. Optimizer gambar (`/_next/image`) memakai `sharp` dan harus memberi 200.
6. Staging: respons harus memuat `X-Robots-Tag: noindex, nofollow, noarchive`.

## 6. Email

Tanpa `SMTP_HOST`, email (verifikasi akun, reset password, notifikasi proyek) hanya ditulis
ke `OUTBOX_DIR` dan **tidak terkirim**. Di staging itu disengaja. Sebelum produksi isi
`SMTP_*` dengan mailbox Hostinger/cPanel (mis. `no-reply@`), dan pastikan SPF/DKIM agar tidak
masuk spam. Email domain masih di server cPanel lama (lihat `Omnity/CLAUDE.md`); jangan ubah
MX dan A `mail`.

## 7. Google OAuth

Redirect URI berbeda per domain dan harus didaftarkan di Google Cloud Console:
`https://staging.omnity.co.id/api/auth/google/callback` dan
`https://omnity.co.id/api/auth/google/callback`. Alur token exchange belum diuji dengan
kredensial asli.

## 8. Pemeliharaan

- Backup database sebelum deploy yang menambah migrasi (hPanel > Databases > phpMyAdmin >
  Export).
- Migrasi baru: `npm run db:generate`, commit folder `drizzle/`; diterapkan otomatis saat
  start. Jangan edit migrasi yang sudah diterapkan.
- Lupa password admin: `AUTO_MIGRATE` tidak pernah menimpa admin yang sudah ada. Pakai
  "Lupa password" (butuh SMTP) atau `npm run db:seed` dari mesin yang bisa menjangkau DB.

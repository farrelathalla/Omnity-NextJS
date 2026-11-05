# Pindah dari WordPress ke Next.js (dan kembali)

Status saat ini: **belum ada cutover.** `omnity.co.id` masih WordPress di Hostinger
(PHP 8.3, tema Impreza), dan versi Next.js hidup di `https://staging.omnity.co.id`.
Dokumen ini adalah prosedur untuk pindah, plus cara mundur. Jangan menjalankan langkah
cutover tanpa persetujuan eksplisit pemilik.

## Peta kondisi sekarang

| Komponen | Di mana | Catatan |
|---|---|---|
| WordPress (live) | Hostinger, website `omnity.co.id` | `A omnity.co.id` = `153.92.15.63` |
| Next.js staging | Hostinger, website `staging.omnity.co.id` | `A staging` = `153.92.15.63`, TTL 300 |
| WordPress lama (cPanel) | `103.140.90.234`, tetap utuh | masih jadi **server email** (`mail`, MX) |
| DNS | zona di cPanel lama (NS `ns1/ns2.serverbos.com`) | bukan di Hostinger, bukan di Exabytes |
| Email | 18 mailbox di cPanel lama | `MX 0 mail.omnity.co.id`, `A mail` = `103.140.90.234` |

Backup zona DNS (sebelum perubahan): `Omnity/dns-zone-backup-2026-11-05.json` dan
`Omnity/dns-zone-backup-2026-11-06-before-staging.json`. Salinan WordPress terakhir yang
diimpor: `Omnity/site.zip` + `Omnity/dump.sql`.

## Mengapa pindah tidak sesederhana mengubah DNS

Staging dan WordPress berada di **satu server dengan satu IP**. Server memilih situs
berdasarkan nama host (`Host:`), jadi mengubah A record `omnity.co.id` tidak bisa
"menunjuk" ke aplikasi staging; permintaan untuk `omnity.co.id` tetap dilayani oleh website
`omnity.co.id` di Hostinger. Artinya aplikasi Next.js harus ditaruh di website
`omnity.co.id` itu sendiri, yang **menimpa** file WordPress di `public_html`.
Karena itu rollback yang andal bergantung pada backup, bukan pada tombol.

## Sebelum cutover (semua wajib)

- [ ] Klien menyetujui staging dan mengisi hal di `docs/CONTENT_TODO.md` yang bersifat wajib
      (logo SVG asli, alamat, telepon, medsos, angka bukti, teks legal).
- [ ] SSL `omnity.co.id` aktif (`hosting_websites_get-settings` > `ssl.status = active`).
      Sertifikat staging sudah aktif.
- [ ] Turunkan TTL record `omnity.co.id` dan `www` dari 14400 s ke 300 s **minimal 4 jam**
      sebelumnya (zona di cPanel lama: Zone Editor atau UAPI `DNS/mass_edit_zone`).
- [ ] Backup WordPress terbaru: hPanel > Backups, atau ekspor ulang file + DB. Jangan
      mengandalkan `site.zip` bila klien sudah mengedit situs sejak 2026-11-05.
- [ ] Siapkan database produksi **baru** (bukan DB WordPress) dan env produksi
      (lihat DEPLOYMENT.md bagian 2): `SITE_ENV=production`, `SITE_URL=https://omnity.co.id`,
      `AUTH_SECRET` baru, `UPLOAD_DIR` di `domains/omnity.co.id/storage/uploads`, `SMTP_*`.
- [ ] Daftarkan redirect URI Google untuk `https://omnity.co.id` bila tombol Google dipakai.
- [ ] Buat daftar redirect 301 dari URL WordPress lama ke URL baru (supaya SEO tidak hilang);
      lihat bagian Redirect.
- [ ] Pastikan mailbox tidak terpengaruh: **jangan** ubah `MX` dan `A mail`.

## Cutover

1. Uji ulang staging dengan build yang sama persis (tag/commit yang akan dirilis).
2. Di hPanel, ubah tipe website `omnity.co.id` atau buat ulang sebagai Node.js
   (**langkah ini menghapus file WordPress dari `public_html`**; database WordPress tidak
   ikut terhapus). Bila hPanel mensyaratkan website kosong, hapus website lalu buat ulang dengan
   domain yang sama. Cara persisnya belum diverifikasi; cek di hPanel sebelum mengeksekusi.
3. Set env produksi, lalu deploy build (DEPLOYMENT.md bagian 3). Boot pertama membuat
   tabel dan admin pertama.
4. Verifikasi (DEPLOYMENT.md bagian 5) di `https://omnity.co.id`. `200` saja bukan bukti:
   cari teks yang memang ada di build, mis. judul beranda baru.
5. Aktifkan redirect HTTPS (`is_https_redirect_enabled`).
6. Kirim ulang `sitemap.xml` ke Google Search Console; pantau 404 selama 1-2 minggu.

## Rollback

Pilih sesuai keadaan. Semua opsi tidak menyentuh email.

**Cepat (menit sampai TTL habis): kembalikan A record ke server cPanel lama.**
Di zone editor cPanel lama set `omnity.co.id` (dan `www`) kembali ke `103.140.90.234`.
Situs cPanel lama masih utuh, tetapi isinya adalah **snapshot sebelum 2026-11-05**: edit
apa pun yang dibuat di WordPress Hostinger sesudah itu tidak ada di sana. Jangan matikan
paket hosting lama sampai klien yakin.

**Lengkap: pulihkan WordPress di Hostinger dari backup.**
Impor ulang arsip + dump (`wordpress_installations_import-website` dengan `archive_path`
dan `sql_path`, lalu hapus kedua file dari `public_html`; prosedur ada di
`Omnity/CLAUDE.md`), atau restore dari hPanel > Backups. Gunakan backup yang dibuat tepat
sebelum cutover.

Setelah rollback, catat penyebabnya di `IMPLEMENTATION_PLAN.md`, perbaiki di staging,
lalu ulangi dari awal daftar "Sebelum cutover".

## Redirect URL lama (usulan)

WordPress memakai struktur tema Impreza; sebelum cutover, ekspor daftar URL
(`/wp-sitemap.xml`) dan petakan ke rute baru. Usulan awal, perlu dicek terhadap sitemap asli:

| Lama | Baru |
|---|---|
| `/layanan/...`, `/services/...` | `/layanan/<slug>` bila ada, kalau tidak `/layanan` |
| `/produk/...`, `/products/...` | `/produk/<slug>` atau `/produk` |
| `/tentang-kami`, `/about` | `/tentang` |
| `/kontak`, `/contact` | `/kontak` |
| `/blog/...`, `/category/...` | `/blog` |
| `/wp-login.php`, `/wp-admin` | `/masuk` (atau 404) |

Implementasi: `redirects()` di `next.config.ts`. Belum dibuat karena sitemap lama belum
diaudit.

## Hal lain yang perlu diputuskan

- `ab.omnity.co.id` dan database WordPress `omnityco_wp968` (tidak dimigrasikan).
- Sandi cPanel lama sempat dibagikan lewat chat: ganti setelah migrasi selesai.
- Setelah cutover stabil, WordPress di Hostinger sebaiknya diarsipkan (ekspor) lalu
  dihapus agar tidak jadi celah keamanan (plugin lama, 8 kerentanan per 2026-11-05).

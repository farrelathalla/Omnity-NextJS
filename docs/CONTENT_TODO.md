# Konten yang perlu dikonfirmasi klien

Daftar ini diperbarui tiap fase. Semua item di bawah **sudah tampil di situs**
dengan isi sementara yang jujur (tidak ada angka atau klaim yang dikarang),
dan harus diganti/dikonfirmasi sebelum situs diluncurkan.

| # | Item | Status sekarang | Lokasi di kode | Dibutuhkan dari klien |
|---|---|---|---|---|
| 1 | Logo asli (SVG/AI) dan kode warna brand | Tanda cincin dibuat ulang sebagai SVG; warna `#E8501E` dari brief | `src/components/brand/logo.tsx`, `public/brand/omnity-mark.svg`, `src/app/icon.svg` | File logo asli |
| 2 | Angka social proof ("50+ klien", "100+ proyek selesai") | Angka contoh dari brief | `src/lib/site.ts` (`site.proof`) | Angka sebenarnya, atau hapus |
| 3 | Alamat kantor | JustCo, Sequis Tower Lt. 17, Jl. Jend. Sudirman No. 71, Jakarta 12190 (dari situs lama) | `src/lib/site.ts` | Konfirmasi alamat resmi |
| 4 | Email resmi | `corporate@omnity.co.id` (typo `ommity` di situs lama diperbaiki) | `src/lib/site.ts` | Konfirmasi |
| 5 | Nomor telepon / WhatsApp | Belum ada, tidak ditampilkan | `src/lib/site.ts` (`phone`) | Nomor resmi |
| 6 | Media sosial | Belum ada, tidak ditampilkan | `src/lib/site.ts` (`social`) | Tautan akun |
| 7 | Use case / studi kasus AI | Tiga **contoh skenario** tanpa angka, ditandai "Contoh skenario" | `src/content/use-cases.ts` | Studi kasus nyata beserta hasil terukur |
| 8 | Deskripsi produk (8 produk) | Ditulis ulang dari situs lama, singkat | `src/content/products.ts` | Review dan detail fitur (Fase 3 menambah halaman detail) |
| 9 | Deskripsi layanan (7 layanan) | Ditulis dari brief | `src/content/services.ts` | Review, deliverable dan proses |
| 10 | Karya portofolio | Saiga Conservation Alliance, Lextera Survey Indonesia, NCB Living (screenshot situs live) | `src/content/works.ts`, `public/work/` | Konfirmasi peran Omnity/Farrel di tiap proyek dan izin publikasi; tambah karya lain bila ada |
| 11 | Pengumuman di atas header | "Baru: Design Anything..." (tanpa janji gratis) | `src/lib/site.ts` (`announcement`) | Putuskan apakah mockup awal gratis; ubah teks bila ya |
| 12 | Harga / paket website | Tidak ditampilkan; penawaran diketik admin per proyek | (Fase 7) | 3 paket (Starter/Business/Custom) dan daftar harga add-on |
| 13 | Artikel blog pertama | Section blog memakai keadaan kosong | `src/components/home/content-section.tsx` | Artikel pertama (ditulis klien lewat admin) |
| 14 | Logo mitra pembayaran | Diambil dari gambar di situs lama (`public/brand/payments.webp`) | `src/components/home/products-section.tsx` | Konfirmasi boleh dipakai |
| 15 | Visi dan misi | Draf dari saya (satu kalimat visi, tiga misi) | `src/app/tentang/page.tsx` | Visi-misi resmi perusahaan |
| 16 | Tahapan Journey (4 langkah) | Draf berdasarkan cara kerja umum; bukan sejarah perusahaan | `src/app/journey/page.tsx` | Konfirmasi proses kerja, atau ganti dengan linimasa perusahaan |
| 17 | Halaman Karier | Tanpa lowongan, ajakan kirim CV ke email | `src/app/karier/page.tsx` | Daftar lowongan terbuka (bila ada) |
| 18 | Kebijakan Privasi dan Syarat & Ketentuan | Draf mengacu UU PDP, tanpa tinjauan hukum | `src/app/privasi/page.tsx`, `src/app/syarat/page.tsx` | Tinjauan konsultan hukum |
| 19 | Detail produk (fitur, use case, FAQ) | Ditulis dari deskripsi situs lama; tanpa screenshot produk | `src/content/product-details.ts` | Fitur lengkap, screenshot/mockup produk, integrasi sebenarnya |
| 20 | Detail layanan (deliverable, proses, FAQ) | Ditulis dari brief | `src/content/service-details.ts` | Review proses dan deliverable |
| 21 | Lokasi lain di situs lama | Situs lama mencantumkan "Workshop ONE" (World Capital Tower Lt. 17, Mega Kuningan) dan "Workshop Remote" (Bogor); belum ditampilkan | `src/lib/site.ts` | Konfirmasi apakah masih aktif dan perlu ditampilkan |
| 22 | SMTP untuk email | Belum diisi; email dev ditulis ke `storage/outbox/` | `.env` (SMTP_*) | Kredensial SMTP (mis. mailbox Hostinger) untuk `corporate@omnity.co.id` |

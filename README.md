# Omnity (omnity.co.id) - Next.js

Website baru PT Omnity Solusi Integrasi: etalase solusi (produk, layanan, karya,
blog) dan fitur **Design Anything** (survei -> mockup -> penawaran).

- Rencana: [`PLAN.md`](./PLAN.md) - Urutan kerja & status: [`IMPLEMENTATION_PLAN.md`](./IMPLEMENTATION_PLAN.md)
- Brief klien: `Omnity_Website_Revamp_Brief.pdf` (di luar repo)
- Situs WordPress lama **tidak diubah** oleh repo ini. Lihat `docs/SWITCHING.md` (fase 8).

## Stack

Next.js 16 (App Router) - TypeScript - Tailwind CSS v4 - motion - Lucide.
Database MySQL/MariaDB (Drizzle) dari fase 3. Detail alasan di PLAN.md.

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
| `npm run typecheck` | `next typegen` + `tsc --noEmit` |
| `npm run shot -- <baseUrl> <outDir> <route...>` | Screenshot responsif + cek overflow, reveal, link mati (Playwright + Chrome lokal) |

Di Git Bash (Windows) awali perintah dengan `MSYS_NO_PATHCONV=1` bila argumen
berawalan `/`, dan beri path output gaya Windows (`C:/...`).

## Struktur

```
src/app/                 route (App Router)
src/components/ui/       Button, Card, Badge, form, Section*
src/components/layout/   Navbar (mega menu), Footer, AnnouncementBar, Backdrop
src/components/motion/   Reveal, Marquee, MotionProvider
src/components/brand/    Logo
src/content/             data produk, layanan, karya (typed)
src/lib/                 site config, utils
tools/                   skrip dev (screenshot, capture portofolio)
public/                  aset statis
```

## Design system

Token ada di `src/app/globals.css` (`@theme`). Halaman `/styleguide` menampilkan
semua komponen. Aturan singkat: judul serif besar dengan satu kata miring,
kartu putih border 1 px radius 16 px, ikon Lucide stroke 1,5, gerak 200-300 ms
dan selalu menghormati `prefers-reduced-motion`.

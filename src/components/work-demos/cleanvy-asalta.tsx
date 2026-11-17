"use client";

import Image from "next/image";
import { ArrowRight, Check, Droplets, Factory, Leaf, Menu, Search, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { DemoModal, DemoRoot, useDemoScroll, useToast } from "./kit";

const GREEN = "#23924a";
const INK = "#13212b";

const APPS = ["Press parts", "Machining parts", "Heat treatment", "Lensa & kaca", "Mold", "Lainnya"] as const;
const AGENTS = ["Hydrocarbon", "Alkaline", "Emulsion", "Fluorinated solvent"] as const;
type App = (typeof APPS)[number];
type Agent = (typeof AGENTS)[number];

type Product = { name: string; tagline: string; points: string[]; apps: App[]; agents: Agent[] };
const PRODUCTS: Product[] = [
  { name: "CLEANVY", tagline: "Seri terlaris: sistem pembersih vakum yang dipilih banyak perusahaan global karena hasil cucinya yang andal.", points: ["Unit standar bisa disesuaikan kebutuhan lini", "Elektronik: motor presisi, HDD head, hybrid IC, kondensor", "Otomotif, logam presisi, dan semikonduktor (PCB, BGA/CSP)"], apps: ["Press parts", "Machining parts", "Heat treatment", "Lensa & kaca"], agents: ["Hydrocarbon", "Alkaline", "Emulsion"] },
  { name: "CLOVA", tagline: "Mesin cuci dan pengering satu bak yang ringkas dan hemat biaya.", points: ["Cuci kasar, cuci akhir, bilas uap, dan pengeringan vakum dalam satu bak", "Hasil degreasing setara model spesifikasi penuh", "Varian WATER CLOVA untuk pencucian berbasis air"], apps: ["Press parts", "Heat treatment"], agents: ["Hydrocarbon"] },
  { name: "HEARVY", tagline: "Satu bak dengan bongkar muat dari depan dan roller conveyor bebas.", points: ["Empat proses dalam satu bak seperti CLOVA", "Bongkar muat dari depan mengurangi beban fisik operator", "Cocok untuk keranjang komponen yang berat"], apps: ["Press parts", "Heat treatment"], agents: ["Hydrocarbon"] },
  { name: "BIOVA", tagline: "Sistem cuci dan pengering vakum satu bak berukuran besar.", points: ["Kapasitas besar untuk komponen heat treatment", "Teknologi vakum khas CLEANVY", "Pelarut hidrokarbon yang bisa didaur ulang"], apps: ["Heat treatment"], agents: ["Hydrocarbon"] },
  { name: "FISTA", tagline: "Sistem pelarut terfluorinasi dengan konsumsi pelarut paling hemat.", points: ["Pass Box, sistem airlock di pintu masuk", "Penguapan pelarut turun ke 1/2 sampai 1/10 dari produk konvensional", "Untuk lensa, kaca, dan komponen optik"], apps: ["Lensa & kaca"], agents: ["Fluorinated solvent"] },
  { name: "ELIOS", tagline: "Perawatan cetakan tanpa menyikat atau mengerok.", points: ["Gas burn dari injeksi hilang dalam 10 sampai 30 menit", "Emboss dan sudut sempit ikut bersih", "Mesin uji tersedia di pabrik Bogor"], apps: ["Mold"], agents: ["Alkaline"] },
  { name: "VAC ELIOS", tagline: "Pencucian elektroda dipadukan dengan teknologi vakum CLEANVY.", points: ["Hasil lebih sempurna untuk cetakan berbentuk rumit", "Menjangkau lubang sempit dan panjang", "Dari keluarga ELIOS untuk perawatan mold"], apps: ["Mold"], agents: [] },
  { name: "CD Series", tagline: "Regenerator distilasi vakum untuk pelarut hidrokarbon dan non-aqueous.", points: ["Keamanan tinggi dan perawatan mudah", "Menekan biaya pelarut lewat daur ulang", "Kapasitas dipilih sesuai kebutuhan"], apps: ["Lainnya"], agents: ["Hydrocarbon"] },
  { name: "Water Base Custom", tagline: "Mesin pembersih berbasis air yang dirancang khusus untuk lini Anda.", points: ["Tidak mudah terbakar, banyak variasi", "Umum di lini komponen otomotif", "Memerlukan fasilitas pengolahan air"], apps: ["Machining parts", "Lensa & kaca"], agents: ["Alkaline"] },
];

export default function CleanvyAsalta() {
  const [app, setApp] = useState<App | null>(null);
  const [agent, setAgent] = useState<Agent | null>(null);
  const [open, setOpen] = useState<Product | null>(null);
  const [form, setForm] = useState(false);
  const [menu, setMenu] = useState(false);
  const { ref, toId } = useDemoScroll();
  const toast = useToast();
  const list = PRODUCTS.filter((p) => (!app || p.apps.includes(app)) && (!agent || p.agents.includes(agent)));

  return (
    <DemoRoot
      scrollRef={ref}
      className="bg-white text-[#13212b]"
      overlay={
        <>
          {toast.node}
          <DemoModal open={!!open} onClose={() => { setOpen(null); setForm(false); }} label={open?.name ?? "Produk"} className="max-w-lg">
            {open ? (
              <div>
                <div className="flex items-start justify-between gap-4 p-6 pb-0">
                  <div>
                    <div className="flex flex-wrap gap-1.5">
                      {open.agents.map((a) => <span key={a} className="rounded-full px-2 py-0.5 text-[10.5px] font-semibold text-white" style={{ background: GREEN }}>{a}</span>)}
                      {open.apps.map((a) => <span key={a} className="rounded-full bg-black/5 px-2 py-0.5 text-[10.5px] font-medium text-black/60">{a}</span>)}
                    </div>
                    <h4 className="mt-3 text-[26px] font-bold tracking-tight">{open.name}</h4>
                  </div>
                  <button type="button" aria-label="Tutup" onClick={() => { setOpen(null); setForm(false); }} className="rounded-md p-1 text-black/50 hover:bg-black/5"><X className="size-5" /></button>
                </div>
                {form ? (
                  <form
                    className="space-y-3 p-6"
                    onSubmit={(e) => {
                      e.preventDefault();
                      setOpen(null);
                      setForm(false);
                      toast.show("Terima kasih, tim kami akan menghubungi Anda");
                    }}
                  >
                    <p className="text-[13px] text-black/60">Ceritakan komponen dan kontaminan yang ingin dibersihkan.</p>
                    <input required placeholder="Nama perusahaan" className="h-10 w-full rounded-lg border border-black/15 px-3 text-[13px] outline-none focus:border-[#23924a]" />
                    <input required type="email" placeholder="Email kerja" className="h-10 w-full rounded-lg border border-black/15 px-3 text-[13px] outline-none focus:border-[#23924a]" />
                    <textarea rows={3} defaultValue={`Konsultasi ${open.name}: `} className="w-full rounded-lg border border-black/15 px-3 py-2 text-[13px] outline-none focus:border-[#23924a]" />
                    <button className="h-10 w-full rounded-lg text-[13px] font-semibold text-white" style={{ background: GREEN }}>Kirim permintaan</button>
                  </form>
                ) : (
                  <div className="p-6">
                    <p className="text-[14px] leading-relaxed text-black/65">{open.tagline}</p>
                    <ul className="mt-4 space-y-2">
                      {open.points.map((p) => (
                        <li key={p} className="flex gap-2.5 text-[13px]"><Check className="mt-0.5 size-4 shrink-0" style={{ color: GREEN }} />{p}</li>
                      ))}
                    </ul>
                    <button type="button" onClick={() => setForm(true)} className="mt-6 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg text-[13px] font-semibold text-white" style={{ background: GREEN }}>
                      Konsultasikan produk ini <ArrowRight className="size-4" />
                    </button>
                  </div>
                )}
              </div>
            ) : null}
          </DemoModal>
        </>
      }
    >
      <header className="sticky top-0 z-20 border-b border-black/5 bg-white/90 backdrop-blur">
        <div className="flex items-center gap-6 px-5 py-3 @4xl:px-10">
          <div className="leading-none">
            <p className="text-[19px] font-black italic tracking-tight" style={{ color: GREEN }}>CLEANVY</p>
            <p className="text-[8.5px] font-semibold uppercase tracking-[0.3em] text-black/45">Asalta Indonesia</p>
          </div>
          <nav className="ml-auto hidden items-center gap-6 text-[13px] text-black/65 @3xl:flex">
            <button type="button" onClick={() => toId("produk")}>Produk</button>
            <button type="button" onClick={() => toId("aplikasi")}>Aplikasi</button>
            <button type="button" onClick={() => toId("perusahaan")}>Perusahaan</button>
          </nav>
          <button type="button" onClick={() => setOpen(PRODUCTS[0])} className="ml-auto hidden rounded-full px-4 py-2 text-[12.5px] font-semibold text-white @3xl:ml-0 @3xl:block" style={{ background: INK }}>Konsultasi</button>
          <button type="button" aria-label="Menu" onClick={() => setMenu(!menu)} className="ml-auto @3xl:hidden"><Menu className="size-5" /></button>
        </div>
        {menu ? (
          <div className="flex flex-col gap-1 border-t border-black/5 px-5 py-3 text-[14px] @3xl:hidden">
            {[["produk", "Produk"], ["aplikasi", "Aplikasi"], ["perusahaan", "Perusahaan"]].map(([id, l]) => (
              <button key={id} type="button" onClick={() => { toId(id); setMenu(false); }} className="py-1.5 text-left">{l}</button>
            ))}
          </div>
        ) : null}
      </header>

      <section className="grid gap-8 px-5 py-10 @3xl:grid-cols-[1.05fr_1fr] @3xl:items-center @4xl:px-10 @4xl:py-14">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold" style={{ background: "#e7f4ec", color: GREEN }}>
            <Leaf className="size-3.5" /> Teknologi pembersih industri dari Jepang
          </p>
          <h3 className="mt-4 text-[34px] font-bold leading-[1.05] tracking-tight @4xl:text-[44px]">
            Komponen bersih, kering, dan siap rakit.
          </h3>
          <p className="mt-4 max-w-md text-[14px] leading-relaxed text-black/60">
            Sistem pembersih vakum berbasis hidrokarbon sebagai pengganti CFC, untuk lini produksi presisi di Indonesia.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <button type="button" onClick={() => toId("produk")} className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-semibold text-white" style={{ background: GREEN }}>
              <Search className="size-4" /> Cari mesin yang cocok
            </button>
            <button type="button" onClick={() => toId("perusahaan")} className="rounded-full border border-black/15 px-5 py-2.5 text-[13px] font-semibold">Tentang kami</button>
          </div>
        </div>
        <div className="relative">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
            <Image src="/work/cleanvy-asalta/ph-machine.webp" alt="" fill sizes="520px" className="object-cover" />
          </div>
          <div className="absolute -bottom-4 left-4 rounded-2xl bg-white px-4 py-3 shadow-xl">
            <p className="text-[22px] font-bold leading-none">3.000+</p>
            <p className="text-[11px] text-black/50">unit terpasang di seluruh dunia</p>
          </div>
        </div>
      </section>

      <section data-anchor="produk" className="bg-[#f3f6f4] px-5 py-10 @4xl:px-10">
        <div data-anchor="aplikasi" className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: GREEN }}>Pencarian produk</p>
            <h4 className="mt-1 text-[26px] font-bold tracking-tight">Pilih aplikasi atau jenis pembersih.</h4>
          </div>
          {app || agent ? (
            <button type="button" onClick={() => { setApp(null); setAgent(null); }} className="text-[12.5px] font-semibold text-black/55 underline">Reset filter</button>
          ) : null}
        </div>
        <div className="mt-5 space-y-3">
          <FilterRow icon={Factory} label="Aplikasi" items={APPS} value={app} onChange={(v) => { setApp(v); toId("produk"); }} shotFor="Mold" />
          <FilterRow icon={Droplets} label="Pembersih" items={AGENTS} value={agent} onChange={(v) => { setAgent(v); toId("produk"); }} />
        </div>
        <p className="mt-5 text-[12.5px] text-black/50">{list.length} mesin cocok</p>
        <div className="mt-3 grid gap-3 @2xl:grid-cols-2 @4xl:grid-cols-3">
          {list.map((p, i) => (
            <button
              key={p.name}
              type="button"
              data-shot={i === 0 ? "2" : undefined}
              onClick={() => setOpen(p)}
              className="group rounded-2xl border border-black/5 bg-white p-5 text-left transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div className="flex items-center justify-between">
                <p className="text-[18px] font-black italic tracking-tight" style={{ color: INK }}>{p.name}</p>
                <ArrowRight className="size-4 text-black/30 transition group-hover:translate-x-1 group-hover:text-[#23924a]" />
              </div>
              <p className="mt-2 line-clamp-2 text-[12.5px] leading-relaxed text-black/60">{p.tagline}</p>
              <div className="mt-3 flex flex-wrap gap-1">
                {p.agents.map((a) => <span key={a} className="rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ background: "#e7f4ec", color: GREEN }}>{a}</span>)}
              </div>
            </button>
          ))}
          {list.length === 0 ? <p className="text-[13px] text-black/55">Belum ada kombinasi ini. Konsultasikan kebutuhan khusus Anda.</p> : null}
        </div>
      </section>

      <section data-anchor="perusahaan" className="grid gap-8 px-5 py-12 @3xl:grid-cols-2 @3xl:items-center @4xl:px-10">
        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
          <Image src="/work/cleanvy-asalta/ph-parts.webp" alt="" fill sizes="480px" className="object-cover" />
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: GREEN }}>Perusahaan</p>
          <h4 className="mt-1 text-[26px] font-bold leading-tight tracking-tight">Lahir untuk dunia yang peduli lingkungan.</h4>
          <p className="mt-3 text-[13.5px] leading-relaxed text-black/60">
            Setelah CFC dilarang karena merusak lapisan ozon, CLEANVY Corporation berdiri pada 1995 di Suwa, Nagano, Jepang, dengan sistem vakum yang memakai hidrokarbon sebagai pengganti. Cleanvy Asalta Indonesia menghadirkan teknologi itu untuk industri di sini.
          </p>
          <dl className="mt-6 grid grid-cols-3 gap-3">
            {[["1995", "Berdiri di Jepang"], ["3.000+", "Unit terpasang"], ["4", "Jenis pembersih"]].map(([v, l]) => (
              <div key={l} className="rounded-xl bg-[#f3f6f4] p-3">
                <dt className="text-[20px] font-bold">{v}</dt>
                <dd className="text-[11px] text-black/50">{l}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <footer className="px-5 py-8 text-[12px] text-white/60 @4xl:px-10" style={{ background: INK }}>
        <p className="text-[16px] font-black italic text-white">CLEANVY <span className="text-[10px] font-semibold not-italic tracking-[0.3em] text-white/50">ASALTA INDONESIA</span></p>
        <p className="mt-2">Sistem pembersih industri · Mesin uji tersedia di Bogor</p>
      </footer>
    </DemoRoot>
  );
}

function FilterRow<T extends string>({
  icon: I,
  label,
  items,
  value,
  onChange,
  shotFor,
}: {
  icon: typeof Factory;
  label: string;
  items: readonly T[];
  value: T | null;
  onChange: (v: T | null) => void;
  shotFor?: T;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="flex w-24 items-center gap-1.5 text-[12px] font-semibold text-black/50"><I className="size-4" />{label}</span>
      {items.map((it) => (
        <button
          key={it}
          type="button"
          data-shot={it === shotFor ? "1" : undefined}
          onClick={() => onChange(value === it ? null : it)}
          className={cn("rounded-full border px-3 py-1.5 text-[12px] font-medium transition", value === it ? "border-transparent text-white" : "border-black/10 bg-white hover:border-black/30")}
          style={value === it ? { background: GREEN } : undefined}
        >
          {it}
        </button>
      ))}
    </div>
  );
}

"use client";

import Image from "next/image";
import { ArrowRight, Check, Package, Plus, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { DemoModal, DemoRoot, useDemoScroll, useToast } from "./kit";

const INK = "#2b2522";
const TERRA = "#c8644b";

const CATS = [
  { id: "kaca", label: "Botol kaca", img: "glass", title: "Botol kaca untuk serum dan parfum.", text: "Bening atau amber, dengan dropper, spray, maupun tutup ulir. Cocok untuk serum, essential oil, dan parfum.", items: ["Botol dropper", "Botol parfum", "Botol essential oil", "Vial kecil"] },
  { id: "pet", label: "Botol PET", img: "pet", title: "Botol PET yang ringan dan tahan banting.", text: "Untuk toner, sabun cair, sampo, dan body wash. Tersedia dalam banyak bentuk, ukuran, dan warna.", items: ["Botol pump", "Botol spray", "Botol flip top", "Botol warna custom"] },
  { id: "jar", label: "Jar & tutup", img: "jar", title: "Jar untuk krim dan masker.", text: "Jar kaca dan plastik dengan tutup putih, emas, atau custom, untuk produk dengan tekstur kental.", items: ["Jar krim", "Jar masker", "Tutup ulir dan flip", "Inner lid"] },
  { id: "pump", label: "Pump & dekoratif", img: "hero", title: "Detail yang menyempurnakan kemasan.", text: "Pump, sprayer, dropper, dan elemen dekoratif yang membuat kemasan terasa premium.", items: ["Lotion pump", "Mist sprayer", "Dropper karet", "Dekorasi dan finishing"] },
] as const;

const CLIENTS = ["Kutus Kutus", "Autumn", "Envygreen", "Marly", "Dobha", "Guardian", "Zoya", "The Bath Box"];

export default function Lumei() {
  const [cat, setCat] = useState<(typeof CATS)[number]["id"]>("kaca");
  const [basket, setBasket] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const { ref, toId } = useDemoScroll();
  const toast = useToast();
  const c = CATS.find((x) => x.id === cat)!;
  const toggle = (it: string) => setBasket((b) => (b.includes(it) ? b.filter((x) => x !== it) : [...b, it]));

  return (
    <DemoRoot
      scrollRef={ref}
      className="bg-[#fbf6f1] text-[#2b2522]"
      overlay={
        <>
          {toast.node}
          <DemoModal open={open} onClose={() => setOpen(false)} label="Permintaan sampel" className="max-w-md">
            <form
              className="p-6"
              onSubmit={(e) => {
                e.preventDefault();
                setOpen(false);
                setBasket([]);
                toast.show("Permintaan sampel terkirim");
              }}
            >
              <div className="flex items-start justify-between">
                <h4 className="font-serif text-[28px] leading-none">Minta sampel</h4>
                <button type="button" aria-label="Tutup" onClick={() => setOpen(false)}><X className="size-5 text-black/50" /></button>
              </div>
              <p className="mt-2 text-[12.5px] text-black/55">{basket.length ? `${basket.length} jenis kemasan dipilih:` : "Belum ada kemasan dipilih. Anda tetap bisa menuliskan kebutuhan di bawah."}</p>
              {basket.length ? (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {basket.map((b) => (
                    <button key={b} type="button" onClick={() => toggle(b)} className="inline-flex items-center gap-1 rounded-full bg-[#f6e3d8] px-2.5 py-1 text-[11.5px] font-medium">{b}<X className="size-3" /></button>
                  ))}
                </div>
              ) : null}
              <div className="mt-4 space-y-2.5">
                <input required placeholder="Nama brand" className="h-10 w-full rounded-lg border border-black/15 bg-white px-3 text-[13px] outline-none focus:border-[#c8644b]" />
                <input required type="email" placeholder="Email" className="h-10 w-full rounded-lg border border-black/15 bg-white px-3 text-[13px] outline-none focus:border-[#c8644b]" />
                <textarea rows={2} placeholder="Kapasitas, warna, atau jumlah yang dibutuhkan" className="w-full rounded-lg border border-black/15 bg-white px-3 py-2 text-[13px] outline-none focus:border-[#c8644b]" />
              </div>
              <button className="mt-4 h-11 w-full rounded-full text-[13px] font-semibold text-white" style={{ background: INK }}>Kirim permintaan</button>
            </form>
          </DemoModal>
        </>
      }
    >
      <header className="sticky top-0 z-20 flex items-center gap-6 bg-[#fbf6f1]/90 px-5 py-3.5 backdrop-blur @4xl:px-10">
        <span className="font-serif text-[26px] leading-none">Lumei<span style={{ color: TERRA }}>.</span></span>
        <nav className="ml-auto hidden gap-6 text-[13px] text-black/60 @3xl:flex">
          <button type="button" onClick={() => toId("produk")}>Produk</button>
          <button type="button" onClick={() => toId("tentang")}>Tentang</button>
          <button type="button" onClick={() => toId("klien")}>Klien</button>
        </nav>
        <button type="button" data-shot="2" onClick={() => setOpen(true)} className="ml-auto inline-flex items-center gap-2 rounded-full px-4 py-2 text-[12.5px] font-semibold text-white @3xl:ml-0" style={{ background: INK }}>
          <Package className="size-4" /> Minta sampel
          {basket.length ? <span className="grid size-5 place-items-center rounded-full text-[10.5px]" style={{ background: TERRA }}>{basket.length}</span> : null}
        </button>
      </header>

      <section className="grid gap-8 px-5 pb-10 pt-6 @3xl:grid-cols-[1fr_1.15fr] @3xl:items-center @4xl:px-10">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em]" style={{ color: TERRA }}>Kemasan kosmetik · sejak 2002</p>
          <h3 className="mt-3 font-serif text-[40px] leading-[1.02] @4xl:text-[54px]">Kemasan yang membuat produk Anda <em>layak dipajang.</em></h3>
          <p className="mt-4 max-w-sm text-[14px] leading-relaxed text-black/60">Botol kaca, botol PET, jar, pump, tutup, dan dekoratif untuk brand kecantikan Indonesia.</p>
          <div className="mt-6 flex items-center gap-6">
            <button type="button" onClick={() => toId("produk")} className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-semibold text-white" style={{ background: TERRA }}>
              Lihat katalog <ArrowRight className="size-4" />
            </button>
            <div>
              <p className="font-serif text-[34px] leading-none">17</p>
              <p className="text-[11px] text-black/50">tahun pengalaman</p>
            </div>
          </div>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-[28px]">
          <Image src="/work/lumei/ph-hero.webp" alt="" fill sizes="560px" className="object-cover" priority />
        </div>
      </section>

      <section data-anchor="produk" className="bg-white px-5 py-12 @4xl:px-10">
        <h4 className="font-serif text-[34px] leading-none">Katalog kemasan</h4>
        <div className="scrollbar-none mt-5 flex gap-2 overflow-x-auto border-b border-black/10">
          {CATS.map((x) => (
            <button
              key={x.id}
              type="button"
              data-shot={x.id === "pet" ? "1" : undefined}
              onClick={() => { setCat(x.id); toId("produk"); }}
              className={cn("-mb-px shrink-0 border-b-2 px-1 pb-2.5 pr-4 text-[13px] font-semibold transition", cat === x.id ? "border-[#c8644b] text-black" : "border-transparent text-black/45 hover:text-black/70")}
            >
              {x.label}
            </button>
          ))}
        </div>
        <div className="mt-6 grid gap-6 @3xl:grid-cols-2 @3xl:items-center">
          <div className="relative aspect-[3/2] overflow-hidden rounded-2xl bg-[#f6e3d8]">
            <Image key={c.img} src={`/work/lumei/ph-${c.img}.webp`} alt="" fill sizes="520px" className="animate-[lm-in_0.5s_ease-out] object-cover" />
          </div>
          <div>
            <h5 className="font-serif text-[28px] leading-tight">{c.title}</h5>
            <p className="mt-2 text-[13.5px] leading-relaxed text-black/60">{c.text}</p>
            <ul className="mt-4 grid grid-cols-2 gap-2">
              {c.items.map((it) => {
                const on = basket.includes(it);
                return (
                  <li key={it}>
                    <button type="button" onClick={() => toggle(it)} className={cn("flex w-full items-center justify-between gap-2 rounded-xl border px-3 py-2.5 text-left text-[12.5px] font-medium transition", on ? "border-[#c8644b] bg-[#fbeee7]" : "border-black/10 hover:border-black/25")}>
                      {it}
                      {on ? <Check className="size-4 shrink-0" style={{ color: TERRA }} /> : <Plus className="size-4 shrink-0 text-black/35" />}
                    </button>
                  </li>
                );
              })}
            </ul>
            <p className="mt-3 text-[11.5px] text-black/45">Ketuk untuk menambah ke permintaan sampel · ready stock dan custom</p>
          </div>
        </div>
      </section>

      <section data-anchor="tentang" className="grid gap-8 px-5 py-12 @3xl:grid-cols-[1fr_1.2fr] @4xl:px-10">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em]" style={{ color: TERRA }}>Tentang kami</p>
          <h4 className="mt-2 font-serif text-[32px] leading-tight">Pemasok kemasan kosmetik nasional.</h4>
          <p className="mt-3 text-[13.5px] leading-relaxed text-black/60">PT Anugrah Lumei Raya memasok botol kaca, botol PET, jar, dekoratif, pump, tutup, dan banyak lagi untuk brand kecantikan di Indonesia.</p>
        </div>
        <ol className="relative space-y-6 border-l border-black/15 pl-6">
          {[["2002", "Mulai bergerak di industri kemasan kosmetik."], ["2011", "PT Anugrah Lumei Raya resmi berdiri."], ["Hari ini", "Melayani brand lokal dari skala rintisan sampai nasional."]].map(([y, t]) => (
            <li key={y} className="relative">
              <span className="absolute -left-[31px] top-1.5 size-3 rounded-full border-2 border-[#fbf6f1]" style={{ background: TERRA }} />
              <p className="font-serif text-[26px] leading-none">{y}</p>
              <p className="mt-1 text-[13px] text-black/60">{t}</p>
            </li>
          ))}
        </ol>
      </section>

      <section data-anchor="klien" className="px-5 pb-12 @4xl:px-10">
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.24em] text-black/45">Dipercaya oleh</p>
        <div className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-black/10 @2xl:grid-cols-4">
          {CLIENTS.map((n, i) => (
            <div key={n} className={cn("grid h-16 place-items-center bg-white text-[15px] text-black/55", i % 3 === 0 ? "font-serif text-[19px] italic" : i % 3 === 1 ? "font-bold uppercase tracking-[0.18em] text-[12px]" : "font-semibold")}>
              {n}
            </div>
          ))}
        </div>
      </section>

      <footer className="flex flex-wrap items-center justify-between gap-2 px-5 py-6 text-[12px] text-white/60 @4xl:px-10" style={{ background: INK }}>
        <span className="font-serif text-[20px] text-white">Lumei<span style={{ color: TERRA }}>.</span></span>
        <span>© 2019 PT Anugrah Lumei Raya</span>
      </footer>
      <style>{`@keyframes lm-in{from{opacity:.3;transform:scale(1.04)}to{opacity:1;transform:none}}`}</style>
    </DemoRoot>
  );
}

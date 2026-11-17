"use client";

import Image from "next/image";
import {
  ArrowRight,
  Award,
  CalendarCheck,
  Car,
  Check,
  Clock,
  Lightbulb,
  MessageCircle,
  Music,
  Sofa,
  Speaker,
  Sparkles,
  Tv,
  VolumeX,
  Wrench,
} from "lucide-react";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { DemoRoot, useDemoScroll, useToast } from "./kit";

const AMBER = "#f2b632";

const SERVICES = [
  { id: "audio", label: "Audio Mobil", icon: Music, img: "audio", title: "Suara yang jernih di setiap kursi.", items: ["Speaker dan tweeter komponen", "Subwoofer dan box custom", "Processor dan tuning DSP", "Amplifier dan instalasi kabel"] },
  { id: "interior", label: "Aksesori & Interior", icon: Sofa, img: "interior", title: "Kabin yang terasa lebih premium.", items: ["Jok kulit dan pola quilted", "Ambient light dashboard dan pintu", "Head unit Android dan kamera", "Peredam kabin"] },
  { id: "lighting", label: "Electrical & Lighting", icon: Lightbulb, img: "lighting", title: "Terang, rapi, dan aman.", items: ["Retrofit lampu projector", "Lampu LED dan DRL", "Kelistrikan dan aksesori 12V", "Pengecekan aki dan sistem pengisian"] },
] as const;

const CARS = ["City car", "Sedan", "MPV", "SUV"] as const;
const NEEDS = [
  { id: "speaker", label: "Speaker & tweeter", icon: Speaker, hours: 3 },
  { id: "sub", label: "Subwoofer & box", icon: Music, hours: 4 },
  { id: "hu", label: "Head unit Android", icon: Tv, hours: 2 },
  { id: "peredam", label: "Peredam kabin", icon: VolumeX, hours: 6 },
  { id: "ambient", label: "Ambient light", icon: Sparkles, hours: 3 },
  { id: "led", label: "Lampu projector", icon: Lightbulb, hours: 4 },
] as const;

const DAYS = ["Sen 24", "Sel 25", "Rab 26", "Kam 27", "Jum 28", "Sab 29"];
const SLOTS = ["09.00", "13.00", "16.00"];

export default function LinggarAudio() {
  const [svc, setSvc] = useState<(typeof SERVICES)[number]["id"]>("audio");
  const [car, setCar] = useState<(typeof CARS)[number]>("SUV");
  const [needs, setNeeds] = useState<string[]>(["speaker", "ambient"]);
  const [day, setDay] = useState<string | null>(null);
  const [slot, setSlot] = useState<string | null>(null);
  const { ref, toId } = useDemoScroll();
  const toast = useToast();
  const s = SERVICES.find((x) => x.id === svc)!;
  const hours = useMemo(() => {
    const base = NEEDS.filter((n) => needs.includes(n.id)).reduce((h, n) => h + n.hours, 0);
    return Math.round(base * (car === "SUV" || car === "MPV" ? 1.2 : 1));
  }, [needs, car]);

  return (
    <DemoRoot scrollRef={ref} className="bg-[#111] text-white" overlay={toast.node}>
      <header className="sticky top-0 z-20 flex items-center gap-6 border-b border-white/5 bg-[#111]/85 px-5 py-3 backdrop-blur @4xl:px-10">
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-gradient-to-b from-[#c62828] to-[#7f1414] px-2 py-1 text-[13px] font-black italic tracking-tight ring-1 ring-white/20">LINGGAR</span>
          <span className="text-[10px] font-semibold uppercase leading-tight tracking-wider text-white/60">Audio &amp;<br />Variasi</span>
        </div>
        <nav className="ml-auto hidden gap-6 text-[13px] text-white/70 @3xl:flex">
          <button type="button" onClick={() => toId("layanan")}>Layanan</button>
          <button type="button" onClick={() => toId("paket")}>Rakit Paket</button>
          <button type="button" onClick={() => toId("galeri")}>Galeri</button>
        </nav>
        <button type="button" onClick={() => toId("paket")} className="ml-auto inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[12.5px] font-bold text-black @3xl:ml-0" style={{ background: AMBER }}>
          <MessageCircle className="size-4" /> Konsultasi
        </button>
      </header>

      <section className="relative">
        <Image src="/work/linggar-audio/ph-hero.webp" alt="" fill sizes="1100px" className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/75 to-black/10" />
        <div className="relative px-5 py-16 @4xl:px-10 @4xl:py-24">
          <p className="text-[11px] font-bold uppercase tracking-[0.25em]" style={{ color: AMBER }}>Car audio • Aksesori • Electrical</p>
          <h3 className="mt-3 text-[36px] font-extrabold leading-[1.02] tracking-tight @4xl:text-[52px]">
            Upgrade mobil.<br /><span style={{ color: AMBER }}>Upgrade pengalaman.</span>
          </h3>
          <p className="mt-4 max-w-sm text-[14px] leading-relaxed text-white/70">Audio jernih, tampilan berkelas, dan instalasi yang rapi untuk mobil kesayangan Anda.</p>
          <div className="mt-6 flex flex-wrap gap-2">
            <button type="button" onClick={() => toId("paket")} className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-[13px] font-bold text-black" style={{ background: AMBER }}>
              Rakit paket upgrade <ArrowRight className="size-4" />
            </button>
            <button type="button" onClick={() => toId("galeri")} className="rounded-lg border border-white/25 px-5 py-2.5 text-[13px] font-semibold">Lihat hasil pemasangan</button>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-3 divide-x divide-white/10 border-y border-white/10 bg-[#161616] text-[11.5px] font-semibold @3xl:text-[12.5px]">
        {[[Wrench, "Instalasi rapi"], [Award, "Produk berkualitas"], [MessageCircle, "Konsultasi personal"]].map(([I, l]) => {
          const Icon = I as typeof Wrench;
          return <div key={l as string} className="flex items-center justify-center gap-2 py-3.5"><Icon className="size-4" style={{ color: AMBER }} />{l as string}</div>;
        })}
      </div>

      <section data-anchor="layanan" className="bg-[#efebe3] px-5 py-12 text-[#151515] @4xl:px-10">
        <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#a87908]">Layanan kami</p>
        <h4 className="mt-1 text-[28px] font-extrabold tracking-tight">Detail kecil. Perbedaan besar.</h4>
        <div className="mt-5 flex flex-wrap gap-2">
          {SERVICES.map((x) => (
            <button
              key={x.id}
              type="button"
              data-shot={x.id === "interior" ? "1" : undefined}
              onClick={() => setSvc(x.id)}
              className={cn("inline-flex items-center gap-2 rounded-full px-4 py-2 text-[12.5px] font-bold transition", svc === x.id ? "bg-[#151515] text-white" : "bg-white text-black/60 hover:text-black")}
            >
              <x.icon className="size-4" style={svc === x.id ? { color: AMBER } : undefined} />
              {x.label}
            </button>
          ))}
        </div>
        <div className="mt-5 grid overflow-hidden rounded-2xl bg-white @3xl:grid-cols-[1.2fr_1fr]">
          <div className="relative aspect-[16/10] @3xl:aspect-auto">
            <Image key={s.img} src={`/work/linggar-audio/ph-${s.img}.webp`} alt="" fill sizes="560px" className="animate-[lg-fade_0.5s_ease-out] object-cover" />
          </div>
          <div className="p-6">
            <h5 className="text-[20px] font-extrabold leading-tight">{s.title}</h5>
            <ul className="mt-4 space-y-2.5">
              {s.items.map((it) => (
                <li key={it} className="flex items-center gap-3 text-[13.5px]"><span className="grid size-6 place-items-center rounded-full" style={{ background: "#fdf1d3" }}><Check className="size-3.5 text-[#a87908]" /></span>{it}</li>
              ))}
            </ul>
            <button type="button" onClick={() => toId("paket")} className="mt-6 inline-flex items-center gap-1.5 text-[13px] font-bold text-[#a87908]">Masukkan ke paket <ArrowRight className="size-4" /></button>
          </div>
        </div>
      </section>

      <section data-anchor="paket" className="px-5 py-12 @4xl:px-10">
        <p className="text-[11px] font-bold uppercase tracking-[0.25em]" style={{ color: AMBER }}>Rakit paket</p>
        <h4 className="mt-1 text-[28px] font-extrabold tracking-tight">Sesuaikan dengan mobil Anda.</h4>
        <div className="mt-6 grid gap-5 @3xl:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="text-[12px] font-semibold text-white/55">1. Jenis mobil</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {CARS.map((c) => (
                <button key={c} type="button" onClick={() => setCar(c)} className={cn("inline-flex items-center gap-2 rounded-lg border px-3.5 py-2 text-[12.5px] font-semibold", car === c ? "border-transparent text-black" : "border-white/15 text-white/75")} style={car === c ? { background: AMBER } : undefined}>
                  <Car className="size-4" />{c}
                </button>
              ))}
            </div>
            <p className="mt-5 text-[12px] font-semibold text-white/55">2. Kebutuhan upgrade</p>
            <div className="mt-2 grid grid-cols-2 gap-2 @2xl:grid-cols-3">
              {NEEDS.map((n) => {
                const on = needs.includes(n.id);
                return (
                  <button
                    key={n.id}
                    type="button"
                    data-shot={n.id === "sub" ? "2" : undefined}
                    onClick={() => setNeeds((x) => (on ? x.filter((y) => y !== n.id) : [...x, n.id]))}
                    className={cn("relative rounded-xl border p-3 text-left transition", on ? "border-[#f2b632] bg-[#f2b632]/10" : "border-white/10 bg-white/[0.03] hover:border-white/25")}
                  >
                    <n.icon className="size-5" style={{ color: on ? AMBER : "rgba(255,255,255,.55)" }} />
                    <p className="mt-2 text-[12.5px] font-semibold">{n.label}</p>
                    {on ? <Check className="absolute right-2.5 top-2.5 size-4" style={{ color: AMBER }} /> : null}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="rounded-2xl bg-[#1b1b1b] p-5 ring-1 ring-white/10">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/45">Ringkasan</p>
            <p className="mt-2 text-[18px] font-extrabold">{car} · {needs.length} item</p>
            <ul className="mt-3 space-y-1.5 text-[12.5px] text-white/70">
              {NEEDS.filter((n) => needs.includes(n.id)).map((n) => <li key={n.id} className="flex items-center gap-2"><Check className="size-3.5" style={{ color: AMBER }} />{n.label}</li>)}
              {needs.length === 0 ? <li>Pilih minimal satu kebutuhan.</li> : null}
            </ul>
            <p className="mt-4 flex items-center gap-2 text-[12.5px] text-white/60"><Clock className="size-4" /> Estimasi pengerjaan ± {hours} jam</p>
            <p className="mt-4 text-[12px] font-semibold text-white/55">3. Jadwal konsultasi</p>
            <div className="scrollbar-none mt-2 flex gap-1.5 overflow-x-auto">
              {DAYS.map((d) => (
                <button key={d} type="button" onClick={() => setDay(d)} className={cn("shrink-0 rounded-lg px-2.5 py-1.5 text-[11.5px] font-semibold", day === d ? "text-black" : "bg-white/5 text-white/70")} style={day === d ? { background: AMBER } : undefined}>{d}</button>
              ))}
            </div>
            <div className="mt-1.5 flex gap-1.5">
              {SLOTS.map((t) => (
                <button key={t} type="button" disabled={!day} onClick={() => setSlot(t)} className={cn("flex-1 rounded-lg py-1.5 text-[11.5px] font-semibold disabled:opacity-30", slot === t ? "text-black" : "bg-white/5 text-white/70")} style={slot === t ? { background: AMBER } : undefined}>{t}</button>
              ))}
            </div>
            <button
              type="button"
              disabled={!needs.length || !day || !slot}
              onClick={() => {
                toast.show(`Konsultasi ${day} pukul ${slot} terjadwal`);
                setDay(null);
                setSlot(null);
              }}
              className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg text-[13px] font-bold text-black disabled:opacity-40"
              style={{ background: AMBER }}
            >
              <CalendarCheck className="size-4" /> Pesan jadwal
            </button>
          </div>
        </div>
      </section>

      <section data-anchor="galeri" className="border-t border-white/5 px-5 py-12 @4xl:px-10">
        <p className="text-[11px] font-bold uppercase tracking-[0.25em]" style={{ color: AMBER }}>Hasil pemasangan</p>
        <h4 className="mt-1 text-[28px] font-extrabold tracking-tight">Dikerjakan dengan presisi.</h4>
        <div className="mt-5 grid gap-3 @2xl:grid-cols-2">
          {[["trunk", "Upgrade sistem audio bagasi"], ["interior", "Pemasangan head unit & ambient light"]].map(([img, cap]) => (
            <figure key={img} className="group relative aspect-[16/10] overflow-hidden rounded-2xl">
              <Image src={`/work/linggar-audio/ph-${img}.webp`} alt="" fill sizes="520px" className="object-cover transition duration-700 group-hover:scale-105" />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-4 pt-10 text-[13px] font-semibold">{cap}</figcaption>
            </figure>
          ))}
        </div>
        <ol className="mt-8 grid gap-3 @2xl:grid-cols-4">
          {["Konsultasi kebutuhan", "Rekomendasi produk", "Pemasangan rapi", "Uji & serah terima"].map((t, i) => (
            <li key={t} className="rounded-xl bg-white/[0.04] p-4 ring-1 ring-white/10">
              <span className="text-[22px] font-black" style={{ color: AMBER }}>0{i + 1}</span>
              <p className="mt-1 text-[13px] font-semibold">{t}</p>
            </li>
          ))}
        </ol>
      </section>

      <div className="flex flex-wrap items-center gap-4 px-5 py-8 text-black @4xl:px-10" style={{ background: AMBER }}>
        <div>
          <p className="text-[22px] font-extrabold leading-tight">Siap upgrade mobil Anda?</p>
          <p className="text-[12.5px] text-black/70">Konsultasikan kebutuhan audio, aksesori, dan kelistrikan mobil Anda.</p>
        </div>
        <button type="button" onClick={() => toId("paket")} className="ml-auto inline-flex items-center gap-2 rounded-lg bg-[#151515] px-5 py-2.5 text-[13px] font-bold text-white"><MessageCircle className="size-4" />Konsultasi sekarang</button>
      </div>
      <footer className="px-5 py-6 text-[12px] text-white/45 @4xl:px-10">Linggar Audio &amp; Variasi · Spesialis audio, aksesori, dan variasi mobil</footer>
      <style>{`@keyframes lg-fade{from{opacity:.2;transform:scale(1.03)}to{opacity:1;transform:none}}`}</style>
    </DemoRoot>
  );
}

"use client";

import Image from "next/image";
import {
  ArrowRight,
  BarChart3,
  Briefcase,
  CalendarDays,
  HeartHandshake,
  Mail,
  MapPin,
  Mountain,
  Store,
  Users,
  Workflow,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { DemoRoot, useDemoScroll, useToast } from "./kit";

const OR = "#f2811d";
const INK = "#1f2329";

const PRODUCTS = [
  { id: "sales", icon: BarChart3, title: "Sales & Marketing", text: "Strategi penjualan, negosiasi, dan pengelolaan pelanggan untuk tim yang mengejar target." },
  { id: "hcd", icon: Users, title: "Human Capital Development", text: "Kepemimpinan, coaching, dan pengembangan talenta dari staf sampai manajer." },
  { id: "service", icon: HeartHandshake, title: "Service Excellence", text: "Standar layanan, komunikasi dengan pelanggan, dan penanganan keluhan." },
  { id: "bpd", icon: Workflow, title: "Business Process Development", text: "Memetakan, menyederhanakan, dan mengukur proses bisnis inti." },
  { id: "tb", icon: Mountain, title: "Team Building & Outbound", text: "Aktivitas lapangan yang membangun kepercayaan dan kerja sama tim.", img: "outbound" },
  { id: "umkm", icon: Store, title: "Program UMKM & Persiapan Pensiun", text: "Bekal usaha untuk pelaku UMKM dan karyawan yang bersiap pensiun." },
] as const;

const METHODS = {
  training: {
    label: "Training methodology",
    steps: [
      ["Analisis kebutuhan", "Wawancara dan survei singkat untuk memetakan kesenjangan kompetensi."],
      ["Desain program", "Materi, studi kasus, dan simulasi disesuaikan dengan industri peserta."],
      ["Delivery", "Kelas interaktif dengan banyak praktik: diskusi, studi kasus, dan role play."],
      ["Evaluasi & follow up", "Pre-test, post-test, dan rencana aksi yang dipantau setelah kelas."],
    ],
  },
  consulting: {
    label: "Consultancy methodology",
    steps: [
      ["Diagnosis", "Membaca data dan proses yang berjalan bersama tim klien."],
      ["Rekomendasi", "Prioritas perbaikan yang realistis dan terukur."],
      ["Implementasi", "Pendampingan langsung sampai perubahan berjalan."],
      ["Review", "Mengukur hasil dan menyesuaikan langkah berikutnya."],
    ],
  },
} as const;

const SESSIONS = [
  ["Effective Selling Skills", "2 hari", "Jakarta"],
  ["Leadership for New Managers", "2 hari", "Jakarta"],
  ["Service Excellence", "1 hari", "Online"],
  ["Persiapan Pensiun & Wirausaha", "2 hari", "Bandung"],
];

export default function CodeLearn() {
  const [prod, setProd] = useState<string>("sales");
  const [method, setMethod] = useState<keyof typeof METHODS>("training");
  const [step, setStep] = useState(0);
  const [joined, setJoined] = useState<string[]>([]);
  const { ref, toId } = useDemoScroll();
  const toast = useToast();
  const p = PRODUCTS.find((x) => x.id === prod)!;
  const m = METHODS[method];

  return (
    <DemoRoot scrollRef={ref} className="bg-white text-[#1f2329]" overlay={toast.node}>
      <header className="sticky top-0 z-20 flex items-center gap-6 bg-white/90 px-5 py-3 shadow-[0_1px_0_rgba(0,0,0,.06)] backdrop-blur @4xl:px-10">
        <div className="flex items-center leading-none">
          <span className="text-[19px] font-extrabold tracking-tight">Co</span>
          <span className="ml-0.5 rounded-md px-1.5 py-0.5 text-[19px] font-extrabold tracking-tight text-white" style={{ background: OR }}>De:learn</span>
        </div>
        <nav className="ml-auto hidden gap-6 text-[13px] text-black/60 @3xl:flex">
          <button type="button" onClick={() => toId("produk")}>Produk</button>
          <button type="button" onClick={() => toId("metode")}>Metodologi</button>
          <button type="button" onClick={() => toId("kontak")}>Kontak</button>
        </nav>
        <button type="button" onClick={() => toId("public")} className="ml-auto rounded-full border-2 px-4 py-1.5 text-[12px] font-bold @3xl:ml-0" style={{ borderColor: INK }}>Public Training</button>
      </header>

      <section className="relative">
        <Image src="/work/codelearn/ph-hero.webp" alt="" fill sizes="1100px" className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1f2329]/95 via-[#1f2329]/70 to-transparent" />
        <div className="relative px-5 py-16 text-white @4xl:px-10 @4xl:py-24">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em]" style={{ color: OR }}>Konsultan & penyedia pelatihan</p>
          <h3 className="mt-3 max-w-lg text-[38px] font-extrabold leading-[1.02] tracking-tight @4xl:text-[52px]">Consultant &amp; Training Expert</h3>
          <p className="mt-4 max-w-md text-[14px] leading-relaxed text-white/75">Mengembangkan orang dan proses bisnis lewat pelatihan yang praktis dan konsultasi yang terukur.</p>
          <button type="button" onClick={() => toId("produk")} className="mt-6 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-bold text-white" style={{ background: OR }}>
            Lihat produk kami <ArrowRight className="size-4" />
          </button>
        </div>
      </section>

      <section className="grid gap-6 px-5 py-10 @3xl:grid-cols-[1.4fr_1fr] @3xl:items-center @4xl:px-10">
        <div>
          <h4 className="text-[26px] font-extrabold tracking-tight">Who are <span style={{ color: OR }}>we</span></h4>
          <p className="mt-3 text-[13.5px] leading-relaxed text-black/60">CoDe:learn bergerak di bidang konsultasi dan pelatihan untuk perusahaan, dari perbankan dan jasa keuangan sampai manufaktur, bersama jaringan konsultan dan trainer profesional.</p>
        </div>
        <div className="rounded-2xl p-6 text-white" style={{ background: INK }}>
          <p className="text-[44px] font-extrabold leading-none" style={{ color: OR }}>30+</p>
          <p className="mt-2 text-[13px] text-white/75">partner executive konsultan dan trainer profesional</p>
        </div>
      </section>

      <section data-anchor="produk" className="bg-[#f6f6f4] px-5 py-12 @4xl:px-10">
        <h4 className="text-[26px] font-extrabold tracking-tight"><span style={{ color: OR }}>Our</span> products</h4>
        <div className="mt-5 grid items-start gap-5 @3xl:grid-cols-[1fr_1fr]">
          <div className="grid grid-cols-2 gap-2 @4xl:grid-cols-3">
            {PRODUCTS.map((x) => (
              <button
                key={x.id}
                type="button"
                data-shot={x.id === "tb" ? "1" : undefined}
                onClick={() => setProd(x.id)}
                className={cn("flex flex-col items-start gap-2 rounded-xl border bg-white p-3.5 text-left transition", prod === x.id ? "border-transparent shadow-lg ring-2 ring-[#f2811d]" : "border-black/5 hover:border-black/20")}
              >
                <x.icon className="size-5" style={{ color: prod === x.id ? OR : "#9aa0a6" }} />
                <span className="text-[12.5px] font-bold leading-tight">{x.title}</span>
              </button>
            ))}
          </div>
          <div className="overflow-hidden rounded-2xl bg-white">
            {"img" in p ? (
              <div className="relative aspect-[16/9]"><Image src={`/work/codelearn/ph-${p.img}.webp`} alt="" fill sizes="480px" className="object-cover" /></div>
            ) : (
              <div className="flex aspect-[16/9] items-center justify-center" style={{ background: `linear-gradient(135deg, ${OR}, #f7b267)` }}>
                <p.icon className="size-16 text-white/90" strokeWidth={1.2} />
              </div>
            )}
            <div className="p-5">
              <p className="text-[18px] font-extrabold">{p.title}</p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-black/60">{p.text}</p>
              <p className="mt-3 flex items-center gap-2 text-[12px] text-black/50"><Briefcase className="size-4" /> In-house atau public training</p>
            </div>
          </div>
        </div>
      </section>

      <section data-anchor="metode" className="px-5 py-12 @4xl:px-10">
        <h4 className="text-[26px] font-extrabold tracking-tight"><span style={{ color: OR }}>Our</span> methodology</h4>
        <div className="mt-5 inline-flex rounded-full bg-[#f6f6f4] p-1">
          {(Object.keys(METHODS) as (keyof typeof METHODS)[]).map((k) => (
            <button
              key={k}
              type="button"
              data-shot={k === "consulting" ? "2" : undefined}
              onClick={() => { setMethod(k); setStep(0); }}
              className={cn("rounded-full px-4 py-2 text-[12.5px] font-bold", method === k ? "text-white" : "text-black/55")}
              style={method === k ? { background: OR } : undefined}
            >
              {METHODS[k].label}
            </button>
          ))}
        </div>
        <ol className="mt-6 grid gap-2 @3xl:grid-cols-4">
          {m.steps.map(([t], i) => (
            <li key={t}>
              <button type="button" onClick={() => setStep(i)} className={cn("relative w-full rounded-xl border p-4 text-left transition", step === i ? "border-transparent text-white" : "border-black/10 hover:border-black/25")} style={step === i ? { background: INK } : undefined}>
                <span className="text-[24px] font-extrabold" style={{ color: OR }}>{i + 1}</span>
                <span className="mt-1 block text-[13px] font-bold">{t}</span>
                {i < m.steps.length - 1 ? <ArrowRight className="absolute right-3 top-4 hidden size-4 text-black/25 @3xl:block" /> : null}
              </button>
            </li>
          ))}
        </ol>
        <p className="mt-3 rounded-xl bg-[#fff4ea] px-4 py-3 text-[13px] leading-relaxed">{m.steps[step][1]}</p>
      </section>

      <section data-anchor="public" className="bg-[#f6f6f4] px-5 py-12 @4xl:px-10">
        <h4 className="text-[26px] font-extrabold tracking-tight">Public training</h4>
        <ul className="mt-5 divide-y divide-black/5 overflow-hidden rounded-2xl bg-white">
          {SESSIONS.map(([t, d, place], i) => {
            const on = joined.includes(t);
            return (
              <li key={t} className="flex flex-wrap items-center gap-3 px-4 py-3.5">
                <span className="grid size-10 shrink-0 place-items-center rounded-lg text-[12px] font-extrabold text-white" style={{ background: i % 2 ? INK : OR }}>B{i + 1}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-[13.5px] font-bold">{t}</p>
                  <p className="flex items-center gap-3 text-[11.5px] text-black/50"><span className="flex items-center gap-1"><CalendarDays className="size-3.5" />{d}</span><span className="flex items-center gap-1"><MapPin className="size-3.5" />{place}</span></p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setJoined((j) => (on ? j.filter((x) => x !== t) : [...j, t]));
                    if (!on) toast.show(`Terdaftar: ${t}`);
                  }}
                  className={cn("rounded-full px-4 py-1.5 text-[12px] font-bold", on ? "bg-emerald-50 text-emerald-700" : "text-white")}
                  style={on ? undefined : { background: OR }}
                >
                  {on ? "Terdaftar ✓" : "Daftar"}
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <footer data-anchor="kontak" className="grid gap-6 px-5 py-10 text-white @3xl:grid-cols-2 @4xl:px-10" style={{ background: INK }}>
        <div>
          <p className="text-[22px] font-extrabold">Get in touch <span style={{ color: OR }}>with us</span></p>
          <p className="mt-2 flex items-center gap-2 text-[13px] text-white/65"><Mail className="size-4" /> Ceritakan kebutuhan pelatihan tim Anda.</p>
        </div>
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            toast.show("Pesan terkirim, terima kasih");
            (e.currentTarget as HTMLFormElement).reset();
          }}
        >
          <input required type="email" placeholder="Email Anda" className="h-10 min-w-0 flex-1 rounded-lg bg-white/10 px-3 text-[13px] text-white placeholder:text-white/40 outline-none focus:bg-white/15" />
          <button className="rounded-lg px-4 text-[12.5px] font-bold" style={{ background: OR }}>Kirim</button>
        </form>
      </footer>
    </DemoRoot>
  );
}

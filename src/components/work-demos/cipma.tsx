"use client";

import Image from "next/image";
import { ArrowRight, BadgeCheck, Building2, CalendarDays, Check, Layers, Target, Users, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { DemoModal, DemoRoot, useDemoScroll, useToast } from "./kit";

const GREEN = "#145c3a";
const ORANGE = "#f07a1a";
const SERIF = "[font-family:Georgia,'Times_New_Roman',serif] font-bold";

type Program = {
  id: string;
  title: string;
  cat: "Kewirausahaan" | "Trainer" | "SDM";
  img: string;
  text: string;
  badge?: string;
  outcomes: string[];
  audience: string;
  days: { individu: string; inhouse: string };
};

const PROGRAMS: Program[] = [
  {
    id: "kwu",
    title: "Pendamping Kewirausahaan",
    cat: "Kewirausahaan",
    img: "entrepreneur",
    badge: "Persiapan Sertifikasi BNSP",
    text: "Pelatihan dan pendampingan untuk memperkuat kompetensi kewirausahaan dan pengembangan usaha.",
    outcomes: ["Memetakan kebutuhan usaha binaan", "Menyusun rencana pendampingan", "Siap mengikuti uji kompetensi"],
    audience: "Pendamping UMKM, konsultan usaha, pengelola inkubator",
  },
  {
    id: "tot",
    title: "Training of Trainer",
    cat: "Trainer",
    img: "tot",
    text: "Program untuk meningkatkan kompetensi sebagai trainer yang efektif dan profesional.",
    outcomes: ["Merancang sesi pelatihan", "Teknik fasilitasi dan presentasi", "Evaluasi hasil belajar peserta"],
    audience: "Calon trainer, tim learning & development, fasilitator internal",
  },
  {
    id: "sdm",
    title: "Pengembangan Kompetensi SDM",
    cat: "SDM",
    img: "hr",
    text: "Pelatihan peningkatan kompetensi untuk individu dan tim agar lebih produktif, adaptif, dan berdaya saing.",
    outcomes: ["Pemetaan kompetensi tim", "Program pelatihan sesuai jabatan", "Rencana pengembangan individu"],
    audience: "Tim HR, manajer, dan organisasi",
  },
].map((p) => ({ ...p, days: { individu: "Kelas terjadwal", inhouse: "Jadwal dan materi menyesuaikan organisasi" } })) as Program[];

const CATS = ["Semua", "Kewirausahaan", "Trainer", "SDM"] as const;

export default function Cipma() {
  const [cat, setCat] = useState<(typeof CATS)[number]>("Semua");
  const [open, setOpen] = useState<Program | null>(null);
  const [mode, setMode] = useState<"individu" | "inhouse">("individu");
  const [step, setStep] = useState<"info" | "form">("info");
  const { ref, toId } = useDemoScroll();
  const toast = useToast();
  const list = cat === "Semua" ? PROGRAMS : PROGRAMS.filter((p) => p.cat === cat);
  const close = () => {
    setOpen(null);
    setStep("info");
  };

  return (
    <DemoRoot
      scrollRef={ref}
      className="bg-[#fbfaf6] text-[#16231c]"
      overlay={
        <>
          {toast.node}
          <DemoModal open={!!open} onClose={close} label={open?.title ?? "Program"} className="max-w-lg">
            {open ? (
              <div>
                <div className="relative aspect-[16/7]">
                  <Image src={`/work/cipma/ph-${open.img}.webp`} alt="" fill sizes="520px" className="object-cover" />
                  <button type="button" aria-label="Tutup" onClick={close} className="absolute right-3 top-3 grid size-8 place-items-center rounded-full bg-white/90"><X className="size-4" /></button>
                </div>
                <div className="p-6">
                  <h4 className={cn(SERIF, "text-[24px] leading-tight")} style={{ color: GREEN }}>{open.title}</h4>
                  {step === "info" ? (
                    <>
                      <div className="mt-3 inline-flex rounded-full bg-black/5 p-1 text-[12px] font-semibold">
                        {(["individu", "inhouse"] as const).map((m) => (
                          <button key={m} type="button" onClick={() => setMode(m)} className={cn("rounded-full px-3 py-1", mode === m && "bg-white shadow-sm")}>
                            {m === "individu" ? "Kelas individu" : "In-house"}
                          </button>
                        ))}
                      </div>
                      <dl className="mt-4 grid gap-2 text-[12.5px]">
                        <div className="flex gap-2"><CalendarDays className="size-4 shrink-0" style={{ color: ORANGE }} /><dd>{open.days[mode]}</dd></div>
                        <div className="flex gap-2"><Users className="size-4 shrink-0" style={{ color: ORANGE }} /><dd>{open.audience}</dd></div>
                      </dl>
                      <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-black/45">Yang akan dikuasai</p>
                      <ul className="mt-2 space-y-1.5">
                        {open.outcomes.map((o) => <li key={o} className="flex gap-2 text-[13px]"><Check className="mt-0.5 size-4 shrink-0" style={{ color: GREEN }} />{o}</li>)}
                      </ul>
                      <button type="button" onClick={() => setStep("form")} className="mt-5 h-11 w-full rounded-lg text-[13px] font-semibold text-white" style={{ background: GREEN }}>
                        {mode === "individu" ? "Daftar kelas" : "Ajukan in-house"}
                      </button>
                    </>
                  ) : (
                    <form
                      className="mt-4 space-y-3"
                      onSubmit={(e) => {
                        e.preventDefault();
                        close();
                        toast.show("Pendaftaran terkirim, cek email Anda");
                      }}
                    >
                      <input required placeholder="Nama lengkap" className="h-10 w-full rounded-lg border border-black/15 px-3 text-[13px] outline-none focus:border-[#145c3a]" />
                      <input required type="email" placeholder="Email" className="h-10 w-full rounded-lg border border-black/15 px-3 text-[13px] outline-none focus:border-[#145c3a]" />
                      {mode === "inhouse" ? <input placeholder="Nama organisasi dan jumlah peserta" className="h-10 w-full rounded-lg border border-black/15 px-3 text-[13px] outline-none focus:border-[#145c3a]" /> : null}
                      <button className="h-11 w-full rounded-lg text-[13px] font-semibold text-white" style={{ background: ORANGE }}>Kirim pendaftaran</button>
                      <button type="button" onClick={() => setStep("info")} className="w-full text-[12px] text-black/50">Kembali</button>
                    </form>
                  )}
                </div>
              </div>
            ) : null}
          </DemoModal>
        </>
      }
    >
      <header className="sticky top-0 z-20 flex items-center gap-6 bg-[#fbfaf6]/90 px-5 py-3 backdrop-blur @4xl:px-10">
        <div className="flex items-center gap-2">
          <span className="grid size-9 place-items-center rounded-full text-white" style={{ background: ORANGE }}><BadgeCheck className="size-5" /></span>
          <span className="leading-none">
            <span className={cn(SERIF, "block text-[21px]")} style={{ color: GREEN }}>CiPMa</span>
            <span className="text-[9.5px] italic" style={{ color: ORANGE }}>Training &amp; Consulting</span>
          </span>
        </div>
        <nav className="ml-auto hidden gap-6 text-[13px] text-black/70 @3xl:flex">
          <button type="button" onClick={() => toId("program")}>Program Pelatihan</button>
          <button type="button" onClick={() => { setCat("Kewirausahaan"); toId("program"); }}>Sertifikasi</button>
          <button type="button" onClick={() => toId("tentang")}>Tentang Kami</button>
        </nav>
        <button type="button" onClick={() => { setMode("inhouse"); setOpen(PROGRAMS[2]); }} className="ml-auto rounded-lg px-4 py-2 text-[12.5px] font-semibold text-white @3xl:ml-0" style={{ background: ORANGE }}>Konsultasi</button>
      </header>

      <section className="grid gap-8 px-5 pb-8 pt-6 @3xl:grid-cols-[1fr_1.05fr] @3xl:items-center @4xl:px-10">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em]">Training • Consulting • Certification</p>
          <h3 className={cn(SERIF, "mt-3 text-[36px] leading-[1.05] @4xl:text-[46px]")}>
            Tingkatkan Kompetensi.<br /><span style={{ color: GREEN }}>Wujudkan Potensi.</span>
          </h3>
          <p className="mt-4 max-w-md text-[14px] leading-relaxed text-black/65">Pelatihan berbasis kompetensi untuk profesional, wirausaha, dan organisasi.</p>
          <div className="mt-6 flex flex-wrap gap-2">
            <button type="button" data-shot="1" onClick={() => toId("program")} className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-[13px] font-semibold text-white" style={{ background: GREEN }}>
              Jelajahi Program <ArrowRight className="size-4" />
            </button>
            <button type="button" onClick={() => { setMode("inhouse"); setOpen(PROGRAMS[2]); }} className="rounded-lg border-2 px-5 py-2 text-[13px] font-semibold" style={{ borderColor: GREEN, color: GREEN }}>Konsultasi Pelatihan</button>
          </div>
        </div>
        <div className="relative">
          <div className="relative aspect-[5/4] overflow-hidden rounded-[40%_40%_40%_8%/50%_40%_50%_8%] border-[6px]" style={{ borderColor: "#7cb342" }}>
            <Image src="/work/cipma/ph-hero.webp" alt="" fill sizes="520px" className="object-cover" priority />
          </div>
          <div className="absolute -bottom-3 right-2 flex items-center gap-2 rounded-xl bg-white px-4 py-3 shadow-xl">
            <Target className="size-6" style={{ color: GREEN }} />
            <span className="text-[12.5px] font-semibold leading-tight">Pembelajaran<br />praktis &amp; terarah</span>
          </div>
        </div>
      </section>

      <div className="mx-5 grid gap-3 rounded-2xl bg-[#eef3e6] p-4 @2xl:grid-cols-3 @4xl:mx-10">
        {[[Layers, "Berbasis Kompetensi"], [Users, "Trainer Berpengalaman"], [Building2, "Program untuk Organisasi"]].map(([I, l]) => {
          const Icon = I as typeof Layers;
          return (
            <div key={l as string} className="flex items-center gap-3 text-[13.5px] font-semibold">
              <Icon className="size-6" style={{ color: ORANGE }} /> {l as string}
            </div>
          );
        })}
      </div>

      <section data-anchor="program" className="px-5 py-10 @4xl:px-10">
        <h4 className={cn(SERIF, "text-center text-[26px]")}>Program Pilihan untuk Langkah Berikutnya</h4>
        <div className="mx-auto mt-2 h-1 w-14 rounded-full" style={{ background: ORANGE }} />
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {CATS.map((c) => (
            <button key={c} type="button" onClick={() => setCat(c)} className={cn("rounded-full border px-4 py-1.5 text-[12.5px] font-semibold", cat === c ? "border-transparent text-white" : "border-black/10 bg-white text-black/65")} style={cat === c ? { background: GREEN } : undefined}>
              {c}
            </button>
          ))}
        </div>
        <div className="mt-6 grid gap-4 @2xl:grid-cols-2 @4xl:grid-cols-3">
          {list.map((p, i) => (
            <article key={p.id} className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">
              <div className="relative aspect-[16/10]">
                <Image src={`/work/cipma/ph-${p.img}.webp`} alt="" fill sizes="340px" className="object-cover" />
                {p.badge ? <span className="absolute bottom-2 left-2 rounded-md px-2 py-1 text-[10.5px] font-semibold text-white" style={{ background: ORANGE }}>{p.badge}</span> : null}
              </div>
              <div className="p-4">
                <h5 className={cn(SERIF, "text-[19px] leading-tight")} style={{ color: GREEN }}>{p.title}</h5>
                <p className="mt-1.5 text-[12.5px] leading-relaxed text-black/60">{p.text}</p>
                <button type="button" data-shot={i === 0 ? "2" : undefined} onClick={() => { setMode("individu"); setOpen(p); }} className="mt-3 inline-flex items-center gap-2 rounded-lg border-2 px-3 py-1.5 text-[12px] font-semibold" style={{ borderColor: GREEN, color: GREEN }}>
                  Lihat Program <ArrowRight className="size-3.5" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section data-anchor="tentang" className="grid gap-6 px-5 pb-10 @3xl:grid-cols-2 @3xl:items-center @4xl:px-10">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[8%_40%_40%_8%/8%_50%_50%_8%]">
          <Image src="/work/cipma/ph-entrepreneur.webp" alt="" fill sizes="480px" className="object-cover" />
        </div>
        <div>
          <h4 className={cn(SERIF, "text-[28px] leading-tight")}>Belajar Lebih Relevan.<br />Berkembang Lebih Percaya Diri.</h4>
          <div className="my-4 h-1 w-14 rounded-full" style={{ background: ORANGE }} />
          <ul className="space-y-2.5">
            {["Materi yang aplikatif", "Pendampingan pembelajaran", "Pilihan kelas individu & in-house"].map((t) => (
              <li key={t} className="flex items-center gap-3 text-[14px]"><span className="grid size-6 place-items-center rounded-full text-white" style={{ background: GREEN }}><Check className="size-3.5" /></span>{t}</li>
            ))}
          </ul>
        </div>
      </section>

      <div className="mx-5 mb-8 flex flex-wrap items-center gap-4 rounded-2xl px-6 py-6 text-white @4xl:mx-10" style={{ background: GREEN }}>
        <p className={cn(SERIF, "text-[22px] leading-tight")}>Siap Mengembangkan<br />Kompetensi Tim Anda?</p>
        <button type="button" onClick={() => { setMode("inhouse"); setOpen(PROGRAMS[2]); }} className="ml-auto rounded-lg px-5 py-2.5 text-[13px] font-semibold" style={{ background: ORANGE }}>Diskusikan Kebutuhan Anda →</button>
      </div>
      <footer className="flex items-center justify-between border-t border-black/5 px-5 py-5 text-[12px] @4xl:px-10">
        <span className={cn(SERIF, "text-[16px]")} style={{ color: GREEN }}>CiPMa</span>
        <span className="italic" style={{ color: ORANGE }}>Your Certification Partner</span>
        <span className="text-black/50">www.cipma.id</span>
      </footer>
    </DemoRoot>
  );
}

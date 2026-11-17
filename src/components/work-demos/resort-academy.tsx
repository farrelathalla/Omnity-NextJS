"use client";

import Image from "next/image";
import {
  Award,
  BarChart3,
  BookOpen,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronLeft,
  ClipboardCheck,
  Clock,
  LayoutDashboard,
  Leaf,
  Lock,
  PlayCircle,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { DemoRoot, useDemoScroll, useToast } from "./kit";

const G = "#1f4a3a";
const GOLD = "#d8b46a";

type Mod = { id: number; title: string; text: string; img?: string; lessons: string[]; mins: number };
const MODULES: Mod[] = [
  { id: 1, title: "Kurikulum & Orientasi", text: "Mengenal alur pembelajaran, standar kompetensi, dan budaya layanan resort.", img: "orientation", lessons: ["Selamat datang di resort", "Standar kompetensi staf", "Budaya layanan kita", "Tur area dan fasilitas"], mins: 45 },
  { id: 2, title: "Service Excellence", text: "Sikap, komunikasi, dan kebiasaan pelayanan profesional di setiap titik temu dengan tamu.", img: "service", lessons: ["Sapaan pertama yang berkesan", "Bahasa tubuh dan senyum", "Mengantisipasi kebutuhan tamu", "Menutup interaksi dengan baik"], mins: 60 },
  { id: 3, title: "WOW Service & Tipologi Tamu", text: "Membaca karakter tamu dan menciptakan momen kejutan kecil yang personal.", img: "wow", lessons: ["Mengenali tipe tamu", "Momen WOW yang sederhana", "Personalisasi pelayanan"], mins: 50 },
  { id: 4, title: "Grooming & Etika", text: "Penampilan, kerapian seragam, dan etika kerja sehari-hari.", lessons: ["Standar penampilan", "Etika di area tamu", "Kerja sama antar departemen"], mins: 35 },
  { id: 5, title: "Komunikasi dengan Tamu", text: "Telepon, pesan, dan percakapan dalam bahasa Indonesia dan Inggris.", lessons: ["Menjawab telepon", "Frasa penting bahasa Inggris", "Menyampaikan informasi"], mins: 40 },
  { id: 6, title: "Penanganan Keluhan", text: "Mendengar, meminta maaf, menyelesaikan, dan menindaklanjuti.", lessons: ["Mendengar dengan empati", "Langkah pemulihan layanan", "Mencatat dan melapor"], mins: 40 },
  { id: 7, title: "Keselamatan & Kebersihan", text: "Prosedur darurat, kebersihan area, dan keselamatan kerja.", lessons: ["Prosedur darurat", "Standar kebersihan", "Keselamatan kerja"], mins: 30 },
];

type Q = { q: string; options: string[]; answer: number; why: string };
const QUIZ: Record<number, Q[]> = {
  2: [
    { q: "Tamu tiba dua jam sebelum waktu check-in dan kamarnya belum siap. Apa yang paling tepat?", options: ["Meminta tamu kembali pukul 14.00", "Menawarkan welcome drink, menitipkan bagasi, dan mengabari saat kamar siap", "Langsung memberi kamar lain tanpa konfirmasi"], answer: 1, why: "Tamu tetap merasa diterima walau kamar belum siap." },
    { q: "Kapan sebaiknya menyapa tamu yang berjalan ke arah Anda?", options: ["Saat tamu sudah sangat dekat", "Dalam jarak sekitar tiga meter, dengan kontak mata dan senyum", "Hanya jika tamu menyapa lebih dulu"], answer: 1, why: "Sapaan proaktif adalah kebiasaan dasar pelayanan prima." },
    { q: "Tamu meminta sesuatu yang bukan tugas departemen Anda. Langkah terbaik?", options: ["Mengarahkan tamu ke departemen lain", "Menerima permintaan, meneruskannya, dan memastikan terselesaikan", "Mengatakan itu bukan tugas Anda"], answer: 1, why: "Siapa pun yang menerima permintaan ikut memilikinya sampai selesai." },
  ],
};
const GENERIC: Q[] = [
  { q: "Apa langkah pertama saat menerima keluhan tamu?", options: ["Menjelaskan kebijakan resort", "Mendengarkan sampai selesai dengan empati", "Memanggil atasan"], answer: 1, why: "Tamu perlu merasa didengar sebelum solusi diberikan." },
  { q: "Frasa kunci budaya layanan kita adalah…", options: ["Terima kasih, maaf, ya", "Nanti saya cek", "Itu bukan bagian saya"], answer: 0, why: "Tiga kata sederhana yang dipakai setiap hari." },
  { q: "Seragam yang kusut sebelum shift sebaiknya…", options: ["Tetap dipakai", "Diganti atau dirapikan sebelum masuk area tamu", "Ditutup dengan jaket"], answer: 1, why: "Penampilan adalah kesan pertama tamu." },
];

type View = { name: "dashboard" } | { name: "modul" } | { name: "detail"; id: number } | { name: "kuis"; id: number } | { name: "jadwal" } | { name: "sertifikat" };

const NAV = [
  { name: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { name: "modul", label: "Modul Pembelajaran", icon: BookOpen },
  { name: "jadwal", label: "Jadwal Pelatihan", icon: CalendarDays },
  { name: "sertifikat", label: "Progres & Sertifikat", icon: Award },
] as const;

export default function ResortAcademy() {
  const [view, setView] = useState<View>({ name: "dashboard" });
  const [passed, setPassed] = useState<number[]>([]);
  const [done, setDone] = useState<Record<number, number[]>>({ 1: [0, 1] });
  const { ref, toTop } = useDemoScroll();
  const toast = useToast();
  const go = (v: View) => {
    setView(v);
    toTop();
  };
  const progress = Math.round((passed.length / MODULES.length) * 100);

  return (
    <DemoRoot className="overflow-hidden bg-[#f7f4ec] text-[#1d2a24]" overlay={toast.node}>
      <div className="flex h-full">
        <aside className="hidden h-full w-56 shrink-0 flex-col border-r border-black/5 bg-[#fbf9f3] px-4 py-5 @3xl:flex">
          <div className="mb-7 text-center">
            <Leaf className="mx-auto size-7" style={{ color: G }} strokeWidth={1.4} />
            <p className="mt-1 font-serif text-[22px] leading-none" style={{ color: G }}>Resort Academy</p>
            <p className="mt-1 text-[9px] uppercase tracking-[0.22em] text-black/40">The art of hospitality</p>
          </div>
          <nav className="space-y-1">
            {NAV.map((n) => {
              const active = view.name === n.name || (n.name === "modul" && (view.name === "detail" || view.name === "kuis"));
              return (
                <button
                  key={n.name}
                  type="button"
                  onClick={() => go({ name: n.name } as View)}
                  className={cn("flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[13px]", active ? "font-semibold" : "text-black/60 hover:bg-black/[0.03]")}
                  style={active ? { background: "#e3ead9", color: G } : undefined}
                >
                  <n.icon className="size-4" strokeWidth={1.7} />
                  {n.label}
                </button>
              );
            })}
          </nav>
          <div className="mt-auto rounded-xl p-4 text-center" style={{ background: "#e3ead9" }}>
            <p className="font-serif text-[17px] italic leading-snug" style={{ color: G }}>Tumbuh bersama, melayani lebih baik.</p>
          </div>
        </aside>

        <div ref={ref} data-demo-scroll className="scrollbar-thin h-full min-w-0 flex-1 overflow-y-auto">
          <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-black/5 bg-[#f7f4ec]/90 px-4 py-3 backdrop-blur @3xl:px-7">
            <p className="text-[12px] text-black/45">Learning Center <span className="mx-1">/</span> <span className="text-black/70">{view.name === "dashboard" ? "Dashboard" : view.name === "jadwal" ? "Jadwal" : view.name === "sertifikat" ? "Progres" : "Modul"}</span></p>
            <div className="ml-auto flex items-center gap-2">
              <span className="hidden text-[12px] text-black/55 @xl:inline">Putu Ayu · Front Office</span>
              <span className="grid size-8 place-items-center rounded-full text-[12px] font-semibold text-white" style={{ background: G }}>PA</span>
            </div>
          </header>
          <nav className="scrollbar-none flex gap-1.5 overflow-x-auto px-4 pt-3 @3xl:hidden">
            {NAV.map((n) => (
              <button key={n.name} type="button" onClick={() => go({ name: n.name } as View)} className={cn("shrink-0 rounded-full px-3 py-1.5 text-[12px] font-medium", view.name === n.name ? "text-white" : "bg-black/5 text-black/60")} style={view.name === n.name ? { background: G } : undefined}>
                {n.label}
              </button>
            ))}
          </nav>

          <main className="p-4 @3xl:p-7">
            {view.name === "dashboard" ? (
              <>
                <p className="text-[10.5px] font-semibold uppercase tracking-[0.2em]" style={{ color: "#a88a45" }}>Selamat datang di Resort Academy</p>
                <h3 className="mt-1 font-serif text-[30px] leading-tight @3xl:text-[36px]">Langkah kecil, pelayanan luar biasa.</h3>
                <div className="mt-4 grid overflow-hidden rounded-2xl @2xl:grid-cols-[1.1fr_1fr]" style={{ background: G }}>
                  <div className="p-6 text-white @3xl:p-8">
                    <p className="font-serif text-[26px] leading-tight @3xl:text-[30px]">Seni melayani.<br />Standar yang menginspirasi.</p>
                    <div className="my-4 h-0.5 w-10" style={{ background: GOLD }} />
                    <p className="text-[12.5px] leading-relaxed text-white/70">Belajar memahami tamu, menguasai operasional, dan menghadirkan pengalaman menginap yang berkesan.</p>
                    <button type="button" onClick={() => go({ name: "detail", id: 2 })} className="mt-5 rounded-lg px-4 py-2 text-[12.5px] font-semibold text-[#1d2a24]" style={{ background: GOLD }}>
                      Lanjutkan belajar →
                    </button>
                  </div>
                  <div className="relative hidden min-h-[200px] @2xl:block">
                    <Image src="/work/resort-academy/ph-hero.webp" alt="" fill sizes="480px" className="object-cover" />
                    <div className="absolute inset-y-0 left-0 w-16" style={{ background: `linear-gradient(90deg, ${G}, transparent)` }} />
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 @4xl:grid-cols-4">
                  <Stat icon={BookOpen} value="7" label="Bab pembelajaran" />
                  <Stat icon={CalendarDays} value="8" label="Sesi kurikulum" />
                  <Stat icon={ClipboardCheck} value={`${passed.length}/7`} label="Bab dievaluasi" />
                  <Stat icon={BarChart3} value={`${progress}%`} label="Progres belajar" />
                </div>
                <div className="mt-6 flex items-end justify-between">
                  <h4 className="font-serif text-[22px]">Perjalanan belajar Anda</h4>
                  <button type="button" onClick={() => go({ name: "modul" })} className="text-[12px] font-semibold" style={{ color: G }}>Lihat semua modul →</button>
                </div>
                <div className="mt-3 grid gap-3 @2xl:grid-cols-3">
                  {MODULES.slice(0, 3).map((m) => (
                    <ModuleCard key={m.id} m={m} passed={passed.includes(m.id)} doneCount={done[m.id]?.length ?? 0} onOpen={() => go({ name: "detail", id: m.id })} shot={m.id === 2 ? "1" : undefined} />
                  ))}
                </div>
                <div className="mt-4 grid gap-3 @2xl:grid-cols-2">
                  <div className="flex items-center gap-4 rounded-2xl px-5 py-4 text-white" style={{ background: G }}>
                    <p className="font-serif text-[20px]">Belajar. Praktik. Refleksi.</p>
                    <button type="button" onClick={() => go({ name: "jadwal" })} className="ml-auto shrink-0 rounded-lg px-3 py-1.5 text-[12px] font-semibold text-[#1d2a24]" style={{ background: GOLD }}>Jadwal praktik</button>
                  </div>
                  <div className="rounded-2xl px-5 py-4" style={{ background: "#e3ead9" }}>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/45">Prinsip kami hari ini</p>
                    <p className="mt-1 font-serif text-[20px] italic" style={{ color: G }}>&ldquo;Terima kasih, Maaf, Ya.&rdquo;</p>
                  </div>
                </div>
              </>
            ) : null}

            {view.name === "modul" ? (
              <>
                <h3 className="font-serif text-[30px]">Modul pembelajaran</h3>
                <p className="text-[13px] text-black/55">Tujuh bab, dikerjakan berurutan atau sesuai jadwal pelatihan.</p>
                <div className="mt-4 grid gap-3 @2xl:grid-cols-2 @4xl:grid-cols-3">
                  {MODULES.map((m) => (
                    <ModuleCard key={m.id} m={m} passed={passed.includes(m.id)} doneCount={done[m.id]?.length ?? 0} onOpen={() => go({ name: "detail", id: m.id })} />
                  ))}
                </div>
              </>
            ) : null}

            {view.name === "detail" ? (() => {
              const m = MODULES.find((x) => x.id === view.id)!;
              const d = done[m.id] ?? [];
              return (
                <>
                  <button type="button" onClick={() => go({ name: "modul" })} className="mb-3 inline-flex items-center gap-1 text-[12px] text-black/55"><ChevronLeft className="size-4" />Semua modul</button>
                  <div className="grid gap-5 @3xl:grid-cols-[1.3fr_1fr]">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: "#a88a45" }}>Bab {m.id} · {m.mins} menit</p>
                      <h3 className="mt-1 font-serif text-[32px] leading-tight">{m.title}</h3>
                      <p className="mt-2 text-[13.5px] leading-relaxed text-black/60">{m.text}</p>
                      <ol className="mt-5 space-y-2">
                        {m.lessons.map((l, i) => {
                          const ok = d.includes(i);
                          return (
                            <li key={l}>
                              <button
                                type="button"
                                onClick={() => {
                                  setDone((s) => ({ ...s, [m.id]: ok ? d.filter((x) => x !== i) : [...d, i] }));
                                  if (!ok) toast.show(`Materi "${l}" selesai`);
                                }}
                                className="flex w-full items-center gap-3 rounded-xl border border-black/5 bg-white px-4 py-3 text-left text-[13px] hover:border-black/15"
                              >
                                {ok ? <CheckCircle2 className="size-5 shrink-0" style={{ color: G }} /> : <PlayCircle className="size-5 shrink-0 text-black/35" />}
                                <span className={cn("flex-1", ok && "text-black/50")}>{i + 1}. {l}</span>
                                <span className="text-[11px] text-black/40">{Math.round(m.mins / m.lessons.length)} mnt</span>
                              </button>
                            </li>
                          );
                        })}
                      </ol>
                    </div>
                    <div className="space-y-3">
                      {m.img ? (
                        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                          <Image src={`/work/resort-academy/ph-${m.img}.webp`} alt="" fill sizes="400px" className="object-cover" />
                        </div>
                      ) : null}
                      <div className="rounded-2xl bg-white p-5">
                        <p className="text-[12px] text-black/50">Evaluasi bab</p>
                        <p className="mt-1 text-[15px] font-semibold">{passed.includes(m.id) ? "Lulus, sertifikat bab terbuka" : "3 soal studi kasus"}</p>
                        <button type="button" data-shot="2" onClick={() => go({ name: "kuis", id: m.id })} className="mt-3 w-full rounded-lg py-2.5 text-[13px] font-semibold text-white" style={{ background: G }}>
                          {passed.includes(m.id) ? "Ulangi kuis" : "Mulai kuis"}
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              );
            })() : null}

            {view.name === "kuis" ? (
              <Quiz
                m={MODULES.find((x) => x.id === view.id)!}
                onBack={() => go({ name: "detail", id: view.id })}
                onPass={() => {
                  setPassed((p) => (p.includes(view.id) ? p : [...p, view.id]));
                  toast.show("Evaluasi lulus, progres diperbarui");
                }}
                goCert={() => go({ name: "sertifikat" })}
              />
            ) : null}

            {view.name === "jadwal" ? (
              <>
                <h3 className="font-serif text-[30px]">Jadwal pelatihan</h3>
                <ul className="mt-4 space-y-2">
                  {[
                    ["Sen, 24 Nov", "08.00", "Service Excellence: role play front office", "Ruang Pandan"],
                    ["Rab, 26 Nov", "14.00", "WOW Service: studi kasus tamu keluarga", "Restoran Kayu"],
                    ["Jum, 28 Nov", "09.00", "Penanganan keluhan bersama Guest Relations", "Ruang Pandan"],
                    ["Sen, 1 Des", "08.00", "Evaluasi praktik bulanan", "Lobby"],
                  ].map(([d, t, title, place]) => (
                    <li key={title} className="flex items-center gap-4 rounded-xl bg-white px-4 py-3">
                      <div className="w-20 shrink-0 text-center">
                        <p className="text-[11px] text-black/45">{d}</p>
                        <p className="font-serif text-[20px]" style={{ color: G }}>{t}</p>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13.5px] font-medium">{title}</p>
                        <p className="text-[11.5px] text-black/50">{place}</p>
                      </div>
                      <button type="button" onClick={() => toast.show("Ditambahkan ke kalender Anda")} className="hidden shrink-0 rounded-lg border border-black/10 px-3 py-1.5 text-[12px] font-medium @xl:block">Ikuti</button>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}

            {view.name === "sertifikat" ? (
              <>
                <h3 className="font-serif text-[30px]">Progres & sertifikat</h3>
                <div className="mt-4 grid gap-4 @3xl:grid-cols-[1fr_1.2fr]">
                  <div className="space-y-2.5 rounded-2xl bg-white p-5">
                    {MODULES.map((m) => (
                      <div key={m.id}>
                        <div className="flex justify-between text-[12.5px]"><span>{m.title}</span><span className="text-black/45">{passed.includes(m.id) ? "Lulus" : `${done[m.id]?.length ?? 0}/${m.lessons.length}`}</span></div>
                        <div className="mt-1 h-1.5 rounded-full bg-black/5"><div className="h-full rounded-full" style={{ background: G, width: passed.includes(m.id) ? "100%" : `${((done[m.id]?.length ?? 0) / m.lessons.length) * 80}%` }} /></div>
                      </div>
                    ))}
                  </div>
                  <div className="relative overflow-hidden rounded-2xl border-[6px] bg-white p-6 text-center" style={{ borderColor: "#e3ead9" }}>
                    <Award className="mx-auto size-9" style={{ color: GOLD }} />
                    <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-black/45">Sertifikat kompetensi</p>
                    <p className="mt-2 font-serif text-[26px]" style={{ color: G }}>Putu Ayu Lestari</p>
                    <p className="mt-1 text-[12.5px] text-black/55">telah menyelesaikan program Resort Academy</p>
                    <p className="mt-4 text-[12px] text-black/45">{passed.length} dari 7 bab dievaluasi</p>
                    {passed.length < 7 ? (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-[3px]">
                        <Lock className="size-6 text-black/40" />
                        <p className="mt-2 max-w-[220px] text-[12.5px] text-black/60">Terbuka setelah ketujuh bab lulus evaluasi.</p>
                        {passed.length > 0 ? <p className="mt-2 text-[12px] font-semibold" style={{ color: G }}>{passed.length} sertifikat bab sudah bisa diunduh</p> : null}
                      </div>
                    ) : null}
                  </div>
                </div>
              </>
            ) : null}
          </main>
        </div>
      </div>
    </DemoRoot>
  );
}

function Stat({ icon: I, value, label }: { icon: typeof BookOpen; value: string; label: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-black/5 bg-white px-4 py-3.5">
      <I className="size-6 shrink-0 text-black/40" strokeWidth={1.4} />
      <div>
        <p className="font-serif text-[24px] leading-none">{value}</p>
        <p className="mt-1 text-[11px] text-black/50">{label}</p>
      </div>
    </div>
  );
}

function ModuleCard({ m, passed, doneCount, onOpen, shot }: { m: Mod; passed: boolean; doneCount: number; onOpen: () => void; shot?: string }) {
  return (
    <button type="button" data-shot={shot} onClick={onOpen} className="group overflow-hidden rounded-2xl border border-black/5 bg-white text-left transition hover:-translate-y-0.5 hover:shadow-lg">
      {m.img ? (
        <div className="relative aspect-[16/9]">
          <Image src={`/work/resort-academy/ph-${m.img}.webp`} alt="" fill sizes="320px" className="object-cover" />
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold" style={{ color: G }}>Modul {String(m.id).padStart(2, "0")}</span>
        </div>
      ) : (
        <div className="flex aspect-[16/9] items-end p-4" style={{ background: "#e3ead9" }}>
          <span className="font-serif text-[40px] leading-none" style={{ color: G }}>{String(m.id).padStart(2, "0")}</span>
        </div>
      )}
      <div className="p-4">
        <p className="font-serif text-[19px] leading-tight">{m.title}</p>
        <p className="mt-1 line-clamp-2 text-[12px] leading-relaxed text-black/55">{m.text}</p>
        <div className="mt-3 flex items-center gap-2 text-[11px] text-black/45">
          <Clock className="size-3.5" /> {m.lessons.length} materi
          <div className="mx-1 h-1 flex-1 rounded-full bg-black/5"><div className="h-full rounded-full" style={{ background: G, width: passed ? "100%" : `${(doneCount / m.lessons.length) * 80}%` }} /></div>
          {passed ? <Check className="size-4" style={{ color: G }} /> : <span className="font-semibold" style={{ color: G }}>Pelajari ↗</span>}
        </div>
      </div>
    </button>
  );
}

function Quiz({ m, onBack, onPass, goCert }: { m: Mod; onBack: () => void; onPass: () => void; goCert: () => void }) {
  const qs = QUIZ[m.id] ?? GENERIC;
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const q = qs[i];

  if (finished) {
    const pass = score >= 2;
    return (
      <div className="mx-auto max-w-md rounded-2xl bg-white p-8 text-center">
        <p className="font-serif text-[48px] leading-none" style={{ color: G }}>{score}/{qs.length}</p>
        <p className="mt-3 text-[15px] font-semibold">{pass ? "Lulus evaluasi bab ini" : "Belum lulus, coba sekali lagi"}</p>
        <p className="mt-1 text-[12.5px] text-black/55">{m.title}</p>
        <div className="mt-5 flex justify-center gap-2">
          <button type="button" onClick={onBack} className="rounded-lg border border-black/10 px-4 py-2 text-[12.5px] font-medium">Kembali ke modul</button>
          {pass ? <button type="button" onClick={goCert} className="rounded-lg px-4 py-2 text-[12.5px] font-semibold text-white" style={{ background: G }}>Lihat progres</button> : null}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <button type="button" onClick={onBack} className="mb-3 inline-flex items-center gap-1 text-[12px] text-black/55"><ChevronLeft className="size-4" />{m.title}</button>
      <div className="mb-4 flex gap-1.5">
        {qs.map((_, k) => <span key={k} className="h-1.5 flex-1 rounded-full" style={{ background: k <= i ? G : "#e5e2d8" }} />)}
      </div>
      <div className="rounded-2xl bg-white p-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-black/40">Soal {i + 1} dari {qs.length}</p>
        <p className="mt-2 font-serif text-[22px] leading-snug">{q.q}</p>
        <div className="mt-4 space-y-2">
          {q.options.map((o, k) => {
            const state = picked === null ? "idle" : k === q.answer ? "right" : k === picked ? "wrong" : "idle";
            return (
              <button
                key={o}
                type="button"
                disabled={picked !== null}
                onClick={() => {
                  setPicked(k);
                  if (k === q.answer) setScore((s) => s + 1);
                }}
                className={cn(
                  "flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left text-[13px] transition",
                  state === "right" && "border-emerald-500 bg-emerald-50",
                  state === "wrong" && "border-red-400 bg-red-50",
                  state === "idle" && "border-black/10 hover:border-black/25",
                )}
              >
                <span className="grid size-5 shrink-0 place-items-center rounded-full border border-black/15 text-[10px] font-semibold">{String.fromCharCode(65 + k)}</span>
                {o}
              </button>
            );
          })}
        </div>
        {picked !== null ? (
          <div className="mt-4 flex items-center gap-3 rounded-xl p-3 text-[12.5px]" style={{ background: "#eef3ea" }}>
            <span className="flex-1">{q.why}</span>
            <button
              type="button"
              onClick={() => {
                if (i + 1 < qs.length) {
                  setI(i + 1);
                  setPicked(null);
                } else {
                  setFinished(true);
                  if (score >= 2) onPass();
                }
              }}
              className="shrink-0 rounded-lg px-4 py-2 text-[12.5px] font-semibold text-white"
              style={{ background: G }}
            >
              {i + 1 < qs.length ? "Berikutnya" : "Lihat hasil"}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

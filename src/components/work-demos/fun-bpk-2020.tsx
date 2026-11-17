"use client";

import { Award, BookOpen, CalendarDays, Clapperboard, Flag, Megaphone, Smartphone, Trophy, Users, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { DemoModal, DemoRoot, useDemoScroll } from "./kit";

const NAVY = "#0b1026";
const ORANGE = "#f7731c";

type Lomba = {
  id: string;
  name: string;
  icon: typeof Trophy;
  grad: string;
  lead: string;
  peserta: string[];
  ketentuan: string[];
  hadiah: string[];
  jadwal: [string, string][];
  daftar: string[];
};

const LOMBA: Lomba[] = [
  {
    id: "cc",
    name: "Cerdas Cermat Online",
    icon: Trophy,
    grad: "linear-gradient(135deg,#ff2e93,#7b2ff7)",
    lead: "Kompetisi cerdas cermat tingkat SMA/SMK/sederajat dan mahasiswa dari seluruh Indonesia, secara virtual.",
    peserta: ["Pelajar SMA/SMK/sederajat, 3 anggota per tim", "Mahasiswa, 2 anggota per tim"],
    ketentuan: ["Tema: Akuntabilitas untuk Semua", "Seluruh babak berlangsung secara virtual", "Wajib mengikuti technical meeting"],
    hadiah: ["Juara I: uang tunai Rp7.500.000", "Juara II: uang tunai Rp5.000.000", "Juara III: uang tunai Rp2.500.000", "E-certificate untuk seluruh peserta"],
    jadwal: [["6–15 Agustus 2020", "Registrasi"], ["17 Agustus 2020", "Technical meeting"], ["18 Agustus 2020", "Babak penyisihan"], ["19 Agustus 2020", "Semifinal dan final"]],
    daftar: ["Tingkat SMA/SMK/sederajat", "Tingkat mahasiswa"],
  },
  {
    id: "bb",
    name: "Bibliobattle",
    icon: BookOpen,
    grad: "linear-gradient(135deg,#ffb300,#ff3d00)",
    lead: "Lomba menceritakan kembali buku fiksi atau nonfiksi yang memiliki nilai moral: integritas, kejujuran, dan lainnya.",
    peserta: ["Peserta umum", "Pegawai BPK"],
    ketentuan: ["Pilih buku favorit yang tidak mengandung SARA", "Buat video ulasan berdurasi 3–5 menit", "Unggah di Instagram dengan tagar #BIBLIOBATTLE_BPKFUN2020 #BPKFUN2020", "Mention akun resmi BPK dan perpustakaan BPK"],
    hadiah: ["Uang tunai", "Suvenir", "E-certificate"],
    jadwal: [["Seri I · Agustus 2020", "Tema pekerjaan dan organisasi"], ["Seri II · November 2020", "Tema individu dan self-empowerment"], ["Seri III · Desember 2020", "Tema keluarga dan gender"]],
    daftar: ["Daftar Bibliobattle"],
  },
  {
    id: "md",
    name: "Lomba Konten Medsos",
    icon: Smartphone,
    grad: "linear-gradient(135deg,#00c6ff,#3a47d5)",
    lead: "Lomba konten kreatif berbentuk stories video aktivitas dengan tema “BPK Menurut Kamu”.",
    peserta: ["Pelajar dan mahasiswa", "Wajib mengikuti akun Instagram resmi BPK"],
    ketentuan: ["Abadikan video di Instagram Story", "Mention dan tag akun Instagram resmi BPK", "Simpan ke story highlight agar tidak hilang dalam 24 jam"],
    hadiah: ["10 pemenang paling menarik: saldo e-toll Rp1.000.000 dan suvenir", "20 pemenang favorit: saldo e-toll Rp500.000 dan suvenir", "50 peserta: saldo e-toll Rp100.000 dan suvenir"],
    jadwal: [["September 2020", "Pendaftaran"], ["September 2020", "Penilaian dan pengumuman pemenang"]],
    daftar: ["Ikut lomba konten"],
  },
  {
    id: "vd",
    name: "Lomba Karya Video",
    icon: Clapperboard,
    grad: "linear-gradient(135deg,#11998e,#38ef7d)",
    lead: "Lomba karya video BPK RI untuk mahasiswa dan pegawai BPK.",
    peserta: ["Mahasiswa", "Pegawai BPK"],
    ketentuan: ["Satu peserta mengirim satu karya video", "Karya orisinal buatan sendiri", "Batas pendaftaran 30 September 2020 pukul 23.59 WIB"],
    hadiah: ["Uang tunai", "Suvenir"],
    jadwal: [["Agustus–September 2020", "Pendaftaran dan pengumpulan karya"], ["Oktober 2020", "Penilaian dan pengumuman"]],
    daftar: ["Kirim karya video"],
  },
];

const TABS = ["Ketentuan", "Hadiah", "Jadwal"] as const;

export default function FunBpk() {
  const [sel, setSel] = useState("cc");
  const [tab, setTab] = useState<(typeof TABS)[number]>("Ketentuan");
  const [reg, setReg] = useState<string | null>(null);
  const { ref, toId } = useDemoScroll();
  const l = LOMBA.find((x) => x.id === sel)!;

  return (
    <DemoRoot
      scrollRef={ref}
      className="bg-[#f4f5f9] text-[#141a33]"
      overlay={
        <DemoModal open={!!reg} onClose={() => setReg(null)} label="Pendaftaran" className="max-w-sm">
          <div className="p-6 text-center">
            <button type="button" aria-label="Tutup" onClick={() => setReg(null)} className="absolute right-3 top-3 text-black/40"><X className="size-5" /></button>
            <span className="mx-auto grid size-12 place-items-center rounded-full text-white" style={{ background: ORANGE }}><Flag className="size-6" /></span>
            <p className="mt-4 text-[17px] font-extrabold">{reg}</p>
            <p className="mt-2 text-[13px] leading-relaxed text-black/60">FUN BPK 2020 sudah selesai. Pada masa event, tombol ini membuka formulir pendaftaran sesuai kategori peserta.</p>
            <button type="button" onClick={() => setReg(null)} className="mt-5 h-10 w-full rounded-full text-[13px] font-bold text-white" style={{ background: NAVY }}>Mengerti</button>
          </div>
        </DemoModal>
      }
    >
      <header className="sticky top-0 z-20 flex items-center gap-6 bg-[#0b1026]/90 px-5 py-3 text-white backdrop-blur @4xl:px-10">
        <span className="text-[16px] font-black tracking-tight">FUN BPK <span style={{ color: ORANGE }}>2020</span></span>
        <nav className="ml-auto hidden gap-6 text-[13px] text-white/70 @3xl:flex">
          <button type="button" onClick={() => toId("tentang")}>Tentang</button>
          <button type="button" onClick={() => toId("lomba")}>Lomba</button>
          <button type="button" onClick={() => toId("linimasa")}>Linimasa</button>
        </nav>
        <button type="button" onClick={() => toId("lomba")} className="ml-auto rounded-full px-4 py-1.5 text-[12px] font-bold @3xl:ml-0" style={{ background: ORANGE }}>Daftar</button>
      </header>

      <section className="relative overflow-hidden px-5 py-20 text-center text-white @4xl:py-28" style={{ background: NAVY }}>
        <div aria-hidden="true" className="absolute inset-0">
          <span className="absolute left-[8%] top-[12%] size-56 animate-[fb-drift_14s_ease-in-out_infinite] rounded-full bg-[#ff2e93] opacity-60 blur-3xl" />
          <span className="absolute right-[10%] top-[5%] size-64 animate-[fb-drift_17s_ease-in-out_infinite_reverse] rounded-full bg-[#ffb300] opacity-50 blur-3xl" />
          <span className="absolute bottom-[-10%] left-[30%] size-72 animate-[fb-drift_19s_ease-in-out_infinite] rounded-full bg-[#00c6ff] opacity-45 blur-3xl" />
          <span className="absolute bottom-[5%] right-[25%] size-48 animate-[fb-drift_15s_ease-in-out_infinite_reverse] rounded-full bg-[#38ef7d] opacity-40 blur-3xl" />
          <span className="absolute left-[45%] top-[30%] size-40 rounded-full bg-[#7b2ff7] opacity-50 blur-3xl" />
        </div>
        <div className="relative">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] backdrop-blur">
            <CalendarDays className="size-3.5" /> Agustus – Desember 2020
          </p>
          <h3 className="mt-5 text-[52px] font-black leading-[0.95] tracking-tight @4xl:text-[76px]">FUN BPK 2020</h3>
          <p className="mt-2 text-[20px] font-bold tracking-wide text-white/90 @4xl:text-[26px]">Festival untuk Negeri</p>
          <button type="button" onClick={() => toId("lomba")} className="mt-7 rounded-full px-6 py-3 text-[13px] font-extrabold uppercase tracking-wider shadow-lg" style={{ background: ORANGE }}>
            Lihat lomba
          </button>
        </div>
      </section>

      <section data-anchor="tentang" className="grid gap-3 px-5 py-10 @3xl:grid-cols-3 @4xl:px-10">
        {[
          [Megaphone, "Festival dengan serangkaian kegiatan bertema besar “Akuntabilitas untuk Semua” atau Accountability for All."],
          [Users, "Memberi sosialisasi dan edukasi nilai akuntabilitas dalam pengelolaan keuangan negara, serta membangun komunikasi dengan para pemangku kepentingan."],
          [Award, "Sekaligus menyemarakkan peringatan HUT Kemerdekaan Republik Indonesia ke-75 pada 17 Agustus 2020."],
        ].map(([I, t], i) => {
          const Icon = I as typeof Megaphone;
          return (
            <div key={i} className="rounded-2xl bg-white p-5 shadow-sm">
              <span className="grid size-10 place-items-center rounded-xl text-white" style={{ background: LOMBA[i].grad }}><Icon className="size-5" /></span>
              <p className="mt-3 text-[13px] leading-relaxed text-black/65">{t as string}</p>
            </div>
          );
        })}
      </section>

      <section data-anchor="lomba" className="px-5 pb-10 @4xl:px-10">
        <h4 className="text-[28px] font-black tracking-tight">Empat lomba, satu festival.</h4>
        <div className="mt-5 grid grid-cols-2 gap-2.5 @4xl:grid-cols-4">
          {LOMBA.map((x, i) => (
            <button
              key={x.id}
              type="button"
              data-shot={i === 0 ? "1" : i === 1 ? "2" : undefined}
              onClick={() => { setSel(x.id); setTab("Ketentuan"); }}
              className={cn("relative overflow-hidden rounded-2xl p-4 text-left text-white transition", sel === x.id ? "ring-4 ring-[#0b1026]/15 scale-[1.02]" : "opacity-80 hover:opacity-100")}
              style={{ background: x.grad }}
            >
              <x.icon className="size-6" />
              <p className="mt-6 text-[15px] font-extrabold leading-tight">{x.name}</p>
            </button>
          ))}
        </div>

        <div className="mt-4 grid gap-4 rounded-3xl bg-white p-5 shadow-sm @3xl:grid-cols-[1.5fr_1fr] @4xl:p-7">
          <div>
            <h5 className="text-[20px] font-extrabold leading-tight">{l.name}</h5>
            <p className="mt-1.5 text-[13px] leading-relaxed text-black/60">{l.lead}</p>
            <div className="mt-4 flex gap-1 rounded-full bg-[#f4f5f9] p-1">
              {TABS.map((t) => (
                <button key={t} type="button" onClick={() => setTab(t)} className={cn("flex-1 rounded-full py-1.5 text-[12.5px] font-bold", tab === t ? "bg-white shadow-sm" : "text-black/50")}>{t}</button>
              ))}
            </div>
            {tab === "Jadwal" ? (
              <ol className="mt-4 space-y-3 border-l-2 border-dashed border-black/10 pl-4">
                {l.jadwal.map(([d, t]) => (
                  <li key={d + t} className="relative">
                    <span className="absolute -left-[23px] top-1 size-3 rounded-full" style={{ background: ORANGE }} />
                    <p className="text-[13px] font-bold">{d}</p>
                    <p className="text-[12px] text-black/55">{t}</p>
                  </li>
                ))}
              </ol>
            ) : (
              <ul className="mt-4 space-y-2">
                {(tab === "Ketentuan" ? l.ketentuan : l.hadiah).map((t) => (
                  <li key={t} className="flex gap-2.5 text-[13px]">
                    {tab === "Hadiah" ? <Trophy className="mt-0.5 size-4 shrink-0" style={{ color: ORANGE }} /> : <span className="mt-2 size-1.5 shrink-0 rounded-full" style={{ background: ORANGE }} />}
                    {t}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="rounded-2xl bg-[#f4f5f9] p-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-black/45">Peserta</p>
            <ul className="mt-2 space-y-1.5">
              {l.peserta.map((p) => <li key={p} className="flex items-start gap-2 text-[12.5px]"><Users className="mt-0.5 size-3.5 shrink-0 text-black/40" />{p}</li>)}
            </ul>
            <div className="mt-4 space-y-2">
              {l.daftar.map((d, i) => (
                <button key={d} type="button" onClick={() => setReg(`${l.name}: ${d}`)} className="h-10 w-full rounded-full text-[12px] font-extrabold uppercase tracking-wide" style={i === 0 ? { background: ORANGE, color: "#fff" } : { background: "#fff", color: NAVY }}>
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section data-anchor="linimasa" className="px-5 pb-12 @4xl:px-10">
        <h4 className="text-[22px] font-black tracking-tight">Linimasa festival</h4>
        <div className="mt-5 grid grid-cols-5 gap-1.5">
          {["Agu", "Sep", "Okt", "Nov", "Des"].map((m, i) => (
            <div key={m}>
              <p className="text-[12px] font-bold text-black/55">{m}</p>
              <div className="mt-2 space-y-1">
                {LOMBA.filter((x) => ({ cc: [0], bb: [0, 3, 4], md: [1], vd: [0, 1, 2] })[x.id]!.includes(i)).map((x) => (
                  <button key={x.id} type="button" onClick={() => { setSel(x.id); setTab("Jadwal"); toId("lomba"); }} title={x.name} className="block h-2.5 w-full rounded-full" style={{ background: x.grad }} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="px-5 py-6 text-[12px] text-white/55 @4xl:px-10" style={{ background: NAVY }}>
        FUN BPK 2020 · Festival untuk Negeri · Akuntabilitas untuk Semua
      </footer>
      <style>{`@keyframes fb-drift{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(30px,-20px) scale(1.15)}}`}</style>
    </DemoRoot>
  );
}

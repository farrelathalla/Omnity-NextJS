"use client";

import {
  ArrowDownUp,
  ArrowLeft,
  Baby,
  CalendarClock,
  Check,
  CreditCard,
  Home,
  MapPin,
  Minus,
  Nfc,
  Plane,
  Plus,
  QrCode,
  TrainFront,
  Wallet,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { FakeQr, rupiah, useToast } from "./kit";

type Screen = "home" | "jadwal" | "tiket" | "posisi" | "saldo";

const RED = "#d6262e";

/** Bogor line, km from Jakarta Kota (approximate, for the demo fare). */
const STATIONS: [string, number][] = [
  ["Jakarta Kota", 0],
  ["Juanda", 4.3],
  ["Gondangdia", 6.4],
  ["Cikini", 7.6],
  ["Manggarai", 9.8],
  ["Tebet", 11.4],
  ["Cawang", 13.3],
  ["Kalibata", 15.6],
  ["Pasar Minggu", 18.6],
  ["Tanjung Barat", 21.1],
  ["Lenteng Agung", 23.5],
  ["Universitas Indonesia", 26.6],
  ["Pondok Cina", 27.8],
  ["Depok Baru", 30.3],
  ["Depok", 31.9],
  ["Citayam", 36.2],
  ["Bojonggede", 40.5],
  ["Cilebut", 45.1],
  ["Bogor", 49.9],
];
const km = (name: string) => STATIONS.find((s) => s[0] === name)?.[1] ?? 0;
const fare = (a: string, b: string) => {
  const d = Math.abs(km(a) - km(b));
  return 3000 + Math.ceil(Math.max(0, d - 25) / 10) * 1000;
};
const hm = (mins: number) => `${String(Math.floor(mins / 60) % 24).padStart(2, "0")}:${String(Math.round(mins) % 60).padStart(2, "0")}`;

const FEATURES: { id: Screen; icon: typeof Home; title: string; text: string }[] = [
  { id: "home", icon: Home, title: "Beranda & saldo KMT", text: "Saldo kartu, menu cepat, dan info layanan." },
  { id: "jadwal", icon: CalendarClock, title: "Jadwal Commuter Line", text: "Keberangkatan berikutnya antar stasiun." },
  { id: "tiket", icon: QrCode, title: "Tiket QR", text: "Beli hingga empat tiket dalam satu transaksi." },
  { id: "posisi", icon: TrainFront, title: "Posisi kereta", text: "Lihat kereta bergerak menuju stasiunmu." },
  { id: "saldo", icon: Nfc, title: "Isi saldo KMT", text: "Tempelkan kartu ke ponsel lewat NFC." },
];

export default function CAccess() {
  const [screen, setScreen] = useState<Screen>("home");
  const [balance, setBalance] = useState(48500);
  const toast = useToast();

  return (
    <div className="relative h-full overflow-hidden bg-[radial-gradient(120%_90%_at_80%_10%,#ffe3e1_0%,#fff7f6_45%,#f6f2f1_100%)]">
      <div className="flex h-full items-center justify-center gap-10 px-4 @3xl:justify-between @3xl:px-14">
        <div className="hidden max-w-sm @3xl:block">
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-[12px] font-semibold shadow-sm" style={{ color: RED }}>
            <TrainFront className="size-3.5" /> KAI Commuter
          </span>
          <h3 className="mt-4 text-[34px] font-bold leading-[1.05] tracking-tight text-[#1b1b1f]">
            Satu aplikasi untuk perjalanan harian.
          </h3>
          <p className="mt-3 text-[14px] leading-relaxed text-black/55">Pilih fitur untuk melihatnya di ponsel.</p>
          <ul className="mt-6 space-y-1.5">
            {FEATURES.map((f) => (
              <li key={f.id}>
                <button
                  type="button"
                  onClick={() => setScreen(f.id)}
                  className={cn(
                    "flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition",
                    screen === f.id ? "bg-white shadow-md" : "hover:bg-white/60",
                  )}
                >
                  <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg text-white" style={{ background: screen === f.id ? RED : "#1b1b1f" }}>
                    <f.icon className="size-4" />
                  </span>
                  <span>
                    <span className="block text-[13.5px] font-semibold text-[#1b1b1f]">{f.title}</span>
                    <span className="block text-[12px] text-black/50">{f.text}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-[12px] text-black/45">1 juta+ unduhan di Google Play</p>
        </div>

        {/* Phone */}
        <div className="relative shrink-0 rounded-[44px] bg-[#16161a] p-[9px] shadow-[0_30px_80px_-20px_rgba(120,20,20,0.45)] ring-1 ring-black/60">
          <div className="absolute left-1/2 top-[15px] z-20 h-[22px] w-[86px] -translate-x-1/2 rounded-full bg-black" />
          <div
            data-phone-screen
            className="relative h-[584px] w-[270px] overflow-hidden rounded-[36px] bg-[#f5f5f7] text-[#1b1b1f]"
          >
            <div className="flex h-9 items-end justify-between px-6 pb-1 text-[11px] font-semibold">
              <span>07:41</span>
              <span>5G ▮▮▮</span>
            </div>
            <div className="scrollbar-none absolute inset-x-0 bottom-[58px] top-9 overflow-y-auto">
              {screen === "home" ? <HomeScreen balance={balance} go={setScreen} toast={toast.show} /> : null}
              {screen === "jadwal" ? <JadwalScreen back={() => setScreen("home")} /> : null}
              {screen === "tiket" ? <TiketScreen back={() => setScreen("home")} toast={toast.show} /> : null}
              {screen === "posisi" ? <PosisiScreen back={() => setScreen("home")} /> : null}
              {screen === "saldo" ? (
                <SaldoScreen
                  balance={balance}
                  back={() => setScreen("home")}
                  onTopUp={(n) => {
                    setBalance((b) => b + n);
                    toast.show(`Saldo KMT bertambah ${rupiah(n)}`);
                  }}
                />
              ) : null}
            </div>
            <nav className="absolute inset-x-0 bottom-0 flex h-[58px] items-start justify-around border-t border-black/5 bg-white pt-2">
              {([
                ["home", Home, "Beranda", undefined],
                ["jadwal", CalendarClock, "Jadwal", "1"],
                ["tiket", QrCode, "Tiket QR", "2"],
                ["saldo", Wallet, "Saldo", undefined],
              ] as const).map(([id, I, label, shot]) => (
                <button
                  key={id}
                  type="button"
                  data-shot={shot}
                  onClick={() => setScreen(id)}
                  className="flex w-14 flex-col items-center gap-0.5 text-[9.5px] font-medium"
                  style={{ color: screen === id ? RED : "#8a8a90" }}
                >
                  <I className="size-[18px]" strokeWidth={screen === id ? 2.2 : 1.8} />
                  {label}
                </button>
              ))}
            </nav>
            <div className="absolute bottom-1.5 left-1/2 h-1 w-24 -translate-x-1/2 rounded-full bg-black/80" />
          </div>
        </div>
      </div>
      {toast.node}
    </div>
  );
}

function Header({ title, back }: { title: string; back: () => void }) {
  return (
    <div className="sticky top-0 z-10 flex items-center gap-2 bg-[#f5f5f7]/95 px-4 py-2.5 backdrop-blur">
      <button type="button" onClick={back} aria-label="Kembali" className="grid size-7 place-items-center rounded-full bg-white shadow-sm">
        <ArrowLeft className="size-4" />
      </button>
      <p className="text-[14px] font-bold">{title}</p>
    </div>
  );
}

function HomeScreen({ balance, go, toast }: { balance: number; go: (s: Screen) => void; toast: (m: string) => void }) {
  const actions: { icon: typeof Home; label: string; to?: Screen; msg?: string }[] = [
    { icon: CalendarClock, label: "Jadwal", to: "jadwal" },
    { icon: QrCode, label: "Tiket QR", to: "tiket" },
    { icon: TrainFront, label: "Posisi KRL", to: "posisi" },
    { icon: Nfc, label: "Isi Saldo", to: "saldo" },
    { icon: Plane, label: "KA Bandara", msg: "Tiket KA Bandara Soekarno-Hatta" },
    { icon: Baby, label: "Pin Ibu Hamil", msg: "Registrasi pin ibu hamil" },
  ];
  return (
    <div>
      <div className="px-4 pb-14 pt-2 text-white" style={{ background: `linear-gradient(160deg, ${RED}, #a3141b)` }}>
        <p className="text-[11px] opacity-80">Selamat pagi,</p>
        <p className="text-[16px] font-bold">Teman Perjalanan</p>
      </div>
      <div className="-mt-11 px-4">
        <div className="rounded-2xl bg-white p-4 shadow-md">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-[11px] font-semibold text-black/50"><CreditCard className="size-3.5" /> KMT •••• 2208</span>
            <button type="button" onClick={() => go("saldo")} className="rounded-full px-2.5 py-1 text-[10.5px] font-bold text-white" style={{ background: RED }}>
              Isi saldo
            </button>
          </div>
          <p className="mt-2 text-[22px] font-bold tabular-nums">{rupiah(balance)}</p>
          <p className="text-[10.5px] text-black/45">Diperbarui saat kartu terakhir ditempel</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 px-4 pt-4">
        {actions.map((a) => (
          <button
            key={a.label}
            type="button"
            onClick={() => (a.to ? go(a.to) : toast(`${a.msg}: tersedia di aplikasi`))}
            className="flex flex-col items-center gap-1.5 rounded-xl bg-white py-3 text-[10.5px] font-semibold shadow-sm active:scale-95"
          >
            <span className="grid size-8 place-items-center rounded-full" style={{ background: "#fde8e7", color: RED }}>
              <a.icon className="size-4" />
            </span>
            {a.label}
          </button>
        ))}
      </div>
      <div className="mx-4 mt-4 rounded-2xl bg-[#1b1b1f] p-4 text-white">
        <p className="text-[10.5px] uppercase tracking-wider text-white/50">Perjalanan terakhir</p>
        <p className="mt-1 text-[13px] font-semibold">Depok → Manggarai</p>
        <p className="text-[11px] text-white/60">Kemarin · 06:58 – 07:31 · {rupiah(fare("Depok", "Manggarai"))}</p>
      </div>
    </div>
  );
}

function StationPicker({ value, onChange, label }: { value: string; onChange: (v: string) => void; label: string }) {
  return (
    <label className="block">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-black/40">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-0.5 block w-full appearance-none bg-transparent text-[14px] font-bold outline-none"
      >
        {STATIONS.map(([s]) => (
          <option key={s}>{s}</option>
        ))}
      </select>
    </label>
  );
}

function Route({ from, to, setFrom, setTo }: { from: string; to: string; setFrom: (s: string) => void; setTo: (s: string) => void }) {
  return (
    <div className="relative mx-4 rounded-2xl bg-white p-3.5 shadow-sm">
      <StationPicker label="Dari" value={from} onChange={setFrom} />
      <div className="my-2 border-t border-dashed border-black/10" />
      <StationPicker label="Ke" value={to} onChange={setTo} />
      <button
        type="button"
        aria-label="Tukar stasiun"
        onClick={() => {
          setFrom(to);
          setTo(from);
        }}
        className="absolute right-3 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full text-white shadow"
        style={{ background: RED }}
      >
        <ArrowDownUp className="size-4" />
      </button>
    </div>
  );
}

function JadwalScreen({ back }: { back: () => void }) {
  const [from, setFrom] = useState("Depok");
  const [to, setTo] = useState("Manggarai");
  const trips = useMemo(() => {
    const d = Math.abs(km(from) - km(to));
    const start = 7 * 60 + 44 + (km(from) % 5);
    return Array.from({ length: 7 }, (_, i) => {
      const dep = start + i * 7 + (i % 3);
      return { dep: hm(dep), arr: hm(dep + d * 1.35 + 2), line: km(to) < km(from) ? "Jakarta Kota" : "Bogor", track: (i % 2) + 1 + (km(to) < km(from) ? 0 : 2) };
    });
  }, [from, to]);
  return (
    <div className="pb-4">
      <Header title="Jadwal" back={back} />
      <Route from={from} to={to} setFrom={setFrom} setTo={setTo} />
      <p className="px-4 pb-2 pt-4 text-[11px] font-semibold text-black/45">Keberangkatan berikutnya · {rupiah(fare(from, to))}</p>
      <ul className="space-y-2 px-4">
        {trips.map((t, i) => (
          <li key={i} className="flex items-center gap-3 rounded-xl bg-white px-3 py-2.5 shadow-sm">
            <span className="h-8 w-1 rounded-full" style={{ background: RED }} />
            <div className="flex-1">
              <p className="text-[14px] font-bold tabular-nums">{t.dep} <span className="text-[11px] font-medium text-black/40">→ {t.arr}</span></p>
              <p className="text-[10.5px] text-black/50">Tujuan {t.line} · Jalur {t.track}</p>
            </div>
            {i === 0 ? <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[9.5px] font-bold text-emerald-700">3 mnt</span> : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

function TiketScreen({ back, toast }: { back: () => void; toast: (m: string) => void }) {
  const [from, setFrom] = useState("Bogor");
  const [to, setTo] = useState("Manggarai");
  const [pax, setPax] = useState(2);
  const [paid, setPaid] = useState(false);
  const [i, setI] = useState(0);
  const total = fare(from, to) * pax;
  if (paid) {
    return (
      <div className="pb-4">
        <Header title="Tiket QR" back={() => setPaid(false)} />
        <div className="mx-4 rounded-2xl bg-white p-4 text-center shadow-sm">
          <p className="text-[11px] font-semibold text-black/45">Penumpang {i + 1} dari {pax}</p>
          <FakeQr seed={`${from}-${to}-${i}`} className="mx-auto mt-3 size-40" />
          <p className="mt-3 text-[14px] font-bold">{from} → {to}</p>
          <p className="text-[11px] text-black/50">Berlaku hari ini · pindai di gerbang</p>
          <div className="mt-3 flex justify-center gap-1.5">
            {Array.from({ length: pax }, (_, k) => (
              <button key={k} type="button" aria-label={`Tiket ${k + 1}`} onClick={() => setI(k)} className="h-2 rounded-full transition-all" style={{ width: k === i ? 18 : 8, background: k === i ? RED : "#ddd" }} />
            ))}
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="pb-4">
      <Header title="Beli tiket QR" back={back} />
      <Route from={from} to={to} setFrom={setFrom} setTo={setTo} />
      <div className="mx-4 mt-3 flex items-center justify-between rounded-2xl bg-white p-3.5 shadow-sm">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-black/40">Penumpang</p>
          <p className="text-[14px] font-bold">{pax} orang</p>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" aria-label="Kurangi" disabled={pax <= 1} onClick={() => setPax(pax - 1)} className="grid size-8 place-items-center rounded-full bg-black/5 disabled:opacity-30"><Minus className="size-4" /></button>
          <button type="button" aria-label="Tambah" disabled={pax >= 4} onClick={() => setPax(pax + 1)} className="grid size-8 place-items-center rounded-full text-white disabled:opacity-30" style={{ background: RED }}><Plus className="size-4" /></button>
        </div>
      </div>
      <div className="mx-4 mt-3 rounded-2xl bg-white p-3.5 text-[12px] shadow-sm">
        <div className="flex justify-between text-black/55"><span>Tarif per orang</span><span>{rupiah(fare(from, to))}</span></div>
        <div className="mt-1.5 flex justify-between text-[14px] font-bold"><span>Total</span><span>{rupiah(total)}</span></div>
      </div>
      <div className="px-4 pt-4">
        <button
          type="button"
          disabled={from === to}
          onClick={() => {
            setPaid(true);
            setI(0);
            toast(`${pax} tiket QR terbit`);
          }}
          className="h-11 w-full rounded-xl text-[13px] font-bold text-white disabled:opacity-40"
          style={{ background: RED }}
        >
          Bayar {rupiah(total)}
        </button>
        <p className="mt-2 text-center text-[10px] text-black/40">Maksimal 4 tiket per transaksi</p>
      </div>
    </div>
  );
}

function PosisiScreen({ back }: { back: () => void }) {
  const view = STATIONS.slice(9, 16);
  const [t, setT] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setT((x) => (x + 1) % 120), 120);
    return () => clearInterval(id);
  }, []);
  const pos = (t / 120) * (view.length - 1);
  return (
    <div className="pb-4">
      <Header title="Posisi kereta" back={back} />
      <div className="mx-4 rounded-2xl bg-white p-4 shadow-sm">
        <p className="text-[11px] font-semibold text-black/45">KRL 1121 · Tujuan Bogor</p>
        <div className="relative mt-3 pl-7">
          <div className="absolute bottom-2 left-[11px] top-2 w-[3px] rounded-full bg-black/10" />
          <div className="absolute left-[11px] top-2 w-[3px] rounded-full" style={{ height: `${(pos / (view.length - 1)) * 92}%`, background: RED }} />
          <span
            className="absolute left-0 z-10 grid size-[26px] place-items-center rounded-full text-white shadow-md transition-[top] duration-100"
            style={{ top: `calc(${(pos / (view.length - 1)) * 92}% - 4px)`, background: RED }}
          >
            <TrainFront className="size-3.5" />
          </span>
          <ul className="space-y-[18px]">
            {view.map(([s], k) => (
              <li key={s} className={cn("text-[13px]", k <= pos ? "text-black/40" : "font-semibold")}>
                {s}
                {k === Math.ceil(pos) && k > pos - 1 && pos < view.length - 1 ? (
                  <span className="ml-2 rounded-full bg-[#fde8e7] px-1.5 py-0.5 text-[9.5px] font-bold" style={{ color: RED }}>berikutnya</span>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="flex items-center gap-1.5 px-4 pt-3 text-[10.5px] text-black/45"><MapPin className="size-3" /> Posisi diperbarui setiap beberapa detik</p>
    </div>
  );
}

function SaldoScreen({ balance, back, onTopUp }: { balance: number; back: () => void; onTopUp: (n: number) => void }) {
  const [amount, setAmount] = useState(50000);
  const [phase, setPhase] = useState<"pick" | "tap" | "done">("pick");
  useEffect(() => {
    if (phase !== "tap") return;
    const id = setTimeout(() => {
      setPhase("done");
      onTopUp(amount);
    }, 2200);
    return () => clearTimeout(id);
  }, [phase, amount, onTopUp]);
  return (
    <div className="pb-4">
      <Header title="Isi saldo KMT" back={back} />
      {phase === "pick" ? (
        <div className="px-4">
          <p className="text-[11px] text-black/50">Saldo sekarang <span className="font-bold text-black">{rupiah(balance)}</span></p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {[20000, 50000, 100000, 200000].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setAmount(n)}
                className="rounded-xl border-2 bg-white py-3 text-[13px] font-bold"
                style={{ borderColor: amount === n ? RED : "transparent", color: amount === n ? RED : undefined }}
              >
                {rupiah(n)}
              </button>
            ))}
          </div>
          <button type="button" onClick={() => setPhase("tap")} className="mt-4 h-11 w-full rounded-xl text-[13px] font-bold text-white" style={{ background: RED }}>
            Lanjut ke pembayaran
          </button>
        </div>
      ) : null}
      {phase === "tap" ? (
        <div className="flex flex-col items-center px-6 pt-8 text-center">
          <span className="relative grid size-28 place-items-center rounded-full" style={{ background: "#fde8e7", color: RED }}>
            <span className="absolute inset-0 animate-ping rounded-full" style={{ background: "#fbd3d1" }} />
            <Nfc className="relative size-12" />
          </span>
          <p className="mt-6 text-[15px] font-bold">Tempelkan kartu KMT</p>
          <p className="mt-1 text-[12px] text-black/50">Letakkan kartu di belakang ponsel dan tahan sampai selesai.</p>
        </div>
      ) : null}
      {phase === "done" ? (
        <div className="flex flex-col items-center px-6 pt-8 text-center">
          <span className="grid size-20 place-items-center rounded-full bg-emerald-500 text-white"><Check className="size-10" /></span>
          <p className="mt-5 text-[15px] font-bold">Saldo berhasil ditambahkan</p>
          <p className="mt-1 text-[22px] font-bold tabular-nums">{rupiah(balance)}</p>
          <button type="button" onClick={() => setPhase("pick")} className="mt-5 text-[12px] font-semibold" style={{ color: RED }}>Isi lagi</button>
        </div>
      ) : null}
    </div>
  );
}

"use client";

import {
  Activity,
  BatteryMedium,
  Check,
  ChevronRight,
  CreditCard,
  Delete,
  History,
  LayoutDashboard,
  Lock,
  Network,
  Nfc,
  QrCode,
  Receipt,
  RefreshCw,
  Signal,
  Smartphone,
  Thermometer,
  Wallet,
  X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { DemoModal, DemoRoot, FakeQr, rupiah, useDemoScroll, useToast } from "./kit";

type View = "ringkasan" | "perangkat" | "transaksi" | "kanal" | "audit";
type Method = "Debit" | "Kredit" | "QRIS" | "E-money";
type Txn = {
  id: string;
  time: string;
  merchant: string;
  method: Method;
  amount: number;
  status: "Disetujui" | "Ditolak" | "Void";
  tid: string;
};
type Device = {
  sn: string;
  model: string;
  merchant: string;
  online: boolean;
  battery: number;
  signal: number;
  temp: number;
  version: string;
};

const MERCHANTS = ["Kopi Senja", "Apotek Sehat", "Toko Sumber Rejeki", "Parkir Plaza Timur", "Resto Padang Sederhana", "Minimarket 24"];
const METHODS: Method[] = ["Debit", "Kredit", "QRIS", "E-money"];
const LATEST = "3.4.2";

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
}

const INITIAL_TXNS: Txn[] = (() => {
  const r = seeded(7);
  return Array.from({ length: 14 }, (_, i) => {
    const m = METHODS[Math.floor(r() * 4)];
    const mins = 42 - i * 3;
    return {
      id: `T${(8841 - i).toString()}`,
      time: `10:${String(Math.max(0, mins)).padStart(2, "0")}`,
      merchant: MERCHANTS[Math.floor(r() * MERCHANTS.length)],
      method: m,
      amount: Math.round((r() * 480 + 12) * 1000 / 500) * 500,
      status: i === 4 ? "Ditolak" : i === 9 ? "Void" : "Disetujui",
      tid: `1219${4600 + Math.floor(r() * 40)}`,
    } satisfies Txn;
  });
})();

const INITIAL_DEVICES: Device[] = [
  { sn: "F20FP-0192", model: "Feitian F20FP", merchant: "Kopi Senja", online: true, battery: 82, signal: 4, temp: 36, version: "3.4.1" },
  { sn: "F20FP-0207", model: "Feitian F20FP", merchant: "Apotek Sehat", online: true, battery: 64, signal: 3, temp: 38, version: LATEST },
  { sn: "P2-11A84", model: "Sunmi P2", merchant: "Toko Sumber Rejeki", online: true, battery: 41, signal: 4, temp: 35, version: "3.4.1" },
  { sn: "X990-6622", model: "VeriFone X990", merchant: "Parkir Plaza Timur", online: false, battery: 12, signal: 0, temp: 31, version: "3.3.8" },
  { sn: "F20FP-0233", model: "Feitian F20FP", merchant: "Resto Padang Sederhana", online: true, battery: 97, signal: 2, temp: 37, version: LATEST },
  { sn: "P2-11B02", model: "Sunmi P2", merchant: "Minimarket 24", online: true, battery: 73, signal: 4, temp: 36, version: "3.4.1" },
];

const CHANNELS = [
  { id: "deb-a", name: "Debit · Acquirer A", type: "Card present", host: "10.20.1.14:776", ms: 182 },
  { id: "cre-a", name: "Kredit · Acquirer A", type: "Card present", host: "10.20.1.14:777", ms: 205 },
  { id: "deb-b", name: "Debit · Acquirer B", type: "Card present", host: "10.31.4.2:33044", ms: 231 },
  { id: "qris", name: "QRIS · Switching", type: "QR", host: "10.40.0.8:8443", ms: 144 },
  { id: "emoney", name: "E-money · Prepaid", type: "Contactless", host: "Offline + batch", ms: 0 },
];

const HOURLY = [12, 18, 26, 34, 41, 38, 52, 61, 48, 57, 66, 44];

const methodIcon = (m: Method) =>
  m === "QRIS" ? QrCode : m === "E-money" ? Nfc : m === "Kredit" ? CreditCard : Wallet;

const NAV: { id: View; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "ringkasan", label: "Ringkasan", icon: LayoutDashboard },
  { id: "perangkat", label: "Perangkat", icon: Smartphone },
  { id: "transaksi", label: "Transaksi", icon: Receipt },
  { id: "kanal", label: "Kanal acquirer", icon: Network },
  { id: "audit", label: "Audit trail", icon: History },
];

function nowTime() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export default function OmnipayConsole() {
  const [view, setView] = useState<View>("ringkasan");
  const [txns, setTxns] = useState<Txn[]>(INITIAL_TXNS);
  const [devices, setDevices] = useState<Device[]>(INITIAL_DEVICES);
  const [channels, setChannels] = useState<Record<string, boolean>>(
    Object.fromEntries(CHANNELS.map((c) => [c.id, true])),
  );
  const [audit, setAudit] = useState<{ what: string; by: string; at: string }[]>([
    { what: "Login ke konsol", by: "admin", at: "10:02" },
    { what: "Ekspor settlement harian (CSV)", by: "finance", at: "09:41" },
    { what: "Perangkat P2-11B02 didaftarkan ke Minimarket 24", by: "admin", at: "Kemarin" },
    { what: "Kanal QRIS · Switching diperbarui", by: "ops", at: "Kemarin" },
  ]);
  const [filter, setFilter] = useState<"Semua" | Method>("Semua");
  const [device, setDevice] = useState<Device | null>(null);
  const [sim, setSim] = useState(false);
  const [fresh, setFresh] = useState<string | null>(null);
  const toast = useToast();
  const { ref, toTop } = useDemoScroll();

  const log = useCallback((what: string, by = "admin") => {
    setAudit((a) => [{ what, by, at: nowTime() }, ...a].slice(0, 30));
  }, []);

  // Background traffic so the dashboard feels alive.
  useEffect(() => {
    const r = seeded(Date.now() % 100000);
    const id = setInterval(() => {
      if (document.hidden) return;
      const t: Txn = {
        id: `T${Math.floor(9000 + r() * 999)}`,
        time: nowTime(),
        merchant: MERCHANTS[Math.floor(r() * MERCHANTS.length)],
        method: METHODS[Math.floor(r() * 4)],
        amount: Math.round((r() * 300 + 8) * 2) * 500,
        status: r() < 0.06 ? "Ditolak" : "Disetujui",
        tid: `1219${4600 + Math.floor(r() * 40)}`,
      };
      setTxns((x) => [t, ...x].slice(0, 60));
      setFresh(t.id);
    }, 4200);
    return () => clearInterval(id);
  }, []);

  const go = (v: View) => {
    setView(v);
    toTop();
  };

  const approved = txns.filter((t) => t.status === "Disetujui");
  const volume = approved.reduce((n, t) => n + t.amount, 0) + 48_250_000;
  const count = approved.length + 1260;
  const online = devices.filter((d) => d.online).length;
  const mix = METHODS.map((m) => ({ m, n: approved.filter((t) => t.method === m).length + { Debit: 410, Kredit: 160, QRIS: 520, "E-money": 170 }[m] }));
  const mixTotal = mix.reduce((n, x) => n + x.n, 0);

  const shownTxns = filter === "Semua" ? txns : txns.filter((t) => t.method === filter);

  const onPaid = (t: Txn) => {
    setTxns((x) => [t, ...x]);
    setFresh(t.id);
    log(`Transaksi ${t.method} ${rupiah(t.amount)} di ${t.merchant} (TID ${t.tid})`, "EDC F20FP-0192");
    toast.show(`Transaksi ${rupiah(t.amount)} masuk ke konsol`);
  };

  return (
    <DemoRoot
      className="overflow-hidden bg-[#f4f5f8] text-[#0e1220]"
      overlay={
        <>
          {toast.node}
          {device ? (
            <DeviceDrawer
              device={devices.find((d) => d.sn === device.sn) ?? device}
              onClose={() => setDevice(null)}
              onUpdated={(sn) => {
                setDevices((ds) => ds.map((d) => (d.sn === sn ? { ...d, version: LATEST } : d)));
                log(`OTA ${LATEST} terpasang di ${sn}`);
                toast.show(`Pembaruan OTA ${LATEST} terpasang`);
              }}
              onPing={(sn) => {
                log(`Ping lokasi perangkat ${sn}`);
                toast.show("Perangkat merespons dalam 180 ms");
              }}
            />
          ) : null}
          <DemoModal open={sim} onClose={() => setSim(false)} label="Simulasi terminal EDC" className="max-w-[380px] bg-transparent shadow-none">
            <EdcTerminal onClose={() => setSim(false)} onPaid={onPaid} />
          </DemoModal>
        </>
      }
    >
      <div className="flex h-full">
        {/* Sidebar */}
        <aside className="hidden h-full w-52 shrink-0 flex-col bg-[#0e1220] p-4 text-white/70 @3xl:flex">
          <div className="mb-6 flex items-center gap-2 px-2 pt-1">
            <span className="grid size-7 place-items-center rounded-lg bg-[#e8501e] text-[13px] font-bold text-white">O</span>
            <span className="text-[15px] font-semibold text-white">OmniPay</span>
          </div>
          <nav className="space-y-1">
            {NAV.map((n) => (
              <button
                key={n.id}
                type="button"
                data-shot={n.id === "perangkat" ? "2" : undefined}
                onClick={() => go(n.id)}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[13px] transition-colors",
                  view === n.id ? "bg-white/10 font-medium text-white" : "hover:bg-white/5 hover:text-white",
                )}
              >
                <n.icon className="size-4" strokeWidth={1.75} />
                {n.label}
              </button>
            ))}
          </nav>
          <div className="mt-auto rounded-xl bg-white/5 p-3 text-[11px] leading-relaxed">
            <p className="flex items-center gap-1.5 font-medium text-white">
              <Lock className="size-3.5 text-[#f6a17f]" /> TLE aktif
            </p>
            <p className="mt-1 text-white/55">Semua transaksi terenkripsi dari terminal sampai host bank.</p>
          </div>
        </aside>

        <div ref={ref} data-demo-scroll className="scrollbar-thin h-full min-w-0 flex-1 overflow-y-auto">
          {/* Top bar */}
          <header className="sticky top-0 z-20 border-b border-black/5 bg-white/85 backdrop-blur">
            <div className="flex items-center gap-3 px-4 py-3 @3xl:px-6">
              <span className="grid size-7 place-items-center rounded-lg bg-[#e8501e] text-[13px] font-bold text-white @3xl:hidden">O</span>
              <div className="min-w-0">
                <p className="hidden text-[11px] uppercase tracking-[0.14em] text-black/45 @xl:block">Konsol merchant</p>
                <h3 className="truncate text-[15px] font-semibold">{NAV.find((n) => n.id === view)?.label}</h3>
              </div>
              <span className="ml-auto hidden items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700 @xl:inline-flex">
                <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" /> Live
              </span>
              <button
                type="button"
                data-shot="1"
                onClick={() => setSim(true)}
                className="ml-auto inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-[#e8501e] px-3 py-2 text-[12.5px] font-semibold text-white shadow-sm transition hover:bg-[#c9410f] @xl:ml-0"
              >
                <Smartphone className="size-4" /> <span className="@xl:hidden">Simulasi</span><span className="hidden @xl:inline">Simulasikan transaksi</span>
              </button>
            </div>
            <nav className="scrollbar-none flex gap-1 overflow-x-auto px-3 pb-2 @3xl:hidden">
              {NAV.map((n) => (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => go(n.id)}
                  className={cn(
                    "shrink-0 rounded-full px-3 py-1.5 text-[12px] font-medium",
                    view === n.id ? "bg-[#0e1220] text-white" : "bg-black/5 text-black/60",
                  )}
                >
                  {n.label}
                </button>
              ))}
            </nav>
          </header>

          <main className="p-4 @3xl:p-6">
            {view === "ringkasan" ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 @4xl:grid-cols-4">
                  <Kpi label="Volume hari ini" value={rupiah(volume)} hint="+12,4% vs kemarin" />
                  <Kpi label="Transaksi berhasil" value={count.toLocaleString("id-ID")} hint="98,7% tingkat sukses" />
                  <Kpi label="Perangkat online" value={`${online}/${devices.length}`} hint="1 perlu dicek" warn={online < devices.length} />
                  <Kpi label="Settlement berikutnya" value="23:00" hint="Batch otomatis" />
                </div>
                <div className="grid gap-4 @4xl:grid-cols-[1.4fr_1fr]">
                  <Panel title="Volume per jam" action="Hari ini">
                    <div className="flex h-40 items-end gap-1.5 pt-2">
                      {HOURLY.map((v, i) => (
                        <div key={i} className="group flex h-full flex-1 flex-col items-center justify-end gap-1">
                          <div
                            className={cn(
                              "w-full rounded-t-md transition-colors",
                              i === HOURLY.length - 1 ? "bg-[#e8501e]" : "bg-[#0e1220]/80 group-hover:bg-[#0e1220]",
                            )}
                            style={{ height: `${(v / 70) * 100}%` }}
                            title={`${String(i + 8).padStart(2, "0")}:00 · ${v} jt`}
                          />
                          <span className="text-[9.5px] text-black/40">{i + 8}</span>
                        </div>
                      ))}
                    </div>
                  </Panel>
                  <Panel title="Metode pembayaran">
                    <ul className="space-y-3">
                      {mix.map(({ m, n }) => {
                        const I = methodIcon(m);
                        const pct = Math.round((n / mixTotal) * 100);
                        return (
                          <li key={m}>
                            <div className="mb-1 flex items-center justify-between text-[12.5px]">
                              <span className="flex items-center gap-2"><I className="size-3.5 text-black/50" />{m}</span>
                              <span className="tabular-nums text-black/55">{pct}%</span>
                            </div>
                            <div className="h-1.5 rounded-full bg-black/5">
                              <div className="h-full rounded-full bg-[#e8501e]" style={{ width: `${pct}%`, opacity: 0.45 + pct / 80 }} />
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </Panel>
                </div>
                <Panel title="Transaksi terbaru" action={<button type="button" onClick={() => go("transaksi")} className="text-[12px] font-medium text-[#c2410c]">Lihat semua</button>}>
                  <TxnTable txns={txns.slice(0, 6)} fresh={fresh} compact />
                </Panel>
              </div>
            ) : null}

            {view === "perangkat" ? (
              <Panel title={`${devices.length} perangkat terdaftar`} action={`${online} online`}>
                <div className="grid gap-3 @2xl:grid-cols-2 @4xl:grid-cols-3">
                  {devices.map((d) => (
                    <button
                      key={d.sn}
                      type="button"
                      onClick={() => setDevice(d)}
                      className="group rounded-xl border border-black/5 bg-white p-3.5 text-left transition hover:border-black/15 hover:shadow-md"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-mono text-[12.5px] font-semibold">{d.sn}</p>
                          <p className="text-[11.5px] text-black/50">{d.model}</p>
                        </div>
                        <span className={cn("rounded-full px-2 py-0.5 text-[10.5px] font-semibold", d.online ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600")}>
                          {d.online ? "Online" : "Offline"}
                        </span>
                      </div>
                      <p className="mt-3 truncate text-[12.5px]">{d.merchant}</p>
                      <div className="mt-2 flex items-center gap-3 text-[11px] text-black/50">
                        <span className="flex items-center gap-1"><BatteryMedium className="size-3.5" />{d.battery}%</span>
                        <span className="flex items-center gap-1"><Signal className="size-3.5" />{d.signal}/4</span>
                        <span className={cn("ml-auto font-mono", d.version !== LATEST && "text-[#c2410c]")}>v{d.version}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </Panel>
            ) : null}

            {view === "transaksi" ? (
              <Panel
                title="Laporan transaksi"
                action={
                  <button type="button" onClick={() => { log("Ekspor laporan transaksi (CSV)"); toast.show("Laporan CSV disiapkan"); }} className="rounded-md border border-black/10 px-2.5 py-1 text-[12px] font-medium">
                    Ekspor CSV
                  </button>
                }
              >
                <div className="mb-3 flex flex-wrap gap-1.5">
                  {(["Semua", ...METHODS] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setFilter(m)}
                      className={cn("rounded-full px-3 py-1 text-[12px] font-medium", filter === m ? "bg-[#0e1220] text-white" : "bg-black/5 text-black/60 hover:bg-black/10")}
                    >
                      {m}
                    </button>
                  ))}
                </div>
                <TxnTable txns={shownTxns.slice(0, 16)} fresh={fresh} />
              </Panel>
            ) : null}

            {view === "kanal" ? (
              <Panel title="Multi-acquiring" action="Rute transaksi per jenis kartu">
                <ul className="divide-y divide-black/5">
                  {CHANNELS.map((c) => {
                    const on = channels[c.id];
                    return (
                      <li key={c.id} className="flex items-center gap-3 py-3">
                        <span className={cn("grid size-9 shrink-0 place-items-center rounded-lg", on ? "bg-[#fff4ee] text-[#c2410c]" : "bg-black/5 text-black/35")}>
                          <Network className="size-4" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[13px] font-medium">{c.name}</p>
                          <p className="truncate font-mono text-[11px] text-black/45">{c.type} · {c.host}</p>
                        </div>
                        <span className="hidden text-[11.5px] tabular-nums text-black/45 @xl:block">{on ? (c.ms ? `${c.ms} ms` : "batch") : "nonaktif"}</span>
                        <button
                          type="button"
                          role="switch"
                          aria-checked={on}
                          aria-label={`Aktifkan ${c.name}`}
                          onClick={() => {
                            setChannels((s) => ({ ...s, [c.id]: !on }));
                            log(`Kanal ${c.name} ${on ? "dinonaktifkan" : "diaktifkan"}`, "ops");
                            toast.show(on ? `${c.name} dinonaktifkan, rute dialihkan` : `${c.name} aktif kembali`);
                          }}
                          className={cn("relative h-6 w-11 shrink-0 rounded-full transition-colors", on ? "bg-[#e8501e]" : "bg-black/15")}
                        >
                          <span className={cn("absolute top-0.5 size-5 rounded-full bg-white shadow transition-all", on ? "left-[22px]" : "left-0.5")} />
                        </button>
                      </li>
                    );
                  })}
                </ul>
                <Topology />
              </Panel>
            ) : null}

            {view === "audit" ? (
              <Panel title="Audit trail" action="Setiap perubahan tercatat">
                <ol className="relative space-y-4 border-l border-black/10 pl-5">
                  {audit.map((a, i) => (
                    <li key={`${a.what}-${i}`} className="relative">
                      <span className="absolute -left-[25px] top-1 size-2.5 rounded-full border-2 border-white bg-[#e8501e]" />
                      <p className="text-[13px]">{a.what}</p>
                      <p className="text-[11.5px] text-black/45">{a.by} · {a.at}</p>
                    </li>
                  ))}
                </ol>
              </Panel>
            ) : null}
          </main>
        </div>
      </div>
    </DemoRoot>
  );
}

function Kpi({ label, value, hint, warn }: { label: string; value: string; hint: string; warn?: boolean }) {
  return (
    <div className="rounded-xl border border-black/5 bg-white p-3.5">
      <p className="text-[11.5px] text-black/50">{label}</p>
      <p className="mt-1 truncate text-[16px] font-semibold tabular-nums tracking-tight @xl:text-[19px] @4xl:text-[21px]">{value}</p>
      <p className={cn("mt-1 text-[11px]", warn ? "text-[#c2410c]" : "text-emerald-600")}>{hint}</p>
    </div>
  );
}

function Panel({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-black/5 bg-white p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h4 className="text-[13.5px] font-semibold">{title}</h4>
        {typeof action === "string" ? <span className="text-[11.5px] text-black/45">{action}</span> : action}
      </div>
      {children}
    </section>
  );
}

function TxnTable({ txns, fresh, compact }: { txns: Txn[]; fresh: string | null; compact?: boolean }) {
  return (
    <div className="-mx-1 overflow-x-auto">
      <table className="w-full min-w-[520px] text-left text-[12.5px]">
        <thead className="text-[11px] uppercase tracking-wider text-black/40">
          <tr>
            <th className="px-1 pb-2 font-medium">Waktu</th>
            <th className="px-1 pb-2 font-medium">Merchant</th>
            <th className="px-1 pb-2 font-medium">Metode</th>
            {!compact ? <th className="px-1 pb-2 font-medium">TID</th> : null}
            <th className="px-1 pb-2 text-right font-medium">Nominal</th>
            <th className="px-1 pb-2 text-right font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {txns.map((t) => {
            const I = methodIcon(t.method);
            return (
              <tr key={t.id + t.time} className={cn("border-t border-black/5 transition-colors duration-1000", fresh === t.id && "bg-[#fff4ee]")}>
                <td className="px-1 py-2 tabular-nums text-black/55">{t.time}</td>
                <td className="max-w-[160px] truncate px-1 py-2">{t.merchant}</td>
                <td className="px-1 py-2"><span className="inline-flex items-center gap-1.5"><I className="size-3.5 text-black/45" />{t.method}</span></td>
                {!compact ? <td className="px-1 py-2 font-mono text-[11.5px] text-black/50">{t.tid}</td> : null}
                <td className="px-1 py-2 text-right font-medium tabular-nums">{rupiah(t.amount)}</td>
                <td className="px-1 py-2 text-right">
                  <span className={cn("rounded-full px-2 py-0.5 text-[10.5px] font-semibold", t.status === "Disetujui" ? "bg-emerald-50 text-emerald-700" : t.status === "Void" ? "bg-black/5 text-black/55" : "bg-red-50 text-red-600")}>
                    {t.status}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function Topology() {
  const nodes = ["Terminal EDC", "OmniPay", "Host bank"];
  return (
    <div className="mt-4 rounded-xl bg-[#0e1220] p-4 text-white">
      <p className="mb-3 text-[11px] uppercase tracking-[0.14em] text-white/50">Topologi transaksi</p>
      <div className="flex items-center gap-2">
        {nodes.map((n, i) => (
          <div key={n} className="contents">
            <div className="flex-1 rounded-lg border border-white/10 bg-white/5 px-2 py-2.5 text-center text-[11.5px] font-medium">{n}</div>
            {i < nodes.length - 1 ? (
              <div className="relative h-px w-10 shrink-0 bg-white/20 @xl:w-16">
                <span className="absolute -top-[3px] size-[7px] animate-[op-flow_1.6s_linear_infinite] rounded-full bg-[#f6a17f]" />
                <Lock className="absolute -top-5 left-1/2 size-3 -translate-x-1/2 text-white/50" />
              </div>
            ) : null}
          </div>
        ))}
      </div>
      <p className="mt-3 text-[11px] text-white/45">DUKPT di terminal, TLE ke host bank. Kanal nonaktif dialihkan otomatis.</p>
      <style>{`@keyframes op-flow{from{left:0}to{left:calc(100% - 7px)}}`}</style>
    </div>
  );
}

function DeviceDrawer({
  device,
  onClose,
  onUpdated,
  onPing,
}: {
  device: Device;
  onClose: () => void;
  onUpdated: (sn: string) => void;
  onPing: (sn: string) => void;
}) {
  const [ota, setOta] = useState<number | null>(null);
  useEffect(() => {
    if (ota === null || ota >= 100) return;
    const t = setTimeout(() => setOta((p) => Math.min(100, (p ?? 0) + 7 + Math.random() * 9)), 140);
    return () => clearTimeout(t);
  }, [ota]);
  useEffect(() => {
    if (ota !== null && ota >= 100) onUpdated(device.sn);
  }, [ota, device.sn, onUpdated]);
  const upToDate = device.version === LATEST;
  const stats = [
    { icon: BatteryMedium, label: "Baterai", value: `${device.battery}%` },
    { icon: Thermometer, label: "Suhu", value: `${device.temp}°C` },
    { icon: Signal, label: "Sinyal 4G", value: `${device.signal}/4` },
    { icon: Activity, label: "Kartu dibaca", value: "422 kali" },
  ];
  return (
    <div className="absolute inset-0 z-30 flex justify-end">
      <button type="button" aria-label="Tutup detail" onClick={onClose} className="absolute inset-0 bg-black/30" />
      <aside role="dialog" aria-label={`Detail ${device.sn}`} className="relative h-full w-full max-w-sm overflow-y-auto bg-white p-5 shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-mono text-[15px] font-semibold">{device.sn}</p>
            <p className="text-[12px] text-black/50">{device.model} · {device.merchant}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Tutup" className="rounded-md p-1 text-black/50 hover:bg-black/5"><X className="size-4" /></button>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-2">
          {stats.map((s) => (
            <div key={s.label} className="rounded-lg bg-[#f4f5f8] p-3">
              <s.icon className="size-4 text-black/45" />
              <p className="mt-2 text-[15px] font-semibold">{s.value}</p>
              <p className="text-[11px] text-black/45">{s.label}</p>
            </div>
          ))}
        </div>
        <div className="mt-5 rounded-xl border border-black/5 p-4">
          <p className="text-[12px] text-black/50">Aplikasi OmniPay</p>
          <p className="mt-0.5 font-mono text-[14px] font-semibold">v{device.version}{upToDate ? " · terbaru" : ""}</p>
          {ota !== null && ota < 100 ? (
            <div className="mt-3">
              <div className="h-2 rounded-full bg-black/5"><div className="h-full rounded-full bg-[#e8501e] transition-all" style={{ width: `${ota}%` }} /></div>
              <p className="mt-1.5 text-[11.5px] text-black/50">Mengirim paket OTA… {Math.floor(ota)}%</p>
            </div>
          ) : (
            <button
              type="button"
              disabled={upToDate || !device.online}
              onClick={() => setOta(0)}
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#0e1220] py-2.5 text-[12.5px] font-semibold text-white disabled:bg-black/10 disabled:text-black/40"
            >
              <RefreshCw className="size-4" />
              {upToDate ? "Sudah versi terbaru" : !device.online ? "Perangkat offline" : `Perbarui ke v${LATEST} (OTA)`}
            </button>
          )}
        </div>
        <button type="button" onClick={() => onPing(device.sn)} className="mt-3 w-full rounded-lg border border-black/10 py-2.5 text-[12.5px] font-medium hover:bg-black/5">
          Ping & cek lokasi
        </button>
      </aside>
    </div>
  );
}

type Step = "amount" | "method" | "tap" | "process" | "done";

function EdcTerminal({ onClose, onPaid }: { onClose: () => void; onPaid: (t: Txn) => void }) {
  const [step, setStep] = useState<Step>("amount");
  const [digits, setDigits] = useState("75000");
  const [method, setMethod] = useState<Method>("Debit");
  const amount = Number(digits || "0");
  const [ref, setRef] = useState("000000");

  useEffect(() => {
    if (step !== "process") return;
    const t = setTimeout(() => setStep("done"), 1600);
    return () => clearTimeout(t);
  }, [step]);

  const finish = () => {
    onPaid({ id: `S${ref}`, time: nowTime(), merchant: "Kopi Senja", method, amount, status: "Disetujui", tid: "12194619" });
    onClose();
  };

  const key = (k: string) => {
    if (k === "del") setDigits((d) => d.slice(0, -1));
    else if (k === "000") setDigits((d) => (d && d.length < 7 ? d + "000" : d));
    else setDigits((d) => (d.length < 9 ? (d === "0" ? k : d + k) : d));
  };

  return (
    <div className="mx-auto w-[300px]">
      {/* Terminal body */}
      <div className="relative rounded-[30px] bg-gradient-to-b from-[#3a3f45] to-[#24282c] p-3 pb-5 shadow-2xl ring-1 ring-black/40">
        <div className="mx-auto mb-2 flex h-6 w-40 items-center justify-center rounded-b-xl bg-[#1b1e21]">
          <span className="h-1 w-16 rounded-full bg-[#9be15d]/80" />
        </div>
        {step === "done" ? (
          <div className="pointer-events-none absolute -top-2 left-1/2 z-10 w-44 -translate-x-1/2 -translate-y-full animate-[slip_0.9s_ease-out_both] rounded-t-sm bg-white px-3 pb-3 pt-2 font-mono text-[9.5px] leading-snug text-black shadow-md">
            <p className="text-center font-bold">KOPI SENJA</p>
            <p className="text-center">TID 12194619 · REF {ref}</p>
            <p className="mt-1 flex justify-between"><span>{method.toUpperCase()}</span><span>SALE</span></p>
            <p className="flex justify-between font-bold"><span>TOTAL</span><span>{rupiah(amount)}</span></p>
            <p className="mt-1 text-center">*** APPROVED ***</p>
          </div>
        ) : null}
        <div className="flex h-[360px] flex-col overflow-hidden rounded-[18px] bg-white">
          <div className="flex items-center justify-between bg-[#0e1220] px-3 py-1.5 text-[10px] text-white/70">
            <span>OmniPay EDC</span>
            <span className="flex items-center gap-1"><Lock className="size-3" />TLE · 4G</span>
          </div>
          {step === "amount" ? (
            <div className="flex flex-1 flex-col p-3">
              <p className="text-[11px] text-black/50">Masukkan nominal</p>
              <p className="mt-1 truncate text-right text-[26px] font-semibold tabular-nums">{rupiah(amount)}</p>
              <div className="mt-auto grid grid-cols-3 gap-1.5">
                {["1", "2", "3", "4", "5", "6", "7", "8", "9", "000", "0", "del"].map((k) => (
                  <button key={k} type="button" onClick={() => key(k)} className="grid h-10 place-items-center rounded-lg bg-[#f1f2f4] text-[15px] font-semibold active:bg-black/10">
                    {k === "del" ? <Delete className="size-4" /> : k}
                  </button>
                ))}
              </div>
              <button type="button" disabled={amount < 1000} onClick={() => setStep("method")} className="mt-2 h-10 rounded-lg bg-[#12a150] text-[13px] font-semibold text-white disabled:opacity-40">
                Lanjut
              </button>
            </div>
          ) : null}
          {step === "method" ? (
            <div className="flex flex-1 flex-col gap-2 p-3">
              <p className="text-[11px] text-black/50">Pilih metode · {rupiah(amount)}</p>
              {METHODS.map((m) => {
                const I = methodIcon(m);
                return (
                  <button key={m} type="button" onClick={() => { setMethod(m); setStep("tap"); }} className="flex items-center gap-3 rounded-xl border border-black/10 px-3 py-3 text-left text-[13.5px] font-medium hover:border-[#12a150] hover:bg-[#12a150]/5">
                    <I className="size-5 text-black/55" />
                    {m === "Debit" || m === "Kredit" ? `Kartu ${m.toLowerCase()}` : m}
                    <ChevronRight className="ml-auto size-4 text-black/30" />
                  </button>
                );
              })}
              <button type="button" onClick={() => setStep("amount")} className="mt-auto text-[12px] text-black/50">Kembali</button>
            </div>
          ) : null}
          {step === "tap" ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 p-4 text-center">
              {method === "QRIS" ? (
                <>
                  <FakeQr seed={`${amount}-${ref}`} className="size-36 rounded-md border border-black/10 p-1.5" />
                  <p className="text-[12px] text-black/55">Pindai QRIS dengan aplikasi bank atau e-wallet</p>
                  <button type="button" onClick={() => { setRef(String(Math.floor(100000 + Math.random() * 899999))); setStep("process"); }} className="h-10 w-full rounded-lg bg-[#12a150] text-[13px] font-semibold text-white">Pelanggan sudah membayar</button>
                </>
              ) : (
                <>
                  <span className="relative grid size-24 place-items-center rounded-full bg-[#12a150]/10 text-[#12a150]">
                    <span className="absolute inset-0 animate-ping rounded-full bg-[#12a150]/15" />
                    <Nfc className="size-10" />
                  </span>
                  <p className="text-[15px] font-semibold">{rupiah(amount)}</p>
                  <p className="text-[12px] text-black/55">{method === "E-money" ? "Tempelkan kartu e-money" : "Tempel, masukkan, atau gesek kartu"}</p>
                  <button type="button" onClick={() => { setRef(String(Math.floor(100000 + Math.random() * 899999))); setStep("process"); }} className="h-10 w-full rounded-lg bg-[#12a150] text-[13px] font-semibold text-white">Tempelkan kartu</button>
                </>
              )}
            </div>
          ) : null}
          {step === "process" ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 p-4 text-center">
              <span className="size-10 animate-spin rounded-full border-4 border-black/10 border-t-[#12a150]" />
              <p className="text-[13px] font-semibold">Memproses…</p>
              <p className="flex items-center gap-1 text-[11px] text-black/50"><Lock className="size-3" /> Data dienkripsi (TLE) ke host bank</p>
            </div>
          ) : null}
          {step === "done" ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 p-4 text-center">
              <span className="grid size-16 place-items-center rounded-full bg-[#12a150] text-white"><Check className="size-8" /></span>
              <p className="text-[16px] font-semibold">Transaksi disetujui</p>
              <p className="text-[12px] text-black/55">{method} · {rupiah(amount)}</p>
              <button type="button" onClick={finish} className="mt-2 h-10 w-full rounded-lg bg-[#0e1220] text-[13px] font-semibold text-white">Selesai & kirim ke konsol</button>
            </div>
          ) : null}
        </div>
        <div className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-[#9be15d]/70" />
      </div>
      <button type="button" onClick={onClose} className="mx-auto mt-3 block rounded-full bg-white/90 px-4 py-1.5 text-[12px] font-medium text-black/70 shadow">Tutup simulator</button>
      <style>{`@keyframes slip{from{transform:translate(-50%,40%);opacity:0}to{transform:translate(-50%,-100%);opacity:1}}`}</style>
    </div>
  );
}

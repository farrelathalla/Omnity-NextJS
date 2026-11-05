"use client";

import { useRouter } from "next/navigation";
import { useId, useMemo, useState, useTransition } from "react";
import { approveQuote, requestRevision, type DeliverableResult } from "@/app/actions/deliverables";
import { Icon } from "@/components/icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Textarea } from "@/components/ui/form";
import { computeTotals, formatRupiah, type QuoteItem } from "@/lib/quote";
import { cn } from "@/lib/utils";

export type ViewerItem = {
  id: number;
  title: string;
  device: string;
  kind: string;
  fileId: string | null;
  url: string | null;
  note: string | null;
};
export type ViewerVersion = { version: number; items: ViewerItem[] };

function Notice({ r }: { r: DeliverableResult | null }) {
  if (!r) return null;
  return r.ok ? (
    <p role="status" className="rounded-lg bg-leaf-50 px-3 py-2 text-sm text-leaf">{r.message}</p>
  ) : (
    <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{r.error}</p>
  );
}

function useAction() {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [result, setResult] = useState<DeliverableResult | null>(null);
  const run = (fn: () => Promise<DeliverableResult>) =>
    start(async () => {
      const r = await fn().catch(() => ({ ok: false as const, error: "Terjadi kesalahan. Coba lagi." }));
      setResult(r);
      router.refresh();
    });
  return { pending, result, run };
}

/** Full-size, scrollable preview of the published mockup with a desktop/mobile toggle. */
export function MockupViewer({
  projectId,
  versions,
  canRevise,
}: {
  projectId: string;
  versions: ViewerVersion[];
  canRevise: boolean;
}) {
  const uid = useId();
  const latest = versions[versions.length - 1];
  const [version, setVersion] = useState(latest.version);
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [active, setActive] = useState(0);
  const [full, setFull] = useState(false);
  const [note, setNote] = useState("");
  const { pending, result, run } = useAction();

  const current = versions.find((v) => v.version === version) ?? latest;
  const filtered = useMemo(() => {
    const match = current.items.filter((i) => i.device === device || i.device === "any");
    return match.length ? match : current.items;
  }, [current, device]);
  const item = filtered[Math.min(active, filtered.length - 1)];
  const src = item.fileId ? `/api/files/${item.fileId}` : null;
  const mobile = device === "mobile";

  const frame = (
    <div className={cn("mx-auto transition-[max-width] duration-300", mobile ? "max-w-[340px]" : "max-w-full")}>
      <div
        className={cn(
          "overflow-hidden border border-line bg-surface shadow-pop",
          mobile ? "rounded-[2.2rem] border-[8px] border-ink" : "rounded-xl",
        )}
      >
        {!mobile ? (
          <div className="flex h-9 items-center gap-1.5 border-b border-line bg-sand px-3.5" aria-hidden="true">
            <span className="size-2.5 rounded-full bg-ink/15" />
            <span className="size-2.5 rounded-full bg-ink/15" />
            <span className="size-2.5 rounded-full bg-ink/15" />
            <span className="mx-auto max-w-[60%] truncate rounded-md bg-surface px-3 py-0.5 text-[0.7rem] text-muted">{item.title}</span>
          </div>
        ) : null}
        <div className={cn("overflow-auto bg-surface", full ? "max-h-[78vh]" : mobile ? "max-h-[640px]" : "max-h-[70vh]")}>
          {item.kind === "image" && src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={src} alt={`Mockup ${item.title}`} className="block h-auto w-full" />
          ) : item.kind === "pdf" && src ? (
            <iframe src={src} title={`Mockup ${item.title} (PDF)`} className="h-[70vh] w-full" />
          ) : item.url ? (
            <div className="flex min-h-64 flex-col items-center justify-center gap-4 p-8 text-center">
              <Icon name="link" className="size-8" />
              <p className="max-w-sm text-sm text-muted">Mockup ini berupa prototipe online (mis. Figma).</p>
              <a href={item.url} target="_blank" rel="noopener noreferrer" className="inline-flex h-11 items-center gap-2 rounded-full bg-ink px-6 text-sm font-medium text-white">
                Buka prototipe <Icon name="arrow-up-right" className="size-4" />
              </a>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          {versions.length > 1 ? (
            <label className="flex items-center gap-2 text-sm">
              <span className="text-muted">Versi</span>
              <select
                value={version}
                onChange={(e) => {
                  setVersion(Number(e.target.value));
                  setActive(0);
                }}
                className="h-9 rounded-lg border border-line bg-surface px-2 text-sm"
              >
                {versions.map((v) => (
                  <option key={v.version} value={v.version}>
                    v{v.version}
                    {v.version === latest.version ? " (terbaru)" : ""}
                  </option>
                ))}
              </select>
            </label>
          ) : (
            <Badge tone="brand">Versi {latest.version}</Badge>
          )}
          <div role="group" aria-label="Tampilan layar" className="flex gap-1 rounded-full border border-line bg-ink/[0.04] p-1">
            {(["desktop", "mobile"] as const).map((d) => (
              <button
                key={d}
                type="button"
                aria-pressed={device === d}
                onClick={() => {
                  setDevice(d);
                  setActive(0);
                }}
                className={cn("inline-flex h-8 items-center gap-1.5 rounded-full px-3.5 text-sm font-medium transition-colors", device === d ? "bg-surface text-ink shadow-card ring-1 ring-line" : "text-muted hover:text-ink")}
              >
                <Icon name={d === "desktop" ? "monitor" : "smartphone"} className="size-4" />
                {d === "desktop" ? "Desktop" : "Mobile"}
              </button>
            ))}
          </div>
        </div>
        <button type="button" onClick={() => setFull(true)} className="text-sm font-semibold text-accent hover:underline">
          Layar penuh
        </button>
      </div>

      {filtered.length > 1 ? (
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Halaman mockup">
          {filtered.map((it, i) => (
            <button key={it.id} role="tab" type="button" aria-selected={i === active} onClick={() => setActive(i)} className={cn("h-9 rounded-full border px-4 text-sm font-medium", i === active ? "border-ink bg-ink text-white" : "border-line bg-surface hover:border-ink/30")}>
              {it.title}
            </button>
          ))}
        </div>
      ) : null}

      {frame}
      {item.note ? <p className="mx-auto max-w-2xl text-center text-sm text-muted">{item.note}</p> : null}

      {full ? (
        <div role="dialog" aria-modal="true" aria-label="Mockup layar penuh" className="fixed inset-0 z-[90] overflow-auto bg-canvas p-4 sm:p-8">
          <div className="mx-auto mb-4 flex max-w-6xl items-center justify-between">
            <p className="font-serif text-2xl">{item.title}</p>
            <button type="button" onClick={() => setFull(false)} className="inline-flex h-10 items-center gap-2 rounded-full border border-line bg-surface px-4 text-sm font-medium">
              <Icon name="x" className="size-4" /> Tutup
            </button>
          </div>
          <div className="mx-auto max-w-6xl">{frame}</div>
        </div>
      ) : null}

      {canRevise ? (
        <Card className="p-5 sm:p-6">
          <h3 className="font-serif text-2xl tracking-tight">Ada yang perlu diubah?</h3>
          <p className="mb-4 mt-1 text-sm text-muted">Tulis catatan revisi. Tim kami memperbarui mockup lalu memberi kabar.</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              run(async () => {
                const r = await requestRevision({ id: projectId, note });
                if (r.ok) setNote("");
                return r;
              });
            }}
            className="space-y-3"
          >
            <Field label="Catatan revisi" htmlFor={`${uid}-rev`}>
              <Textarea id={`${uid}-rev`} value={note} onChange={(e) => setNote(e.target.value)} rows={4} maxLength={2000} placeholder="Mis. Ganti warna utama menjadi biru tua dan perbesar logo di header." />
            </Field>
            <Notice r={result} />
            <Button type="submit" variant="secondary" disabled={pending || note.trim().length < 10}>
              {pending ? "Mengirim..." : "Minta revisi"}
            </Button>
          </form>
        </Card>
      ) : null}
    </div>
  );
}

export type QuoteViewData = {
  id: number;
  version: number;
  status: string;
  items: QuoteItem[];
  discount: number;
  dpPercent: number;
  timeline: string;
  validUntil: string | null;
  expired: boolean;
  scope: string | null;
  revisions: number;
  domainHosting: string;
  terms: string | null;
  sentAt: string | null;
  approvedAt: string | null;
};

export function QuoteView({ projectId, quote, canApprove }: { projectId: string; quote: QuoteViewData; canApprove: boolean }) {
  const t = computeTotals(quote.items, quote.discount, quote.dpPercent);
  const { pending, result, run } = useAction();
  const approved = quote.status === "approved";

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-sand/60 px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <h2 className="font-serif text-2xl tracking-tight">Penawaran v{quote.version}</h2>
            {approved ? <Badge tone="leaf">Disetujui</Badge> : quote.status === "sent" ? <Badge tone="brand">Menunggu persetujuan</Badge> : <Badge>Digantikan</Badge>}
          </div>
          <a href={`/api/quotes/${quote.id}/pdf`} target="_blank" rel="noopener" className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline">
            <Icon name="file-text" className="size-4" /> Unduh PDF
          </a>
        </div>
        <div className="overflow-x-auto px-5 py-4 sm:px-6">
          <table className="w-full min-w-[30rem] text-left text-sm">
            <thead className="text-xs uppercase tracking-wider text-muted">
              <tr><th className="py-2 font-semibold">Item</th><th className="py-2 text-right font-semibold">Jml</th><th className="py-2 text-right font-semibold">Harga</th><th className="py-2 text-right font-semibold">Total</th></tr>
            </thead>
            <tbody className="divide-y divide-line">
              {quote.items.map((it, i) => (
                <tr key={i}>
                  <td className="py-3 pr-3"><span className="font-medium">{it.label}</span>{it.detail ? <span className="block text-xs text-muted">{it.detail}</span> : null}</td>
                  <td className="py-3 text-right tabular-nums">{it.qty}</td>
                  <td className="py-3 text-right tabular-nums">{formatRupiah(it.unitPrice)}</td>
                  <td className="py-3 text-right tabular-nums">{formatRupiah(it.qty * it.unitPrice)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <dl className="ml-auto mt-4 w-full max-w-xs space-y-1.5 text-sm">
            <div className="flex justify-between"><dt className="text-muted">Subtotal</dt><dd className="tabular-nums">{formatRupiah(t.subtotal)}</dd></div>
            {t.discount > 0 ? <div className="flex justify-between"><dt className="text-muted">Diskon</dt><dd className="tabular-nums">- {formatRupiah(t.discount)}</dd></div> : null}
            <div className="flex justify-between border-t border-line pt-2 text-base font-semibold"><dt>Total</dt><dd className="tabular-nums">{formatRupiah(t.total)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted">DP {quote.dpPercent}% saat setuju</dt><dd className="tabular-nums">{formatRupiah(t.dpAmount)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted">Pelunasan sebelum live</dt><dd className="tabular-nums">{formatRupiah(t.remaining)}</dd></div>
          </dl>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        {quote.scope ? <Card className="p-5"><h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Cakupan</h3><p className="mt-2 whitespace-pre-line text-sm">{quote.scope}</p></Card> : null}
        <Card className="p-5">
          <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Ketentuan</h3>
          <ul className="mt-2 space-y-1.5 text-sm">
            <li><span className="text-muted">Revisi termasuk: </span>{quote.revisions} kali</li>
            <li><span className="text-muted">Domain & hosting: </span>{quote.domainHosting || "Tidak termasuk"}</li>
            {quote.timeline ? <li><span className="text-muted">Estimasi waktu: </span>{quote.timeline}</li> : null}
            {quote.validUntil ? <li><span className="text-muted">Berlaku sampai: </span>{quote.validUntil}{quote.expired ? " (sudah lewat)" : ""}</li> : null}
          </ul>
        </Card>
        {quote.terms ? <Card className="p-5 sm:col-span-2"><h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Syarat & ketentuan</h3><p className="mt-2 whitespace-pre-line text-sm text-ink/85">{quote.terms}</p></Card> : null}
      </div>

      {approved ? (
        <p role="status" className="rounded-xl bg-leaf-50 px-4 py-3 text-sm text-leaf">
          Penawaran ini sudah Anda setujui{quote.approvedAt ? ` pada ${quote.approvedAt}` : ""}. Tim kami akan menghubungi untuk pembayaran DP.
        </p>
      ) : canApprove ? (
        <Card className="p-5 sm:p-6">
          <h3 className="font-serif text-2xl tracking-tight">Setuju dengan penawaran ini?</h3>
          <p className="mb-4 mt-1 text-sm text-muted">Setelah disetujui, tim kami menghubungi Anda untuk pembayaran DP {formatRupiah(t.dpAmount)} dan memulai pengerjaan.</p>
          {quote.expired ? (
            <p role="alert" className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">Penawaran ini sudah melewati masa berlaku. Hubungi tim untuk penawaran baru.</p>
          ) : (
            <div className="space-y-3">
              <Notice r={result} />
              <Button
                disabled={pending}
                onClick={() => {
                  if (window.confirm("Setujui penawaran ini?")) run(() => approveQuote({ id: projectId }));
                }}
              >
                {pending ? "Memproses..." : "Setujui penawaran"}
                {!pending ? <Icon name="check" className="size-4" /> : null}
              </Button>
            </div>
          )}
        </Card>
      ) : null}
    </div>
  );
}

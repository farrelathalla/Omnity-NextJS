"use client";

import { useRouter } from "next/navigation";
import { useId, useMemo, useState, useTransition } from "react";
import {
  changeStatus,
  deleteMockup,
  publishDeliverables,
  saveNote,
  saveQuote,
  type ActionResult,
} from "@/app/(admin)/admin/proyek/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input, Select, Textarea } from "@/components/ui/form";
import { STATUS_LABEL, adminNextStatuses, type ProjectStatus } from "@/lib/project-status";
import { computeTotals, formatRupiah, type QuoteItem } from "@/lib/quote";
import { cn } from "@/lib/utils";

function Result({ r }: { r: ActionResult | null }) {
  if (!r) return null;
  return r.ok ? (
    r.message ? (
      <p role="status" className="rounded-lg bg-leaf-50 px-3 py-2 text-sm text-leaf">
        {r.message}
      </p>
    ) : null
  ) : (
    <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
      {r.error}
    </p>
  );
}

/** Runs a server action, then re-renders the server data on the page. */
function useRun() {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [result, setResult] = useState<ActionResult | null>(null);
  const run = (fn: () => Promise<ActionResult>) =>
    start(async () => {
      const r = await fn().catch(() => ({ ok: false as const, error: "Terjadi kesalahan. Coba lagi." }));
      setResult(r);
      router.refresh();
    });
  return { pending, result, run, setResult };
}

export function StatusPanel({ id, status }: { id: string; status: ProjectStatus }) {
  const uid = useId();
  const options = adminNextStatuses(status);
  const [chosen, setTo] = useState<string>(options[0] ?? "");
  // The status can change under us (after a save); fall back to the first valid option.
  const to = options.includes(chosen as ProjectStatus) ? chosen : (options[0] ?? "");
  const [note, setNote] = useState("");
  const { pending, result, run } = useRun();

  if (options.length === 0) {
    return <p className="text-sm text-muted">Status akhir. Tidak ada perubahan lanjutan.</p>;
  }
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        run(async () => {
          const r = await changeStatus({ id, to, note });
          if (r.ok) setNote("");
          return r;
        });
      }}
      className="space-y-3"
    >
      <Field label="Ubah status ke" htmlFor={`${uid}-to`}>
        <Select id={`${uid}-to`} value={to} onChange={(e) => setTo(e.target.value)}>
          {options.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABEL[s]}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Catatan untuk pengguna (opsional)" htmlFor={`${uid}-note`} hint="Ikut dikirim di email dan tercatat di riwayat.">
        <Textarea id={`${uid}-note`} value={note} onChange={(e) => setNote(e.target.value)} rows={3} maxLength={1000} className="min-h-20" />
      </Field>
      <Result r={result} />
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Menyimpan..." : "Ubah status & beri tahu pengguna"}
      </Button>
      {status === "mockup_in_progress" || status === "revision_requested" ? (
        <p className="text-xs text-muted">
          Untuk &quot;Mockup &amp; penawaran tersedia&quot;, gunakan tombol Publikasikan di bagian Penawaran.
        </p>
      ) : null}
    </form>
  );
}

export function NotePanel({ id, initial }: { id: string; initial: string }) {
  const uid = useId();
  const [note, setNote] = useState(initial);
  const { pending, result, run } = useRun();
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        run(() => saveNote({ id, note }));
      }}
      className="space-y-3"
    >
      <Field label="Catatan internal" htmlFor={`${uid}-n`} hint="Hanya terlihat oleh admin.">
        <Textarea id={`${uid}-n`} value={note} onChange={(e) => setNote(e.target.value)} rows={4} maxLength={5000} />
      </Field>
      <Result r={result} />
      <Button type="submit" variant="secondary" size="sm" disabled={pending}>
        {pending ? "Menyimpan..." : "Simpan catatan"}
      </Button>
    </form>
  );
}

export type MockupRow = {
  id: number;
  version: number;
  title: string;
  device: string;
  kind: string;
  fileId: string | null;
  url: string | null;
  published: boolean;
};

export function MockupPanel({ id, items, canUpload }: { id: string; items: MockupRow[]; canUpload: boolean }) {
  const uid = useId();
  const router = useRouter();
  const { pending, result, run } = useRun();
  const [kind, setKind] = useState<"image" | "pdf" | "link">("image");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const versions = [...new Set(items.map((i) => i.version))].sort((a, b) => a - b);

  async function upload(form: HTMLFormElement) {
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch(`/api/admin/projects/${id}/mockups`, { method: "POST", body: new FormData(form) });
      const json = (await res.json().catch(() => ({}))) as { error?: string; version?: number };
      if (!res.ok) throw new Error(json.error ?? "Gagal mengunggah.");
      setMsg({ ok: true, text: `Ditambahkan ke versi ${json.version} (belum dipublikasikan).` });
      form.reset();
      router.refresh();
    } catch (e) {
      setMsg({ ok: false, text: e instanceof Error ? e.message : "Gagal mengunggah." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      {versions.length === 0 ? <p className="text-sm text-muted">Belum ada mockup.</p> : null}
      {versions.map((v) => (
        <div key={v}>
          <p className="mb-2 flex items-center gap-2 text-sm font-semibold">
            Versi {v}
            {items.find((i) => i.version === v)?.published ? <Badge tone="leaf">Terpublikasi</Badge> : <Badge tone="brand">Draf</Badge>}
          </p>
          <ul className="divide-y divide-line rounded-xl border border-line">
            {items
              .filter((i) => i.version === v)
              .map((i) => (
                <li key={i.id} className="flex items-center gap-3 px-4 py-3 text-sm">
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium">{i.title}</span>
                    <span className="text-xs text-muted">
                      {i.kind === "link" ? "Tautan" : i.kind === "pdf" ? "PDF" : "Gambar"} · {i.device === "any" ? "Semua layar" : i.device === "desktop" ? "Desktop" : "Mobile"}
                    </span>
                  </span>
                  {i.fileId ? (
                    <a href={`/api/files/${i.fileId}`} target="_blank" rel="noopener" className="font-medium text-accent hover:underline">
                      Buka
                    </a>
                  ) : i.url ? (
                    <a href={i.url} target="_blank" rel="noopener noreferrer" className="font-medium text-accent hover:underline">
                      Buka
                    </a>
                  ) : null}
                  {!i.published ? (
                    <button
                      type="button"
                      disabled={pending}
                      onClick={() => {
                        if (window.confirm(`Hapus "${i.title}"?`)) run(() => deleteMockup({ id: i.id }));
                      }}
                      className="font-medium text-red-600 hover:underline disabled:opacity-50"
                    >
                      Hapus
                    </button>
                  ) : null}
                </li>
              ))}
          </ul>
        </div>
      ))}
      <Result r={result} />

      {canUpload ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void upload(e.currentTarget);
          }}
          className="space-y-4 rounded-xl border border-dashed border-line bg-sand/50 p-4"
        >
          <p className="text-sm font-semibold">Tambah item mockup</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Judul / nama halaman" htmlFor={`${uid}-t`}>
              <Input id={`${uid}-t`} name="title" required maxLength={120} placeholder="Beranda" />
            </Field>
            <Field label="Untuk layar" htmlFor={`${uid}-d`}>
              <Select id={`${uid}-d`} name="device" defaultValue="desktop">
                <option value="desktop">Desktop</option>
                <option value="mobile">Mobile</option>
                <option value="any">Semua layar</option>
              </Select>
            </Field>
          </div>
          <div role="radiogroup" aria-label="Jenis" className="flex flex-wrap gap-2">
            {(["image", "pdf", "link"] as const).map((k) => (
              <label key={k} className={cn("cursor-pointer rounded-full border px-4 py-1.5 text-sm", kind === k ? "border-ink bg-ink text-white" : "border-line bg-surface")}>
                <input type="radio" name="kind" value={k} checked={kind === k} onChange={() => setKind(k)} className="sr-only" />
                {k === "image" ? "Gambar" : k === "pdf" ? "PDF" : "Tautan (Figma dll)"}
              </label>
            ))}
          </div>
          {kind === "link" ? (
            <Field label="Tautan (https://)" htmlFor={`${uid}-u`}>
              <Input id={`${uid}-u`} name="url" type="url" placeholder="https://www.figma.com/..." required />
            </Field>
          ) : (
            <Field label={kind === "pdf" ? "File PDF (maks 15 MB)" : "Gambar (JPG/PNG/WebP, maks 8 MB)"} htmlFor={`${uid}-f`}>
              <Input id={`${uid}-f`} name="file" type="file" required accept={kind === "pdf" ? "application/pdf" : "image/jpeg,image/png,image/webp,image/gif,image/avif"} className="h-auto py-2" />
            </Field>
          )}
          <Field label="Catatan untuk pengguna (opsional)" htmlFor={`${uid}-nt`}>
            <Input id={`${uid}-nt`} name="note" maxLength={1000} />
          </Field>
          {msg ? (
            <p role={msg.ok ? "status" : "alert"} className={cn("rounded-lg px-3 py-2 text-sm", msg.ok ? "bg-leaf-50 text-leaf" : "bg-red-50 text-red-700")}>
              {msg.text}
            </p>
          ) : null}
          <Button type="submit" size="sm" disabled={busy}>
            {busy ? "Mengunggah..." : "Tambahkan"}
          </Button>
        </form>
      ) : (
        <p className="text-sm text-muted">
          Item mockup bisa ditambah saat status Ditinjau, Pembuatan mockup, atau Revisi diminta.
        </p>
      )}
    </div>
  );
}

export type QuoteFormState = {
  items: QuoteItem[];
  discount: number;
  dpPercent: number;
  timeline: string;
  validUntil: string;
  scope: string;
  revisions: number;
  domainHosting: string;
  terms: string;
};

export function QuoteEditor({
  id,
  initial,
  draftQuoteId,
  canPublish,
  pending: pendingMockups,
  history,
}: {
  id: string;
  initial: QuoteFormState;
  draftQuoteId: number | null;
  canPublish: boolean;
  pending: number;
  history: { id: number; version: number; status: string; total: number }[];
}) {
  const uid = useId();
  const [q, setQ] = useState<QuoteFormState>(initial);
  const { pending, result, run } = useRun();
  const totals = useMemo(() => computeTotals(q.items, q.discount, q.dpPercent), [q.items, q.discount, q.dpPercent]);

  const set = <K extends keyof QuoteFormState>(k: K, v: QuoteFormState[K]) => setQ((s) => ({ ...s, [k]: v }));
  const setItem = (i: number, patch: Partial<QuoteItem>) =>
    setQ((s) => ({ ...s, items: s.items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)) }));
  const num = (v: string) => Math.max(0, Math.floor(Number(v.replace(/\D/g, "")) || 0));

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        {q.items.map((it, i) => (
          <div key={i} className="rounded-xl border border-line p-3">
            <div className="grid gap-3 sm:grid-cols-[1fr_5rem_10rem]">
              <Input aria-label={`Item ${i + 1}`} placeholder="Nama item" value={it.label} maxLength={120} onChange={(e) => setItem(i, { label: e.target.value })} />
              <Input aria-label={`Jumlah item ${i + 1}`} inputMode="numeric" value={String(it.qty)} onChange={(e) => setItem(i, { qty: Math.max(1, num(e.target.value)) })} />
              <Input aria-label={`Harga satuan item ${i + 1}`} inputMode="numeric" placeholder="Harga (Rp)" value={it.unitPrice ? it.unitPrice.toLocaleString("id-ID") : ""} onChange={(e) => setItem(i, { unitPrice: num(e.target.value) })} />
            </div>
            <div className="mt-2 flex items-center gap-3">
              <Input aria-label={`Keterangan item ${i + 1}`} placeholder="Keterangan (opsional)" value={it.detail} maxLength={300} onChange={(e) => setItem(i, { detail: e.target.value })} className="h-9 text-sm" />
              <span className="shrink-0 text-sm font-medium tabular-nums">{formatRupiah(it.qty * it.unitPrice)}</span>
              {q.items.length > 1 ? (
                <button type="button" onClick={() => set("items", q.items.filter((_, idx) => idx !== i))} className="shrink-0 text-sm text-red-600 hover:underline">
                  Hapus
                </button>
              ) : null}
            </div>
          </div>
        ))}
        <Button type="button" variant="secondary" size="sm" onClick={() => set("items", [...q.items, { label: "", detail: "", qty: 1, unitPrice: 0 }])}>
          Tambah item
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Diskon (Rp)" htmlFor={`${uid}-disc`}>
          <Input id={`${uid}-disc`} inputMode="numeric" value={q.discount ? q.discount.toLocaleString("id-ID") : ""} onChange={(e) => set("discount", num(e.target.value))} />
        </Field>
        <Field label="DP (%)" htmlFor={`${uid}-dp`}>
          <Input id={`${uid}-dp`} inputMode="numeric" value={String(q.dpPercent)} onChange={(e) => set("dpPercent", Math.min(100, num(e.target.value)))} />
        </Field>
        <Field label="Revisi termasuk" htmlFor={`${uid}-rev`}>
          <Input id={`${uid}-rev`} inputMode="numeric" value={String(q.revisions)} onChange={(e) => set("revisions", Math.min(20, num(e.target.value)))} />
        </Field>
      </div>

      <dl className="space-y-1.5 rounded-xl bg-sand p-4 text-sm">
        <div className="flex justify-between"><dt className="text-muted">Subtotal</dt><dd className="tabular-nums">{formatRupiah(totals.subtotal)}</dd></div>
        {totals.discount > 0 ? <div className="flex justify-between"><dt className="text-muted">Diskon</dt><dd className="tabular-nums">- {formatRupiah(totals.discount)}</dd></div> : null}
        <div className="flex justify-between text-base font-semibold"><dt>Total</dt><dd className="tabular-nums">{formatRupiah(totals.total)}</dd></div>
        <div className="flex justify-between"><dt className="text-muted">DP {q.dpPercent}%</dt><dd className="tabular-nums">{formatRupiah(totals.dpAmount)}</dd></div>
        <div className="flex justify-between"><dt className="text-muted">Pelunasan</dt><dd className="tabular-nums">{formatRupiah(totals.remaining)}</dd></div>
      </dl>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Estimasi waktu pengerjaan" htmlFor={`${uid}-tl`}>
          <Input id={`${uid}-tl`} value={q.timeline} maxLength={200} placeholder="mis. 14 hari kerja setelah DP" onChange={(e) => set("timeline", e.target.value)} />
        </Field>
        <Field label="Berlaku sampai" htmlFor={`${uid}-vu`}>
          <Input id={`${uid}-vu`} type="date" value={q.validUntil} onChange={(e) => set("validUntil", e.target.value)} />
        </Field>
        <Field label="Cakupan (bagian mockup/paket)" htmlFor={`${uid}-sc`} className="sm:col-span-2" hint='Jelas dan spesifik, mis. "Beranda + 4 halaman, responsif".'>
          <Textarea id={`${uid}-sc`} value={q.scope} maxLength={1000} rows={3} onChange={(e) => set("scope", e.target.value)} />
        </Field>
        <Field label="Domain & hosting" htmlFor={`${uid}-dh`} className="sm:col-span-2">
          <Input id={`${uid}-dh`} value={q.domainHosting} maxLength={200} placeholder="mis. Termasuk 1 tahun, atau: tidak termasuk" onChange={(e) => set("domainHosting", e.target.value)} />
        </Field>
        <Field label="Syarat & ketentuan" htmlFor={`${uid}-tc`} className="sm:col-span-2">
          <Textarea id={`${uid}-tc`} value={q.terms} maxLength={3000} rows={5} onChange={(e) => set("terms", e.target.value)} />
        </Field>
      </div>

      <Result r={result} />
      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="button"
          variant="secondary"
          disabled={pending}
          onClick={() => run(() => saveQuote({ id, quote: q }))}
        >
          {pending ? "Menyimpan..." : "Simpan draf"}
        </Button>
        {draftQuoteId ? (
          <a href={`/api/quotes/${draftQuoteId}/pdf`} target="_blank" rel="noopener" className="text-sm font-medium text-accent hover:underline">
            Pratinjau PDF
          </a>
        ) : null}
        <Button
          type="button"
          disabled={pending || !canPublish}
          onClick={() => {
            if (!window.confirm("Publikasikan mockup dan penawaran ini? Pengguna langsung diberi tahu lewat email.")) return;
            run(async () => {
              const saved = await saveQuote({ id, quote: q });
              return saved.ok ? publishDeliverables({ id }) : saved;
            });
          }}
        >
          Simpan & publikasikan ke pengguna
        </Button>
      </div>
      {!canPublish ? (
        <p className="text-xs text-muted">
          Tersedia saat status Pembuatan mockup atau Revisi diminta. {pendingMockups === 0 ? "Unggah minimal satu mockup baru dulu." : ""}
        </p>
      ) : pendingMockups === 0 ? (
        <p className="text-xs text-muted">Unggah minimal satu mockup baru di bagian Mockup sebelum mempublikasikan.</p>
      ) : null}

      {history.length > 0 ? (
        <div>
          <p className="mb-2 text-sm font-semibold">Versi penawaran</p>
          <ul className="space-y-1 text-sm">
            {history.map((h) => (
              <li key={h.id} className="flex items-center gap-3">
                <span>v{h.version}</span>
                <Badge tone={h.status === "approved" ? "leaf" : h.status === "sent" ? "brand" : "neutral"}>
                  {h.status === "draft" ? "Draf" : h.status === "sent" ? "Terkirim" : h.status === "approved" ? "Disetujui" : "Digantikan"}
                </Badge>
                <span className="tabular-nums text-muted">{formatRupiah(h.total)}</span>
                {h.status !== "draft" || true ? (
                  <a href={`/api/quotes/${h.id}/pdf`} target="_blank" rel="noopener" className="ml-auto font-medium text-accent hover:underline">
                    PDF
                  </a>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

export function SectionCard({ title, children, id }: { title: string; children: React.ReactNode; id?: string }) {
  return (
    <Card id={id} className="scroll-mt-6 p-5 sm:p-6">
      <h2 className="mb-4 font-serif text-2xl tracking-tight">{title}</h2>
      {children}
    </Card>
  );
}

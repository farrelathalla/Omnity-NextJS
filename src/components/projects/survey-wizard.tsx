"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { saveSurvey, submitProject } from "@/app/actions/projects";
import { Icon } from "@/components/icon";
import { TemplatePreview } from "@/components/templates/template-preview";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/form";
import { templates } from "@/content/templates";
import {
  COLOR_PRESETS,
  FEATURES,
  GOALS,
  INDUSTRIES,
  STEPS,
  missingForSubmit,
  recommendedPages,
  summaryRows,
  type Survey,
} from "@/lib/survey";
import { cn } from "@/lib/utils";

export type WizardFile = { id: string; kind: string; name: string | null };
type Patch = (fn: (s: Survey) => Survey) => void;
type SaveState = "saved" | "saving" | "error";

const choice =
  "flex w-full items-start gap-3 rounded-xl border p-4 text-left transition-[border-color,background-color,box-shadow] duration-200";

function Check({ on }: { on: boolean }) {
  return (
    <span
      className={cn(
        "mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-md border transition-colors",
        on ? "border-ink bg-ink text-white" : "border-line bg-surface",
      )}
    >
      {on ? <Icon name="check" className="size-3.5" strokeWidth={3} /> : null}
    </span>
  );
}

function YesNo({
  value,
  onChange,
  labels = ["Sudah", "Belum"],
  name,
}: {
  value: "" | "yes" | "no";
  onChange: (v: "yes" | "no") => void;
  labels?: [string, string];
  name: string;
}) {
  return (
    <div role="radiogroup" aria-label={name} className="flex gap-2">
      {(["yes", "no"] as const).map((v, i) => (
        <button
          key={v}
          type="button"
          role="radio"
          aria-checked={value === v}
          onClick={() => onChange(v)}
          className={cn(
            "h-11 flex-1 rounded-xl border text-sm font-medium transition-colors sm:flex-none sm:px-8",
            value === v ? "border-ink bg-ink text-white" : "border-line bg-surface text-ink/80 hover:border-ink/30",
          )}
        >
          {labels[i]}
        </button>
      ))}
    </div>
  );
}

/** Uploads to the private project-file endpoint and reports the new file. */
function FileDrop({
  projectId,
  kind,
  label,
  hint,
  disabled,
  onUploaded,
}: {
  projectId: string;
  kind: "logo" | "ref";
  label: string;
  hint: string;
  disabled?: boolean;
  onUploaded: (f: WizardFile) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const ref = useRef<HTMLInputElement>(null);

  async function pick(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    setErr("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("kind", kind);
      const res = await fetch(`/api/projects/${projectId}/files`, { method: "POST", body: fd });
      const json = (await res.json().catch(() => ({}))) as { id?: string; name?: string; error?: string };
      if (!res.ok || !json.id) throw new Error(json.error ?? "Gagal mengunggah.");
      onUploaded({ id: json.id, kind: `project-${kind}`, name: json.name ?? file.name });
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Gagal mengunggah.");
    } finally {
      setBusy(false);
      if (ref.current) ref.current.value = "";
    }
  }

  return (
    <div>
      <button
        type="button"
        disabled={disabled || busy}
        onClick={() => ref.current?.click()}
        className="flex h-24 w-full flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-line bg-sand/60 text-sm text-muted transition-colors hover:border-ink/30 hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Icon name="paperclip" className="size-5" />
        <span className="font-medium text-ink">{busy ? "Mengunggah..." : label}</span>
        <span className="text-xs">{hint}</span>
      </button>
      <input
        ref={ref}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
        className="sr-only"
        aria-label={label}
        onChange={(e) => pick(e.target.files?.[0])}
      />
      {err ? (
        <p role="alert" className="mt-1.5 text-sm text-red-600">
          {err}
        </p>
      ) : null}
    </div>
  );
}

function Thumb({ file, onRemove }: { file: WizardFile; onRemove: () => void }) {
  return (
    <div className="group relative size-24 overflow-hidden rounded-xl border border-line bg-sand">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`/api/files/${file.id}`} alt={file.name ?? "Lampiran"} className="h-full w-full object-cover" />
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Hapus ${file.name ?? "lampiran"}`}
        className="absolute right-1 top-1 inline-flex size-6 items-center justify-center rounded-full bg-ink/80 text-white opacity-100 transition-opacity hover:bg-ink sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"
      >
        <Icon name="x" className="size-3.5" />
      </button>
    </div>
  );
}

export function SurveyWizard({
  projectId,
  initialSurvey,
  initialStep,
  initialFiles,
}: {
  projectId: string;
  initialSurvey: Survey;
  initialStep: number;
  initialFiles: WizardFile[];
}) {
  const router = useRouter();
  const uid = useId();
  const top = useRef<HTMLDivElement>(null);
  const [survey, setSurvey] = useState<Survey>(initialSurvey);
  const [step, setStep] = useState(Math.min(Math.max(initialStep, 1), 8));
  const [files, setFiles] = useState<WizardFile[]>(initialFiles);
  const [save, setSave] = useState<SaveState>("saved");
  const [dirty, setDirty] = useState(0);
  const [stepError, setStepError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const latest = useRef({ survey, step });
  useEffect(() => {
    latest.current = { survey, step };
  });

  const update: Patch = useCallback((fn) => {
    setSurvey(fn);
    setDirty((d) => d + 1);
    setStepError("");
  }, []);

  // Debounced autosave. State is only set inside timer/promise callbacks.
  useEffect(() => {
    if (dirty === 0) return;
    const timer = setTimeout(async () => {
      setSave("saving");
      try {
        const res = await saveSurvey(projectId, latest.current.step, latest.current.survey);
        setSave(res.ok ? "saved" : "error");
      } catch {
        setSave("error");
      }
    }, 900);
    return () => clearTimeout(timer);
  }, [dirty, projectId]);

  const go = (n: number) => {
    setStep(n);
    setDirty((d) => d + 1);
    setStepError("");
    requestAnimationFrame(() => top.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  function next() {
    const msg = missingForSubmit(survey)[step];
    if (msg) {
      setStepError(msg);
      return;
    }
    go(Math.min(step + 1, 8));
  }

  async function send() {
    setSubmitting(true);
    setStepError("");
    // Make sure the server has the very latest answers before it validates them.
    await saveSurvey(projectId, 8, survey).catch(() => null);
    const res = await submitProject(projectId).catch(() => ({ ok: false as const, error: "Gagal mengirim. Coba lagi." }));
    if (res.ok) {
      router.push(`/proyek/${projectId}?terkirim=1`);
      router.refresh();
      return;
    }
    setSubmitting(false);
    setStepError(res.error);
    if ("step" in res && typeof res.step === "number") go(res.step);
  }

  const removeFile = async (f: WizardFile) => {
    setFiles((list) => list.filter((x) => x.id !== f.id));
    update((s) => ({
      ...s,
      brand: { ...s.brand, logo: s.brand.logo === f.id ? null : s.brand.logo },
      design: { ...s.design, refFiles: s.design.refFiles.filter((x) => x !== f.id) },
    }));
    await fetch(`/api/files/${f.id}`, { method: "DELETE" }).catch(() => null);
  };

  const logo = files.find((f) => f.id === survey.brand.logo);
  const refs = files.filter((f) => survey.design.refFiles.includes(f.id));
  const meta = STEPS[step - 1];
  const id = (n: string) => `${uid}-${n}`;
  const pageOptions = Array.from(
    new Set([...recommendedPages(survey.business.industry || INDUSTRIES[0]), ...survey.pages]),
  );

  let body: ReactNode;
  switch (step) {
    case 1:
      body = (
        <div className="space-y-5">
          <Field label="Nama bisnis / perusahaan" htmlFor={id("name")}>
            <Input
              id={id("name")}
              value={survey.business.name}
              onChange={(e) => update((s) => ({ ...s, business: { ...s.business, name: e.target.value } }))}
              maxLength={160}
              autoComplete="organization"
            />
          </Field>
          <Field label="Bidang industri" htmlFor={id("industry")} hint="Menentukan rekomendasi halaman di langkah 5.">
            <div className="relative">
              <Select
                id={id("industry")}
                value={survey.business.industry}
                onChange={(e) =>
                  update((s) => ({
                    ...s,
                    business: { ...s.business, industry: e.target.value },
                    pages: s.pagesCustomised ? s.pages : recommendedPages(e.target.value),
                  }))
                }
              >
                <option value="" disabled>
                  Pilih industri
                </option>
                {INDUSTRIES.map((i) => (
                  <option key={i}>{i}</option>
                ))}
              </Select>
              <Icon name="chevron-down" className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" />
            </div>
          </Field>
          <Field label="Deskripsi singkat" htmlFor={id("desc")} hint="Terisi dari kotak prompt di beranda bila Anda sudah mengetiknya.">
            <Textarea
              id={id("desc")}
              value={survey.business.description}
              onChange={(e) => update((s) => ({ ...s, business: { ...s.business, description: e.target.value } }))}
              maxLength={1500}
              rows={5}
            />
          </Field>
          <Field label="Website lama (opsional)" htmlFor={id("old")}>
            <Input
              id={id("old")}
              value={survey.business.oldSite}
              onChange={(e) => update((s) => ({ ...s, business: { ...s.business, oldSite: e.target.value } }))}
              placeholder="contoh.co.id"
              inputMode="url"
            />
          </Field>
        </div>
      );
      break;
    case 2:
      body = (
        <div className="space-y-3">
          <p className="text-sm text-muted">Boleh pilih lebih dari satu.</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {GOALS.map((g) => {
              const on = survey.goals.includes(g.id);
              return (
                <button
                  key={g.id}
                  type="button"
                  role="checkbox"
                  aria-checked={on}
                  onClick={() =>
                    update((s) => ({
                      ...s,
                      goals: on ? s.goals.filter((x) => x !== g.id) : [...s.goals, g.id],
                    }))
                  }
                  className={cn(choice, on ? "border-ink bg-surface shadow-card" : "border-line bg-surface hover:border-ink/30")}
                >
                  <Check on={on} />
                  <span>
                    <span className="block font-semibold">{g.label}</span>
                    <span className="text-sm text-muted">{g.hint}</span>
                  </span>
                </button>
              );
            })}
          </div>
          {survey.goals.includes("lainnya") ? (
            <Field label="Tujuan lainnya" htmlFor={id("goalsOther")}>
              <Textarea
                id={id("goalsOther")}
                value={survey.goalsOther}
                onChange={(e) => update((s) => ({ ...s, goalsOther: e.target.value }))}
                rows={3}
                maxLength={400}
              />
            </Field>
          ) : null}
        </div>
      );
      break;
    case 3:
      body = (
        <div className="space-y-7">
          <div>
            <p className="mb-2 text-sm font-medium">Sudah punya domain?</p>
            <YesNo name="Sudah punya domain" value={survey.domain.hasDomain} onChange={(v) => update((s) => ({ ...s, domain: { ...s.domain, hasDomain: v } }))} />
            {survey.domain.hasDomain === "yes" ? (
              <div className="mt-3 max-w-md">
                <Field label="Nama domain" htmlFor={id("domainName")}>
                  <Input id={id("domainName")} value={survey.domain.domainName} onChange={(e) => update((s) => ({ ...s, domain: { ...s.domain, domainName: e.target.value } }))} placeholder="namabisnis.co.id" />
                </Field>
              </div>
            ) : null}
          </div>
          <div>
            <p className="mb-2 text-sm font-medium">Sudah punya hosting?</p>
            <YesNo name="Sudah punya hosting" value={survey.domain.hasHosting} onChange={(v) => update((s) => ({ ...s, domain: { ...s.domain, hasHosting: v } }))} />
            {survey.domain.hasHosting === "yes" ? (
              <div className="mt-3 max-w-md">
                <Field label="Penyedia hosting" htmlFor={id("provider")}>
                  <Input id={id("provider")} value={survey.domain.provider} onChange={(e) => update((s) => ({ ...s, domain: { ...s.domain, provider: e.target.value } }))} />
                </Field>
              </div>
            ) : null}
          </div>
          <div>
            <p className="mb-2 text-sm font-medium">Mau dibantu belikan domain atau hosting?</p>
            <YesNo name="Mau dibantu" labels={["Ya, bantu", "Tidak perlu"]} value={survey.domain.needHelp} onChange={(v) => update((s) => ({ ...s, domain: { ...s.domain, needHelp: v } }))} />
            <p className="mt-2 text-sm text-muted">Domain dan hosting bisa ditambahkan sebagai opsi di penawaran.</p>
          </div>
        </div>
      );
      break;
    case 4:
      body = (
        <div className="space-y-8">
          <div>
            <p className="mb-3 text-sm font-medium">Template</p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" role="radiogroup" aria-label="Template">
              <button
                type="button"
                role="radio"
                aria-checked={!survey.design.template}
                onClick={() => update((s) => ({ ...s, design: { ...s.design, template: "" } }))}
                className={cn("flex min-h-32 flex-col items-center justify-center gap-1 rounded-xl border border-dashed p-4 text-center text-sm", !survey.design.template ? "border-ink bg-surface shadow-card" : "border-line hover:border-ink/30")}
              >
                <span className="font-semibold">Tanpa template</span>
                <span className="text-muted">Mulai dari nol.</span>
              </button>
              {templates.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  role="radio"
                  aria-checked={survey.design.template === t.id}
                  onClick={() => update((s) => ({ ...s, design: { ...s.design, template: t.id } }))}
                  className={cn("rounded-xl border p-2.5 text-left transition-colors", survey.design.template === t.id ? "border-ink bg-surface shadow-card" : "border-line bg-surface hover:border-ink/30")}
                >
                  <TemplatePreview id={t.id} />
                  <span className="mt-2 block px-1 text-sm font-semibold">{t.name}</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-1 text-sm font-medium">Website yang Anda sukai (maksimal 3)</p>
            <p className="mb-3 text-sm text-muted">Tempel alamatnya; kami lihat gaya dan strukturnya.</p>
            <div className="space-y-2">
              {[0, 1, 2].map((i) => (
                <Input
                  key={i}
                  aria-label={`URL referensi ${i + 1}`}
                  placeholder={`Referensi ${i + 1}, mis. contoh.com`}
                  value={survey.design.refUrls[i] ?? ""}
                  onChange={(e) =>
                    update((s) => {
                      const urls = [...s.design.refUrls];
                      urls[i] = e.target.value;
                      return { ...s, design: { ...s.design, refUrls: urls.filter((u, idx) => u || idx < i) } };
                    })
                  }
                  inputMode="url"
                />
              ))}
            </div>
          </div>
          <div>
            <p className="mb-1 text-sm font-medium">Screenshot referensi (maksimal 3)</p>
            <p className="mb-3 text-sm text-muted">Hanya Anda dan tim Omnity yang bisa melihat file ini.</p>
            <div className="flex flex-wrap gap-3">
              {refs.map((f) => (
                <Thumb key={f.id} file={f} onRemove={() => removeFile(f)} />
              ))}
            </div>
            {refs.length < 3 ? (
              <div className={cn("max-w-sm", refs.length && "mt-3")}>
                <FileDrop
                  projectId={projectId}
                  kind="ref"
                  label="Unggah screenshot"
                  hint="JPG, PNG, atau WebP, maks 8 MB"
                  onUploaded={(f) => {
                    setFiles((l) => [...l, f]);
                    update((s) => ({ ...s, design: { ...s.design, refFiles: [...s.design.refFiles, f.id] } }));
                  }}
                />
              </div>
            ) : null}
          </div>
        </div>
      );
      break;
    case 5:
      body = (
        <div className="space-y-5">
          <p className="text-sm text-muted">
            Rekomendasi untuk <strong className="text-ink">{survey.business.industry || INDUSTRIES[0]}</strong>. Centang yang diperlukan, atau tambah menu sendiri.
          </p>
          <div className="flex flex-wrap gap-2">
            {pageOptions.map((p) => {
              const on = survey.pages.includes(p);
              return (
                <button
                  key={p}
                  type="button"
                  role="checkbox"
                  aria-checked={on}
                  onClick={() =>
                    update((s) => ({
                      ...s,
                      pagesCustomised: true,
                      pages: on ? s.pages.filter((x) => x !== p) : [...s.pages, p],
                    }))
                  }
                  className={cn(
                    "inline-flex h-10 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors",
                    on ? "border-ink bg-ink text-white" : "border-line bg-surface text-ink/80 hover:border-ink/30",
                  )}
                >
                  {on ? <Icon name="check" className="size-4" strokeWidth={2.5} /> : null}
                  {p}
                </button>
              );
            })}
          </div>
          <AddPage
            onAdd={(name) =>
              update((s) =>
                s.pages.some((p) => p.toLowerCase() === name.toLowerCase())
                  ? s
                  : { ...s, pagesCustomised: true, pages: [...s.pages, name] },
              )
            }
          />
        </div>
      );
      break;
    case 6:
      body = (
        <div className="space-y-8">
          <div>
            <p className="mb-3 text-sm font-medium">Preferensi warna</p>
            <div className="flex flex-wrap gap-2">
              {COLOR_PRESETS.map((c) => {
                const on = survey.brand.colors === c.label;
                return (
                  <button
                    key={c.id}
                    type="button"
                    aria-pressed={on}
                    onClick={() => update((s) => ({ ...s, brand: { ...s.brand, colors: c.label } }))}
                    className={cn("inline-flex h-10 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors", on ? "border-ink bg-surface shadow-card" : "border-line bg-surface hover:border-ink/30")}
                  >
                    <span className="size-4 rounded-full border border-ink/10" style={{ background: c.swatch }} />
                    {c.label}
                  </button>
                );
              })}
            </div>
            <div className="mt-3 max-w-md">
              <Input
                aria-label="Warna lain atau kode HEX"
                placeholder="Atau tulis sendiri, mis. biru tua #1E3A8A"
                value={survey.brand.colors}
                onChange={(e) => update((s) => ({ ...s, brand: { ...s.brand, colors: e.target.value } }))}
                maxLength={160}
              />
            </div>
          </div>
          <div>
            <p className="mb-1 text-sm font-medium">Logo</p>
            <p className="mb-3 text-sm text-muted">Belum punya? Lewati saja.</p>
            {logo ? (
              <div className="flex items-center gap-4">
                <Thumb file={logo} onRemove={() => removeFile(logo)} />
                <span className="text-sm text-muted">{logo.name}</span>
              </div>
            ) : (
              <div className="max-w-sm">
                <FileDrop
                  projectId={projectId}
                  kind="logo"
                  label="Unggah logo"
                  hint="JPG, PNG, atau WebP, maks 8 MB"
                  onUploaded={(f) => {
                    setFiles((l) => [...l.filter((x) => x.kind !== "project-logo"), f]);
                    update((s) => ({ ...s, brand: { ...s.brand, logo: f.id } }));
                  }}
                />
              </div>
            )}
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <p className="mb-2 text-sm font-medium">Sudah punya teks (isi halaman)?</p>
              <YesNo name="Sudah punya teks" value={survey.brand.hasText} onChange={(v) => update((s) => ({ ...s, brand: { ...s.brand, hasText: v } }))} />
            </div>
            <div>
              <p className="mb-2 text-sm font-medium">Sudah punya foto?</p>
              <YesNo name="Sudah punya foto" value={survey.brand.hasPhotos} onChange={(v) => update((s) => ({ ...s, brand: { ...s.brand, hasPhotos: v } }))} />
            </div>
          </div>
        </div>
      );
      break;
    case 7:
      body = (
        <div className="space-y-4">
          <p className="text-sm text-muted">Pilih fungsi yang perlu ada. Kami menyesuaikannya di penawaran.</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {FEATURES.map((f) => {
              const on = survey.features.includes(f.id);
              return (
                <button
                  key={f.id}
                  type="button"
                  role="checkbox"
                  aria-checked={on}
                  onClick={() => update((s) => ({ ...s, features: on ? s.features.filter((x) => x !== f.id) : [...s.features, f.id] }))}
                  className={cn(choice, "items-center", on ? "border-ink bg-surface shadow-card" : "border-line bg-surface hover:border-ink/30")}
                >
                  <Check on={on} />
                  <span className="font-medium">{f.label}</span>
                </button>
              );
            })}
          </div>
          <Field label="Fitur lain (opsional)" htmlFor={id("fo")}>
            <Textarea id={id("fo")} value={survey.featuresOther} onChange={(e) => update((s) => ({ ...s, featuresOther: e.target.value }))} rows={3} maxLength={400} />
          </Field>
        </div>
      );
      break;
    default:
      body = <Summary survey={survey} files={files} onEdit={go} />;
  }

  return (
    <div ref={top} className="scroll-mt-24">
      {/* progress */}
      <div className="mb-8">
        <div className="mb-3 flex items-center justify-between gap-3 text-sm">
          <p className="font-medium">
            Langkah {step} dari 8 <span className="text-muted">· {meta.title}</span>
          </p>
          <p role="status" aria-live="polite" className={cn("text-xs", save === "error" ? "text-red-600" : "text-muted")}>
            {save === "saving" ? "Menyimpan..." : save === "error" ? "Gagal menyimpan, periksa koneksi" : "Draf tersimpan otomatis"}
          </p>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-ink/10" aria-hidden="true">
          <motion.div
            className="h-full rounded-full bg-brand"
            initial={false}
            animate={{ width: `${(step / 8) * 100}%` }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
        <ol className="mt-4 hidden gap-1.5 lg:flex" aria-label="Langkah survei">
          {STEPS.map((s) => (
            <li key={s.id} className="flex-1">
              <button
                type="button"
                onClick={() => go(s.id)}
                aria-current={s.id === step ? "step" : undefined}
                className={cn(
                  "w-full truncate rounded-lg px-2 py-1.5 text-xs transition-colors",
                  s.id === step ? "bg-ink text-white" : s.id < step ? "text-ink hover:bg-ink/5" : "text-muted hover:bg-ink/5",
                )}
              >
                {s.id}. {s.title}
              </button>
            </li>
          ))}
        </ol>
      </div>

      <div className="rounded-card border border-line bg-surface p-5 shadow-card sm:p-8">
        <h2 className="font-serif text-4xl leading-tight tracking-tight">{meta.title}</h2>
        <p className="mb-7 mt-1 text-muted">{meta.hint}</p>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -18 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            {body}
          </motion.div>
        </AnimatePresence>

        {stepError ? (
          <p role="alert" className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {stepError}
          </p>
        ) : null}

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-6">
          <div className="flex items-center gap-3">
            {step > 1 ? (
              <Button variant="secondary" onClick={() => go(step - 1)}>
                <Icon name="arrow-right" className="size-4 rotate-180" />
                Kembali
              </Button>
            ) : null}
            <Link href="/proyek" className="text-sm font-medium text-muted hover:text-ink">
              Simpan &amp; keluar
            </Link>
          </div>
          {step < 8 ? (
            <Button onClick={next}>
              Lanjut
              <Icon name="arrow-right" className="size-4" />
            </Button>
          ) : (
            <Button size="lg" onClick={send} disabled={submitting}>
              {submitting ? "Mengirim..." : "Kirim permintaan"}
              {!submitting ? <Icon name="arrow-right" className="size-4" /> : null}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function AddPage({ onAdd }: { onAdd: (name: string) => void }) {
  const [v, setV] = useState("");
  const add = () => {
    const name = v.trim().slice(0, 40);
    if (name) onAdd(name);
    setV("");
  };
  return (
    <div className="flex max-w-md gap-2">
      <Input
        aria-label="Tambah menu"
        placeholder="Tambah menu, mis. Karier"
        value={v}
        onChange={(e) => setV(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            add();
          }
        }}
        maxLength={40}
      />
      <Button type="button" variant="secondary" onClick={add}>
        Tambah
      </Button>
    </div>
  );
}

function Summary({ survey, files, onEdit }: { survey: Survey; files: WizardFile[]; onEdit: (n: number) => void }) {
  const rows = summaryRows(survey, files.some((f) => f.id === survey.brand.logo));
  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-sand p-4 text-sm">
        <p className="font-semibold">Estimasi mockup: 2 sampai 3 hari kerja setelah dikirim.</p>
        <p className="mt-1 text-muted">Anda menerima email saat mockup dan penawaran siap. Tidak ada biaya sampai Anda menyetujui penawaran.</p>
      </div>
      {rows.map((r) => (
        <section key={r.step} className="border-b border-line pb-5 last:border-0">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted">{r.title}</h3>
            <button type="button" onClick={() => onEdit(r.step)} className="text-sm font-semibold text-accent hover:underline">
              Ubah
            </button>
          </div>
          <dl className="grid gap-x-6 gap-y-1.5 text-sm sm:grid-cols-[10rem_1fr]">
            {r.items.map(([k, v]) => (
              <div key={k} className="contents">
                <dt className="text-muted">{k}</dt>
                <dd className="text-ink">{v}</dd>
              </div>
            ))}
          </dl>
        </section>
      ))}
    </div>
  );
}

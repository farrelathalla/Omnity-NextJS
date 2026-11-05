"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { Icon } from "@/components/icon";
import { TemplatePreview } from "@/components/templates/template-preview";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/form";
import { templates } from "@/content/templates";
import { readStart, writeStart } from "@/lib/start-storage";
import { INDUSTRIES } from "@/lib/survey";
import { cn } from "@/lib/utils";

/** Template grid + prompt on /mulai. Starting needs an account; the choice survives sign-up. */
export function TemplatePicker({ initialTemplate }: { initialTemplate?: string }) {
  const router = useRouter();
  const uid = useId();
  const { user, status, openAuth } = useAuth();
  const [industry, setIndustry] = useState<string>("Semua");
  const [template, setTemplate] = useState<string | null>(initialTemplate ?? null);
  const [prompt, setPrompt] = useState("");

  // Pick up the hero prompt after mount (localStorage is not available during SSR).
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const s = readStart();
      if (s.prompt) setPrompt(s.prompt);
      if (!initialTemplate && s.template) setTemplate(s.template);
    });
    return () => cancelAnimationFrame(frame);
  }, [initialTemplate]);

  const shown = industry === "Semua" ? templates : templates.filter((t) => t.industry === industry);

  function start() {
    writeStart({ prompt: prompt.trim(), template, tab: "website" });
    if (status === "ready" && !user) {
      openAuth({ mode: "register", next: "/mulai/baru" });
      return;
    }
    router.push("/mulai/baru");
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center gap-2" role="group" aria-label="Filter industri">
        {["Semua", ...INDUSTRIES.filter((i) => templates.some((t) => t.industry === i))].map((i) => (
          <button
            key={i}
            type="button"
            aria-pressed={industry === i}
            onClick={() => setIndustry(i)}
            className={cn(
              "h-9 rounded-full border px-4 text-sm font-medium transition-colors",
              industry === i
                ? "border-ink bg-ink text-white"
                : "border-line bg-surface text-ink/75 hover:border-ink/30 hover:text-ink",
            )}
          >
            {i}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" role="radiogroup" aria-label="Pilih template">
        <button
          type="button"
          role="radio"
          aria-checked={template === null}
          onClick={() => setTemplate(null)}
          className={cn(
            "flex min-h-44 flex-col items-center justify-center gap-2 rounded-card border border-dashed p-6 text-center transition-colors",
            template === null ? "border-ink bg-surface shadow-card" : "border-line bg-transparent hover:border-ink/30",
          )}
        >
          <Icon name="sparkles" className="size-6" />
          <span className="font-semibold">Tidak pakai template</span>
          <span className="text-sm text-muted">Mulai dari nol, sesuai cerita Anda.</span>
        </button>
        {shown.map((t) => (
          <button
            key={t.id}
            type="button"
            role="radio"
            aria-checked={template === t.id}
            onClick={() => setTemplate(t.id)}
            className={cn(
              "group rounded-card border p-3 text-left transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5",
              template === t.id ? "border-ink bg-surface shadow-card-hover" : "border-line bg-surface hover:border-ink/25",
            )}
          >
            <TemplatePreview id={t.id} />
            <div className="flex items-start justify-between gap-3 px-1 pb-1 pt-3">
              <div>
                <p className="font-semibold">{t.name}</p>
                <p className="text-sm text-muted">{t.menu.slice(0, 4).join(" · ")}</p>
              </div>
              <span
                className={cn(
                  "mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full border",
                  template === t.id ? "border-ink bg-ink text-white" : "border-line",
                )}
              >
                {template === t.id ? <Icon name="check" className="size-3" strokeWidth={3} /> : null}
              </span>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-10 rounded-card border border-line bg-surface p-5 shadow-card sm:p-7">
        <label htmlFor={`${uid}-prompt`} className="text-sm font-medium">
          Ceritakan bisnis Anda atau tempel URL website lama
        </label>
        <Textarea
          id={`${uid}-prompt`}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          maxLength={1200}
          rows={3}
          placeholder="Contoh: toko online sepatu lokal dengan pembayaran QRIS"
          className="mt-2"
        />
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted">
            {user ? "Lanjut ke survei singkat 8 langkah." : "Anda diminta daftar atau masuk dulu. Pilihan Anda tidak hilang."}
          </p>
          <Button size="lg" onClick={start}>
            Mulai survei
            <Icon name="arrow-right" className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

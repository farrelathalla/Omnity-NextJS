"use client";

import { LayoutGroup, motion, AnimatePresence, useReducedMotion } from "motion/react";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { Icon, type IconName } from "@/components/icon";
import { templates } from "@/content/templates";
import { cn } from "@/lib/utils";

type TabId = "website" | "mobile" | "solusi";

const tabs: {
  id: TabId;
  label: string;
  icon: IconName;
  cta: string;
  phrases: string[];
}[] = [
  {
    id: "website",
    label: "Website",
    icon: "monitor",
    cta: "Mulai Desain",
    phrases: [
      "Ceritakan bisnis Anda atau tempel URL website lama...",
      "Toko online sepatu lokal dengan pembayaran QRIS",
      "Website company profile untuk perusahaan kontraktor",
      "Situs reservasi untuk klinik gigi dengan 3 cabang",
      "Landing page peluncuran produk skincare",
    ],
  },
  {
    id: "mobile",
    label: "Mobile App",
    icon: "smartphone",
    cta: "Jadwalkan Konsultasi",
    phrases: [
      "Ceritakan aplikasi mobile yang Anda butuhkan...",
      "Aplikasi absensi karyawan dengan lokasi",
      "Aplikasi pesan-antar untuk 5 outlet kafe",
    ],
  },
  {
    id: "solusi",
    label: "Solusi IT",
    icon: "layers",
    cta: "Jadwalkan Konsultasi",
    phrases: [
      "Ceritakan masalah IT atau sistem yang ingin dibenahi...",
      "Audit keamanan untuk sistem pembayaran internal",
      "Integrasi kasir dengan sistem akuntansi",
    ],
  },
];

export const HERO_PROMPT_KEY = "omnity:hero-prompt";

function useTypingPlaceholder(phrases: string[], enabled: boolean) {
  const [text, setText] = useState(phrases[0]);

  useEffect(() => {
    if (!enabled) return;
    let phraseIndex = 0;
    let chars = 0;
    let typing = true;
    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      const phrase = phrases[phraseIndex];
      if (typing) {
        chars += 1;
        setText(phrase.slice(0, chars));
        if (chars >= phrase.length) {
          typing = false;
          timer = setTimeout(tick, 1900);
          return;
        }
        timer = setTimeout(tick, 42);
      } else {
        chars -= 1;
        setText(phrase.slice(0, Math.max(chars, 0)));
        if (chars <= 0) {
          typing = true;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          timer = setTimeout(tick, 380);
          return;
        }
        timer = setTimeout(tick, 20);
      }
    };
    timer = setTimeout(tick, 1400);
    return () => clearTimeout(timer);
  }, [phrases, enabled]);

  // While disabled (typing, focused, reduced motion) show the static first phrase.
  return enabled ? text : phrases[0];
}

export function HeroPrompt() {
  const router = useRouter();
  const { user, status, openAuth } = useAuth();
  const reduce = useReducedMotion();
  const uid = useId();
  const [tab, setTab] = useState<TabId>("website");
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const [template, setTemplate] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);

  const active = tabs.find((t) => t.id === tab)!;
  const typing = !value && !focused && !reduce;
  const placeholder = useTypingPlaceholder(active.phrases, typing);

  useEffect(() => {
    if (!menuOpen) return;
    const onDown = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  // Grow the textarea with its content (up to 200px, like aidesigner.ai).
  useEffect(() => {
    const el = taRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, [value]);

  function submit() {
    const prompt = value.trim();
    try {
      sessionStorage.setItem(HERO_PROMPT_KEY, JSON.stringify({ prompt, tab, template }));
    } catch {
      /* private mode: the prompt just is not carried over */
    }
    if (tab === "website") {
      // Brief: a visitor may type the prompt, then is asked to sign up; the prompt (kept in
      // sessionStorage above) is carried into the survey afterwards.
      if (status === "ready" && !user) {
        openAuth({ mode: "register", next: "/mulai" });
        return;
      }
      router.push("/mulai");
    } else {
      const q = new URLSearchParams({ topik: tab });
      if (prompt) q.set("pesan", prompt.slice(0, 400));
      router.push(`/kontak?${q.toString()}`);
    }
  }

  const tpl = templates.find((t) => t.id === template);

  return (
    <div className="mx-auto w-full max-w-[44rem]">
      {/* Tabs */}
      <LayoutGroup id={`tabs-${uid}`}>
        <div
          role="tablist"
          aria-label="Jenis proyek"
          className="mx-auto mb-4 flex w-fit items-center gap-1 rounded-full border border-line bg-ink/[0.04] p-1"
        >
          {tabs.map((t) => {
            const selected = t.id === tab;
            return (
              <button
                key={t.id}
                role="tab"
                type="button"
                aria-selected={selected}
                onClick={() => {
                  setTab(t.id);
                  if (t.id !== "website") setTemplate(null);
                }}
                className={cn(
                  "relative inline-flex h-9 items-center gap-2 whitespace-nowrap rounded-full px-3.5 text-sm font-medium transition-colors sm:px-4",
                  selected ? "text-ink" : "text-muted hover:text-ink",
                )}
              >
                {selected ? (
                  <motion.span
                    layoutId="hero-tab"
                    className="absolute inset-0 rounded-full bg-surface shadow-card ring-1 ring-line"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                ) : null}
                <span className="relative inline-flex items-center gap-2">
                  <Icon name={t.icon} className="hidden size-4 sm:block" />
                  {t.label}
                </span>
              </button>
            );
          })}
        </div>
      </LayoutGroup>

      {/* Prompt box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        className="rounded-prompt border border-line bg-surface p-2.5 text-left shadow-prompt transition-shadow focus-within:shadow-pop focus-within:ring-4 focus-within:ring-ink/[0.04]"
      >
        <div className="relative">
          <textarea
            ref={taRef}
            rows={2}
            value={value}
            maxLength={1200}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submit();
              }
            }}
            aria-label="Ceritakan bisnis Anda atau tempel URL website lama"
            className="block max-h-[200px] min-h-[3.5rem] w-full resize-none bg-transparent px-3 py-2 text-[1.05rem] font-light leading-7 text-ink outline-none sm:text-lg"
          />
          {!value ? (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-3 top-2 line-clamp-2 text-[1.05rem] font-light leading-7 text-muted sm:text-lg"
            >
              {placeholder}
              {typing ? (
                <span className="ml-px inline-block h-[1.1em] w-px translate-y-[0.2em] animate-caret bg-ink/50" />
              ) : null}
            </span>
          ) : null}
        </div>

        <div className="mt-1 flex items-center justify-between gap-2 px-1 pb-0.5 pt-1">
          <div ref={menuRef} className="relative">
            {tab === "website" ? (
              <>
                <button
                  type="button"
                  aria-haspopup="listbox"
                  aria-expanded={menuOpen}
                  onClick={() => setMenuOpen((o) => !o)}
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-sm text-muted transition-colors hover:bg-ink/5 hover:text-ink"
                >
                  <Icon name="template" className="size-4" />
                  <span className="max-w-[9rem] truncate">{tpl ? tpl.name : "Pilih template"}</span>
                  <Icon name="chevron-down" className={cn("size-3.5 transition-transform", menuOpen && "rotate-180")} />
                </button>
                <AnimatePresence>
                  {menuOpen ? (
                    <motion.ul
                      role="listbox"
                      aria-label="Template"
                      initial={{ opacity: 0, y: 6, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4 }}
                      transition={{ duration: 0.15 }}
                      className="absolute bottom-full left-0 z-20 mb-2 w-60 rounded-xl border border-line bg-surface p-1.5 shadow-pop"
                    >
                      {[{ id: null, name: "Tanpa template" }, ...templates].map((t) => (
                        <li key={t.id ?? "none"} role="option" aria-selected={template === t.id}>
                          <button
                            type="button"
                            onClick={() => {
                              setTemplate(t.id);
                              setMenuOpen(false);
                            }}
                            className={cn(
                              "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-sand",
                              template === t.id && "font-semibold text-ink",
                            )}
                          >
                            {t.name}
                            {template === t.id ? <Icon name="check" className="size-4 text-accent" /> : null}
                          </button>
                        </li>
                      ))}
                    </motion.ul>
                  ) : null}
                </AnimatePresence>
              </>
            ) : (
              <span className="inline-flex h-9 items-center px-2.5 text-sm text-muted">
                Tim kami menghubungi Anda untuk konsultasi
              </span>
            )}
          </div>

          <button
            type="submit"
            className="inline-flex h-10 shrink-0 items-center gap-2 rounded-[11px] bg-ink px-4 text-sm font-semibold text-white transition-[background-color,transform] hover:bg-ink-soft active:translate-y-px sm:px-5"
          >
            {active.cta}
            <Icon name="arrow-right" className="size-4" />
          </button>
        </div>
      </form>
    </div>
  );
}

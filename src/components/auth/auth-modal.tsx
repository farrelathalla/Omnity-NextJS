"use client";

import { useEffect, useRef } from "react";
import { Icon } from "@/components/icon";
import { LoginForm, RegisterForm } from "@/components/forms/auth-forms";
import { OmnityMark } from "@/components/brand/logo";
import { cn } from "@/lib/utils";

type Mode = "login" | "register";

/**
 * Login / register as a modal on top of the current page, so context is not lost
 * (brief chapter 09). Built on the native <dialog>: focus trapping, Escape and
 * the backdrop come from the browser.
 */
export function AuthModal({
  state,
  onClose,
  onMode,
}: {
  state: { mode: Mode; next?: string } | null;
  onClose: () => void;
  onMode: (m: Mode) => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const open = state !== null;

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  const mode = state?.mode ?? "login";
  const next = state?.next;

  return (
    <dialog
      ref={ref}
      aria-labelledby="auth-title"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose(); // click on the backdrop
      }}
      className="m-auto max-h-[92dvh] w-[min(94vw,30rem)] overflow-y-auto overscroll-contain rounded-2xl border border-line bg-surface p-0 text-ink shadow-pop backdrop:bg-ink/50 backdrop:backdrop-blur-sm"
    >
      {open ? (
        <div className="p-6 sm:p-8">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <OmnityMark className="size-9" />
              <h2 id="auth-title" className="mt-4 font-serif text-4xl leading-none tracking-tight">
                {mode === "login" ? "Masuk" : "Buat akun"}
              </h2>
              <p className="mt-2 text-sm text-muted">
                {mode === "login"
                  ? "Masuk untuk melanjutkan."
                  : "Daftar untuk memakai Design Anything, bertanya di forum, dan berkomentar."}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup"
              className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-muted transition-colors hover:bg-ink/5 hover:text-ink"
            >
              <Icon name="x" className="size-5" />
            </button>
          </div>

          <div role="tablist" aria-label="Masuk atau daftar" className="mb-6 grid grid-cols-2 gap-1 rounded-full border border-line bg-ink/[0.04] p-1">
            {(["login", "register"] as const).map((m) => (
              <button
                key={m}
                role="tab"
                type="button"
                aria-selected={mode === m}
                onClick={() => onMode(m)}
                className={cn(
                  "h-9 rounded-full text-sm font-medium transition-colors",
                  mode === m ? "bg-surface text-ink shadow-card ring-1 ring-line" : "text-muted hover:text-ink",
                )}
              >
                {m === "login" ? "Masuk" : "Daftar"}
              </button>
            ))}
          </div>

          {mode === "login" ? (
            <LoginForm next={next} onNavigate={onClose} onSwitchToRegister={() => onMode("register")} />
          ) : (
            <RegisterForm next={next} onSwitchToLogin={() => onMode("login")} />
          )}
        </div>
      ) : null}
    </dialog>
  );
}

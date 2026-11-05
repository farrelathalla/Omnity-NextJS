"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Icon } from "@/components/icon";
import { site } from "@/lib/site";

const KEY = "omnity:announcement:v1";

/** Thin dismissible bar above the header (like aidesigner.ai). */
export function AnnouncementBar() {
  const [hidden, setHidden] = useState(false);
  const a = site.announcement;

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      try {
        if (localStorage.getItem(KEY) === "1") setHidden(true);
      } catch {
        /* storage unavailable: keep it visible */
      }
    });
    return () => cancelAnimationFrame(id);
  }, []);

  if (!a || hidden) return null;

  return (
    <div className="relative border-b border-line bg-surface">
      <div className="mx-auto flex min-h-10 max-w-[1200px] items-center justify-center gap-3 px-10 py-1.5 text-center text-[0.8rem] text-ink sm:text-sm">
        <span className="line-clamp-2 sm:line-clamp-1">{a.text}</span>
        <Link
          href={a.href}
          className="hidden shrink-0 rounded-full bg-ink px-3 py-1 text-xs font-semibold text-white transition-colors hover:bg-ink-soft sm:inline-block"
        >
          {a.cta}
        </Link>
      </div>
      <button
        type="button"
        aria-label="Tutup pengumuman"
        onClick={() => {
          setHidden(true);
          try {
            localStorage.setItem(KEY, "1");
          } catch {
            /* ignore */
          }
        }}
        className="absolute right-2 top-1/2 inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-muted transition-colors hover:bg-ink/5 hover:text-ink sm:right-4"
      >
        <Icon name="x" className="size-4" />
      </button>
    </div>
  );
}

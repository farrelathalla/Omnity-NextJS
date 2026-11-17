"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { cn } from "@/lib/utils";

/**
 * Shared building blocks for the interactive portfolio demos.
 *
 * A demo fills a fixed-size stage (see WorkDemoStage). It scrolls inside its
 * own container, so overlays (modals, toasts) are positioned against the stage
 * and never escape onto the real page. The stage is a CSS container, so demos
 * lay themselves out with @container variants (@3xl:, @4xl:, ...) instead of
 * viewport breakpoints.
 */
export function DemoRoot({
  children,
  overlay,
  className,
  scrollRef,
}: {
  children: ReactNode;
  overlay?: ReactNode;
  className?: string;
  scrollRef?: RefObject<HTMLDivElement | null>;
}) {
  return (
    <div className="relative h-full overflow-hidden">
      <div
        ref={scrollRef}
        data-demo-scroll
        className={cn("scrollbar-thin absolute inset-0 overflow-y-auto", className)}
      >
        {children}
      </div>
      {overlay}
    </div>
  );
}

/** Scroll container ref with a helper to jump back to the top on view change. */
export function useDemoScroll() {
  const ref = useRef<HTMLDivElement>(null);
  const toTop = useCallback(() => ref.current?.scrollTo({ top: 0, behavior: "smooth" }), []);
  const toId = useCallback((id: string) => {
    const root = ref.current;
    const el = root?.querySelector<HTMLElement>(`[data-anchor="${id}"]`);
    if (root && el) root.scrollTo({ top: el.offsetTop - 64, behavior: "smooth" });
  }, []);
  return { ref, toTop, toId };
}

/** Small transient message at the bottom of the stage. */
export function useToast() {
  const [msg, setMsg] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const show = useCallback((m: string) => {
    setMsg(m);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setMsg(null), 2800);
  }, []);
  useEffect(() => () => clearTimeout(timer.current), []);
  const node = (
    <div
      aria-live="polite"
      className={cn(
        "pointer-events-none absolute inset-x-0 bottom-5 z-50 flex justify-center px-4 transition-all duration-300",
        msg ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
      )}
    >
      {msg ? (
        <span className="rounded-full bg-[#0e1220] px-4 py-2 text-[13px] font-medium text-white shadow-lg">
          {msg}
        </span>
      ) : null}
    </div>
  );
  return { show, node };
}

/** Modal sheet that covers the stage. */
export function DemoModal({
  open,
  onClose,
  children,
  className,
  label,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  label: string;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Tutup"
        onClick={onClose}
        className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={label}
        className={cn(
          "relative max-h-full w-full max-w-md overflow-y-auto rounded-2xl bg-white shadow-2xl",
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}

/** Deterministic pseudo QR code (decorative). */
export function FakeQr({ seed, className }: { seed: string; className?: string }) {
  const n = 25;
  let h = 2166136261;
  for (const c of seed) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  const cells: boolean[] = [];
  for (let i = 0; i < n * n; i++) {
    h ^= h << 13;
    h ^= h >>> 17;
    h ^= h << 5;
    cells.push((h >>> 0) % 100 < 48);
  }
  const finder = (x: number, y: number) =>
    [[0, 0], [n - 7, 0], [0, n - 7]].some(([fx, fy]) => x >= fx && x < fx + 7 && y >= fy && y < fy + 7);
  return (
    <svg viewBox={`0 0 ${n} ${n}`} className={className} shapeRendering="crispEdges" aria-hidden="true">
      <rect width={n} height={n} fill="#fff" />
      {cells.map((on, i) => {
        const x = i % n;
        const y = Math.floor(i / n);
        return on && !finder(x, y) ? <rect key={i} x={x} y={y} width={1} height={1} fill="#111" /> : null;
      })}
      {[[0, 0], [n - 7, 0], [0, n - 7]].map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <rect x={x} y={y} width={7} height={7} fill="#111" />
          <rect x={x + 1} y={y + 1} width={5} height={5} fill="#fff" />
          <rect x={x + 2} y={y + 2} width={3} height={3} fill="#111" />
        </g>
      ))}
    </svg>
  );
}

export const rupiah = (n: number) => "Rp" + n.toLocaleString("id-ID");

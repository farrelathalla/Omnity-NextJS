"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/icon";

/**
 * A whole page inside a browser window. It glides down on its own when hovered
 * (or when "Putar" is pressed on touch screens) and stops as soon as the
 * visitor scrolls by hand, so it never fights the user.
 */
export function ScrollPreview({
  src,
  width,
  height,
  host,
  url,
  alt,
}: {
  src: string;
  width: number;
  height: number;
  host: string;
  url?: string;
  alt: string;
}) {
  const box = useRef<HTMLDivElement>(null);
  const raf = useRef<number>(0);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const onScroll = () => {
      const max = el.scrollHeight - el.clientHeight;
      setProgress(max > 0 ? el.scrollTop / max : 0);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const el = box.current;
    if (!playing || !el) return;
    let last = performance.now();
    const step = (now: number) => {
      const dt = Math.min(64, now - last);
      last = now;
      const max = el.scrollHeight - el.clientHeight;
      if (el.scrollTop >= max - 1) {
        setPlaying(false);
        return;
      }
      // ~ one viewport every 4 seconds, independent of the frame rate.
      el.scrollTop += (el.clientHeight / 4000) * dt;
      raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    const stop = () => setPlaying(false);
    el.addEventListener("wheel", stop, { passive: true });
    el.addEventListener("touchstart", stop, { passive: true });
    return () => {
      cancelAnimationFrame(raf.current);
      el.removeEventListener("wheel", stop);
      el.removeEventListener("touchstart", stop);
    };
  }, [playing]);

  const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const restart = () => {
    const el = box.current;
    if (!el) return;
    if (progress > 0.99) {
      el.scrollTo({ top: 0 });
      if (reducedMotion()) return;
    }
    // Reduced motion: step one screen per press instead of gliding.
    if (reducedMotion()) el.scrollBy({ top: el.clientHeight * 0.9 });
    else setPlaying((p) => !p);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-surface shadow-pop">
      <div className="flex h-10 items-center gap-3 border-b border-line bg-sand px-3.5">
        <span aria-hidden="true" className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-ink/15" />
          <span className="size-2.5 rounded-full bg-ink/15" />
          <span className="size-2.5 rounded-full bg-ink/15" />
        </span>
        <span className="mx-auto flex max-w-[55%] items-center gap-1.5 truncate rounded-md bg-surface px-3 py-0.5 text-[0.7rem] text-muted">
          <span className="size-1.5 shrink-0 rounded-full bg-leaf" aria-hidden="true" />
          <span className="truncate">{host}</span>
        </span>
        <button
          type="button"
          onClick={restart}
          className="inline-flex h-7 items-center gap-1.5 rounded-full border border-line bg-surface px-3 text-[0.72rem] font-semibold text-ink/80 transition-colors hover:border-ink/30 hover:text-ink"
        >
          {playing ? "Jeda" : progress > 0.99 ? "Ulangi" : "Putar"}
        </button>
      </div>
      <div className="relative">
        <div
          ref={box}
          tabIndex={0}
          aria-label={`Pratinjau satu halaman penuh ${host}. Gulir untuk menjelajah.`}
          onMouseEnter={() => progress < 0.99 && !reducedMotion() && setPlaying(true)}
          onMouseLeave={() => setPlaying(false)}
          className="scrollbar-thin h-[520px] overflow-y-auto sm:h-[600px] lg:h-[640px]"
        >
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            sizes="(min-width: 1024px) 1100px, 100vw"
            quality={80}
            className="block h-auto w-full"
          />
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1 bg-ink/5">
          <div className="h-full bg-brand transition-[width] duration-150" style={{ width: `${progress * 100}%` }} />
        </div>
        {url ? (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-4 right-4 inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-xs font-semibold text-white shadow-lg transition-transform hover:-translate-y-0.5"
          >
            Buka situs asli <Icon name="arrow-up-right" className="size-3.5" />
          </a>
        ) : null}
      </div>
    </div>
  );
}

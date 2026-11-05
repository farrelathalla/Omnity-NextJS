"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Phase = "visible" | "hidden" | "shown";

/**
 * Fade + rise when scrolled into view.
 *
 * The server renders the content VISIBLE. After mount, only elements that are
 * below the fold are hidden and then revealed by an IntersectionObserver, so
 * above-the-fold content (the LCP) never waits for hydration, and visitors
 * without JavaScript or with reduced motion simply see everything.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 20,
}: {
  children: ReactNode;
  className?: string;
  /** milliseconds */
  delay?: number;
  /** starting offset in px */
  y?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<Phase>("visible");

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let io: IntersectionObserver | undefined;
    const id = requestAnimationFrame(() => {
      // Already on screen at mount: leave it visible, no animation.
      if (el.getBoundingClientRect().top < window.innerHeight * 0.94) return;
      setPhase("hidden");
      io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setPhase("shown");
            io?.disconnect();
          }
        },
        { rootMargin: "0px 0px -6% 0px", threshold: 0.04 },
      );
      io.observe(el);
    });
    return () => {
      cancelAnimationFrame(id);
      io?.disconnect();
    };
  }, []);

  return (
    <div
      ref={ref}
      data-reveal
      data-shown={phase !== "hidden"}
      style={{
        transitionDelay: phase === "shown" ? `${delay}ms` : undefined,
        transform: phase === "hidden" ? `translateY(${y}px)` : undefined,
      }}
      className={cn(
        "transition-[opacity,transform] duration-700 ease-out-soft motion-reduce:!transform-none motion-reduce:!opacity-100 motion-reduce:transition-none",
        phase === "hidden" ? "opacity-0" : "opacity-100",
        className,
      )}
    >
      {children}
    </div>
  );
}

"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Fade + rise when scrolled into view. CSS-driven (IntersectionObserver +
 * transitions) so there is no hydration mismatch; reduced motion shows the
 * content immediately, and the <noscript> rule in the root layout covers
 * visitors without JavaScript.
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
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      const id = requestAnimationFrame(() => setShown(true));
      return () => cancelAnimationFrame(id);
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.04 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-reveal
      data-shown={shown}
      style={{
        transitionDelay: shown ? `${delay}ms` : undefined,
        transform: shown ? undefined : `translateY(${y}px)`,
      }}
      className={cn(
        "transition-[opacity,transform] duration-700 ease-out-soft motion-reduce:!transform-none motion-reduce:!opacity-100 motion-reduce:transition-none",
        shown ? "opacity-100" : "opacity-0",
        className,
      )}
    >
      {children}
    </div>
  );
}

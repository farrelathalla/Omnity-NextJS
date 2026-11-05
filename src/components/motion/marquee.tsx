import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Seamless horizontal marquee. Content is rendered twice and the track slides
 * by -50%, so the loop has no jump. Pauses on hover; stops for reduced motion
 * (the strip then becomes horizontally scrollable).
 */
export function Marquee({
  children,
  direction = "left",
  duration = 130,
  gap = "gap-4",
  className,
}: {
  children: ReactNode;
  direction?: "left" | "right";
  /** seconds for one full loop */
  duration?: number;
  gap?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "group/marquee overflow-hidden motion-reduce:overflow-x-auto motion-reduce:scrollbar-none",
        className,
      )}
    >
      <div
        className={cn(
          "flex w-max",
          direction === "left" ? "animate-marquee-left" : "animate-marquee-right",
          "group-hover/marquee:[animation-play-state:paused]",
        )}
        style={{ "--marquee-duration": `${duration}s` } as CSSProperties}
      >
        <div className={cn("flex shrink-0 pr-4", gap)}>{children}</div>
        <div className={cn("flex shrink-0 pr-4", gap)} aria-hidden="true" inert>
          {children}
        </div>
      </div>
    </div>
  );
}

import { cn } from "@/lib/utils";

/**
 * Ring mark recreated from the brief (orange + red). The client's original
 * SVG is still requested (docs/CONTENT_TODO.md); swap the paths when it arrives.
 */
export function OmnityMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      className={cn("size-8 shrink-0", className)}
      aria-hidden="true"
    >
      <circle
        cx="20"
        cy="20"
        r="14"
        stroke="#F5A412"
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray="41 46.96"
        transform="rotate(118 20 20)"
      />
      <circle
        cx="20"
        cy="20"
        r="14"
        stroke="#E0391F"
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray="38 49.96"
        transform="rotate(-62 20 20)"
      />
    </svg>
  );
}

export function OmnityLogo({
  className,
  tone = "dark",
  markClassName,
}: {
  className?: string;
  tone?: "dark" | "light";
  markClassName?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2.5",
        tone === "dark" ? "text-ink" : "text-white",
        className,
      )}
    >
      <OmnityMark className={markClassName} />
      <span className="text-[0.95rem] font-bold uppercase tracking-[0.2em]">
        Omnity
      </span>
    </span>
  );
}

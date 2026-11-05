import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/** White card, 1px border, 16px radius. `interactive` lifts 2px on hover. */
export function Card({
  className,
  interactive,
  ...props
}: ComponentProps<"div"> & { interactive?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-card border border-line bg-surface shadow-card",
        interactive &&
          "transition-[transform,box-shadow,border-color] duration-300 ease-out-soft hover:-translate-y-0.5 hover:border-ink/15 hover:shadow-card-hover",
        className,
      )}
      {...props}
    />
  );
}

/** Soft sand tile used for brief-style info boxes. */
export function Tile({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("rounded-card border border-line/70 bg-sand p-5", className)}
      {...props}
    />
  );
}

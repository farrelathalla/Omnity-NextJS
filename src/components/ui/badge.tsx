import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[0.7rem] font-semibold uppercase tracking-wider",
  {
    variants: {
      tone: {
        neutral: "bg-ink/5 text-ink-soft",
        brand: "bg-brand-50 text-accent",
        sky: "bg-sky-50 text-sky",
        leaf: "bg-leaf-50 text-leaf",
        dark: "bg-ink text-white",
      },
    },
    defaultVariants: { tone: "neutral" },
  },
);

export function Badge({
  className,
  tone,
  ...props
}: ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}

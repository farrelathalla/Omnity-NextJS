import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap font-medium transition-[background-color,color,border-color,box-shadow,transform] duration-200 ease-out-soft select-none disabled:pointer-events-none disabled:opacity-50 active:translate-y-px",
  {
    variants: {
      variant: {
        primary:
          "bg-ink text-white shadow-card hover:bg-ink-soft hover:shadow-card-hover",
        brand:
          "bg-brand text-white shadow-card hover:bg-brand-600 hover:shadow-card-hover",
        secondary:
          "border border-line bg-surface text-ink hover:border-ink/25 hover:bg-sand",
        ghost: "text-ink hover:bg-ink/5",
        light: "bg-white text-ink hover:bg-white/90",
        "outline-light":
          "border border-white/20 text-white hover:border-white/40 hover:bg-white/5",
      },
      size: {
        sm: "h-9 px-3.5 text-sm",
        md: "h-11 px-5 text-sm",
        lg: "h-12 px-6 text-base",
      },
      shape: {
        rounded: "rounded-[11px]",
        pill: "rounded-full",
      },
    },
    defaultVariants: { variant: "primary", size: "md", shape: "rounded" },
  },
);

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;

export function Button({
  className,
  variant,
  size,
  shape,
  type = "button",
  ...props
}: ComponentProps<"button"> & ButtonVariantProps) {
  return (
    <button
      type={type}
      className={cn(buttonVariants({ variant, size, shape }), className)}
      {...props}
    />
  );
}

/** A `next/link` styled as a button. */
export function ButtonLink({
  className,
  variant,
  size,
  shape,
  ...props
}: ComponentProps<typeof Link> & ButtonVariantProps) {
  return (
    <Link
      className={cn(buttonVariants({ variant, size, shape }), className)}
      {...props}
    />
  );
}

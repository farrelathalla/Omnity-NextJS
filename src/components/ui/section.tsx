import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Container({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("mx-auto w-full max-w-[1200px] px-5 sm:px-6 lg:px-8", className)}
      {...props}
    />
  );
}

/** Small uppercase label above a heading (brief: "kicker"). */
export function Kicker({ className, ...props }: ComponentProps<"p">) {
  return (
    <p
      className={cn(
        "text-xs font-semibold uppercase tracking-[0.18em] text-brand",
        className,
      )}
      {...props}
    />
  );
}

/**
 * The italic serif keyword inside a heading.
 * `brand` = orange (section titles), `ink` = grey gradient (hero, as aidesigner.ai).
 */
export function Em({
  tone = "brand",
  className,
  children,
}: {
  tone?: "brand" | "ink";
  className?: string;
  children: ReactNode;
}) {
  return (
    <em
      className={cn(
        "font-serif italic",
        tone === "brand" ? "text-brand" : "text-gradient-ink",
        className,
      )}
    >
      {children}
    </em>
  );
}

export function SectionHeader({
  kicker,
  title,
  lead,
  align = "left",
  className,
  titleClassName,
  as: Tag = "h2",
}: {
  kicker?: string;
  title: ReactNode;
  lead?: ReactNode;
  align?: "left" | "center";
  className?: string;
  titleClassName?: string;
  as?: "h1" | "h2" | "h3";
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {kicker ? <Kicker className="mb-3">{kicker}</Kicker> : null}
      <Tag
        className={cn(
          "font-serif text-4xl font-normal leading-[1.05] tracking-tight text-ink sm:text-5xl",
          titleClassName,
        )}
      >
        {title}
      </Tag>
      {lead ? (
        <p className="mt-4 text-lg leading-relaxed text-muted">{lead}</p>
      ) : null}
    </div>
  );
}

/** Vertical rhythm wrapper for page sections. */
export function Section({
  className,
  ...props
}: ComponentProps<"section">) {
  return <section className={cn("py-20 sm:py-24", className)} {...props} />;
}

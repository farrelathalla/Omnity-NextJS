import Link from "next/link";
import type { ReactNode } from "react";
import { Icon } from "@/components/icon";
import { Backdrop } from "@/components/layout/backdrop";
import { Container, Kicker } from "@/components/ui/section";
import { JsonLd } from "@/components/json-ld";
import { siteUrl } from "@/lib/site";
import { cn } from "@/lib/utils";

export type Crumb = { label: string; href: string };

export function Breadcrumbs({ items, className }: { items: Crumb[]; className?: string }) {
  const all: Crumb[] = [{ label: "Beranda", href: "/" }, ...items];
  return (
    <>
      <nav aria-label="Breadcrumb" className={cn("text-sm text-muted", className)}>
        <ol className="flex flex-wrap items-center gap-1.5">
          {all.map((c, i) => (
            <li key={c.href} className="flex items-center gap-1.5">
              {i > 0 ? <Icon name="chevron-down" className="size-3.5 -rotate-90" /> : null}
              {i < all.length - 1 ? (
                <Link href={c.href} className="transition-colors hover:text-ink">
                  {c.label}
                </Link>
              ) : (
                <span aria-current="page" className="text-ink">
                  {c.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: all.map((c, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: c.label,
            item: `${siteUrl}${c.href}`,
          })),
        }}
      />
    </>
  );
}

/** Top of every inner page: kicker, serif title, lead and optional actions. */
export function PageHero({
  kicker,
  title,
  lead,
  actions,
  crumbs,
  align = "left",
  children,
}: {
  kicker?: string;
  title: ReactNode;
  lead?: ReactNode;
  actions?: ReactNode;
  crumbs?: Crumb[];
  align?: "left" | "center";
  children?: ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden pb-14 pt-10 sm:pb-20 sm:pt-14">
      <Backdrop className="[mask-image:linear-gradient(to_bottom,#000_40%,transparent)]" />
      <Container>
        {crumbs ? <Breadcrumbs items={crumbs} className="mb-8" /> : null}
        <div className={cn("animate-hero-enter", align === "center" && "text-center")}>
          {kicker ? <Kicker className="mb-4">{kicker}</Kicker> : null}
          <h1
            className={cn(
              "max-w-4xl font-serif text-5xl font-normal leading-[0.98] tracking-tight text-ink sm:text-7xl",
              align === "center" && "mx-auto",
            )}
          >
            {title}
          </h1>
          {lead ? (
            <p
              className={cn(
                "mt-6 max-w-2xl text-lg leading-relaxed text-muted sm:text-xl",
                align === "center" && "mx-auto",
              )}
            >
              {lead}
            </p>
          ) : null}
          {actions ? (
            <div
              className={cn(
                "mt-8 flex flex-wrap items-center gap-3",
                align === "center" && "justify-center",
              )}
            >
              {actions}
            </div>
          ) : null}
        </div>
        {children}
      </Container>
    </section>
  );
}

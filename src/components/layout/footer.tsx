import Link from "next/link";
import { OmnityLogo } from "@/components/brand/logo";
import { Icon } from "@/components/icon";
import { products } from "@/content/products";
import { services } from "@/content/services";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

const company = [
  { href: "/tentang", label: "Tentang Kami" },
  { href: "/journey", label: "Journey" },
  { href: "/karier", label: "Karier" },
  { href: "/blog", label: "Blog" },
  { href: "/forum", label: "Forum" },
  { href: "/kontak", label: "Kontak" },
  { href: "/privasi", label: "Kebijakan Privasi" },
  { href: "/syarat", label: "Syarat & Ketentuan" },
];

function Column({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
        {title}
      </h2>
      <ul className="mt-5 space-y-2.5">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="text-[0.95rem] text-white/80 transition-colors hover:text-white"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Dark footer. On large screens it is `sticky bottom-0` underneath the page
 * sheet, so the sheet slides away and reveals it (the aidesigner.ai effect).
 * The giant transparent OMNITY wordmark is clipped at the bottom edge.
 */
export function Footer({ className }: { className?: string }) {
  return (
    <footer
      className={cn(
        "relative z-0 w-full overflow-hidden bg-night text-white reveal:sticky reveal:bottom-0",
        className,
      )}
    >
      <div className="mx-auto max-w-[1200px] px-5 pb-10 pt-16 sm:px-6 lg:px-8 lg:pt-20">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_2fr]">
          <div>
            <OmnityLogo tone="light" markClassName="size-9" />
            <p className="mt-6 max-w-sm text-[1.05rem] leading-relaxed text-white/60">
              Dari pembayaran digital, HRIS, sampai website: kami merancang dan membangun
              solusi untuk bisnis Anda.
            </p>
            <Link
              href="/mulai"
              className="group mt-7 inline-flex h-12 items-center gap-3 rounded-full bg-white pl-6 pr-2 text-sm font-semibold text-ink transition-colors hover:bg-white/90"
            >
              Mulai Proyek
              <span className="inline-flex size-8 items-center justify-center rounded-full bg-ink text-white transition-transform duration-300 group-hover:translate-x-0.5">
                <Icon name="arrow-right" className="size-4" />
              </span>
            </Link>

            <div className="mt-8 flex flex-wrap items-center gap-3 text-xs text-white/55">
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 px-3 py-1.5 font-medium">
                <Icon name="shield-check" className="size-4" />
                PCI DSS Compliant
              </span>
              {site.social.map((s) => (
                <a
                  key={s.href}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg border border-white/15 px-3 py-1.5 hover:border-white/40 hover:text-white"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3">
            <Column
              title="Produk"
              links={products.map((p) => ({ href: `/produk/${p.slug}`, label: p.name }))}
            />
            <Column
              title="Layanan"
              links={services.map((s) => ({ href: `/layanan/${s.slug}`, label: s.name }))}
            />
            <div className="col-span-2 sm:col-span-1">
              <Column title="Perusahaan" links={company} />
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-16 flex flex-col gap-2 border-t border-white/10 pt-6 text-[0.8rem] leading-relaxed text-white/60 lg:flex-row lg:items-center lg:justify-between">
          <p>
            © {new Date().getFullYear()} {site.legalName}. Hak cipta dilindungi.
          </p>
          <p>
            {site.address.line1}, {site.address.line2}, {site.address.city} ·{" "}
            <a href={`mailto:${site.email}`} className="hover:text-white">
              {site.email}
            </a>
          </p>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none relative -mt-6 h-[7.5rem] select-none overflow-hidden sm:h-[10rem] lg:h-[13rem]"
      >
        <span
          data-text="Omnity"
          className="absolute inset-x-0 top-0 block whitespace-nowrap text-center text-[26vw] font-bold uppercase leading-[0.8] tracking-tight text-transparent after:text-white/[0.045] after:content-[attr(data-text)] min-[1280px]:text-[19rem]"
        />
      </div>
    </footer>
  );
}

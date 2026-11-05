import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BrowserFrame, PhoneFrame } from "@/components/device-frames";
import { CtaBand } from "@/components/home/cta-band";
import { Icon } from "@/components/icon";
import { JsonLd } from "@/components/json-ld";
import { Reveal } from "@/components/motion/reveal";
import { PageHero } from "@/components/page-hero";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Container, Em, Section } from "@/components/ui/section";
import { workBySlug, works } from "@/content/works";
import { siteUrl } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return works.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: PageProps<"/karya/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const w = workBySlug(slug);
  if (!w) return {};
  return {
    title: w.name,
    description: w.summary,
    alternates: { canonical: `/karya/${w.slug}` },
    openGraph: {
      title: `${w.name} | Karya Omnity`,
      description: w.summary,
      images: [{ url: w.shots[0].src, width: w.shots[0].width, height: w.shots[0].height }],
    },
  };
}

export default async function WorkPage({ params }: PageProps<"/karya/[slug]">) {
  const { slug } = await params;
  const w = workBySlug(slug);
  if (!w) notFound();

  const desktop = w.shots.filter((s) => s.kind === "desktop");
  const mobile = w.shots.filter((s) => s.kind === "mobile");
  const idx = works.findIndex((x) => x.slug === w.slug);
  const next = works[(idx + 1) % works.length];

  return (
    <>
      <PageHero
        kicker={w.category}
        crumbs={[
          { label: "Karya", href: "/karya" },
          { label: w.name, href: `/karya/${w.slug}` },
        ]}
        title={w.name}
        lead={w.summary}
        actions={
          <>
            <ButtonLink href={w.url} target="_blank" rel="noopener noreferrer" size="lg" shape="pill">
              Kunjungi {w.host}
              <Icon name="arrow-up-right" className="size-4" />
            </ButtonLink>
            <ButtonLink href="/mulai" variant="secondary" size="lg" shape="pill">
              Buat yang serupa
            </ButtonLink>
          </>
        }
      />

      <Section className="pb-8 pt-0 sm:pb-12 sm:pt-0">
        <Container>
          <Reveal>
            <ul className="grid gap-3 sm:grid-cols-3">
              {w.highlights.map((h) => (
                <li
                  key={h}
                  className="flex items-start gap-3 rounded-card border border-line bg-surface p-5 text-[0.97rem]"
                >
                  <Icon name="check" className="mt-0.5 size-5 shrink-0 text-accent" />
                  {h}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-muted">{w.role}</p>
          </Reveal>
        </Container>
      </Section>

      <Section className="pt-8 sm:pt-12">
        <Container>
          <div className="mx-auto max-w-[1100px] space-y-14">
            {desktop.map((s, i) => (
              <Reveal key={s.src}>
                <figure>
                  <BrowserFrame
                    src={s.src}
                    alt={`${w.name}: ${s.caption}`}
                    host={w.host}
                    width={s.width}
                    height={s.height}
                    priority={i === 0}
                  />
                  <figcaption className="mt-4 flex items-center gap-3 text-sm text-muted">
                    <Badge tone="brand">Desktop</Badge>
                    {s.caption}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {mobile.length > 0 ? (
        <Section className="border-y border-line bg-sand/60 py-16 sm:py-20">
          <Container>
            <Reveal>
              <h2 className="font-serif text-3xl tracking-tight sm:text-4xl">
                Di ponsel, <Em>tetap rapi.</Em>
              </h2>
              <p className="mt-3 max-w-xl text-muted">
                Tampilan mobile yang sama, disusun ulang untuk layar sempit dan sentuhan.
              </p>
            </Reveal>
            <Reveal delay={80}>
              <div className="scrollbar-none -mx-5 mt-10 flex snap-x gap-6 overflow-x-auto px-5 pb-4 sm:mx-0 sm:px-0 md:justify-center">
                {mobile.map((s) => (
                  <figure key={s.src} className="w-[220px] shrink-0 snap-start sm:w-[240px]">
                    <PhoneFrame
                      src={s.src}
                      alt={`${w.name}: ${s.caption}`}
                      width={s.width}
                      height={s.height}
                    />
                    <figcaption className="mt-3 text-center text-xs text-muted">
                      {s.caption.replace("Tampilan mobile: ", "")}
                    </figcaption>
                  </figure>
                ))}
              </div>
            </Reveal>
          </Container>
        </Section>
      ) : null}

      <Section className="py-14">
        <Container>
          <Link
            href={`/karya/${next.slug}`}
            className="group flex items-center justify-between gap-6 rounded-card border border-line bg-surface p-6 shadow-card transition-[box-shadow,transform] hover:-translate-y-0.5 hover:shadow-card-hover sm:p-8"
          >
            <span>
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Karya berikutnya</span>
              <span className="mt-1 block font-serif text-3xl tracking-tight sm:text-4xl">{next.name}</span>
            </span>
            <Icon name="arrow-right" className="size-7 shrink-0 text-accent transition-transform group-hover:translate-x-1" />
          </Link>
        </Container>
      </Section>
      <CtaBand />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          name: w.name,
          description: w.summary,
          url: `${siteUrl}/karya/${w.slug}`,
          image: `${siteUrl}${w.shots[0].src}`,
          creator: { "@type": "Organization", name: "Omnity" },
          about: w.category,
        }}
      />
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ConsultForm } from "@/components/forms/consult-form";
import { FaqList } from "@/components/faq-list";
import { Icon } from "@/components/icon";
import { JsonLd } from "@/components/json-ld";
import { Reveal } from "@/components/motion/reveal";
import { PageHero } from "@/components/page-hero";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container, Em, Section, SectionHeader } from "@/components/ui/section";
import { serviceDetails } from "@/content/service-details";
import { serviceBySlug, services } from "@/content/services";
import { site, siteUrl } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/layanan/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const s = serviceBySlug(slug);
  const d = serviceDetails[slug];
  if (!s || !d) return {};
  return {
    title: s.name,
    description: d.intro,
    alternates: { canonical: `/layanan/${s.slug}` },
    openGraph: { title: `${s.name} | Omnity`, description: d.intro },
  };
}

export default async function ServicePage({ params }: PageProps<"/layanan/[slug]">) {
  const { slug } = await params;
  const s = serviceBySlug(slug);
  const d = serviceDetails[slug];
  if (!s || !d) notFound();

  const others = services.filter((x) => x.slug !== s.slug).slice(0, 3);
  const isWebsite = s.slug === "pembuatan-website";

  return (
    <>
      <PageHero
        kicker="Layanan"
        crumbs={[
          { label: "Layanan", href: "/layanan" },
          { label: s.name, href: `/layanan/${s.slug}` },
        ]}
        title={s.name}
        lead={d.intro}
        actions={
          <>
            {isWebsite ? (
              <ButtonLink href="/mulai" size="lg" shape="pill">
                Mulai Desain
              </ButtonLink>
            ) : null}
            <ButtonLink
              href="#konsultasi"
              variant={isWebsite ? "secondary" : "primary"}
              size="lg"
              shape="pill"
            >
              Jadwalkan konsultasi
            </ButtonLink>
          </>
        }
      />

      <Section className="border-y border-line bg-sand/60 py-16 sm:py-20">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
            <Reveal>
              <h2 className="font-serif text-3xl tracking-tight sm:text-4xl">
                Cocok untuk <Em>siapa.</Em>
              </h2>
              <ul className="mt-6 space-y-3">
                {d.forWho.map((w) => (
                  <li key={w} className="flex items-start gap-3 text-[1.02rem] text-ink/85">
                    <Icon name="check" className="mt-1 size-4 shrink-0 text-accent" />
                    {w}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={100}>
              <h2 className="font-serif text-3xl tracking-tight sm:text-4xl">
                Yang Anda <Em>terima.</Em>
              </h2>
              <ul className="mt-6 space-y-3">
                {d.deliverables.map((x) => (
                  <li key={x} className="flex items-start gap-3 text-[1.02rem] text-ink/85">
                    <Icon name="check" className="mt-1 size-4 shrink-0 text-accent" />
                    {x}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <Reveal>
            <SectionHeader
              kicker="Prosesnya"
              title={
                <>
                  Empat langkah, <Em>tanpa kejutan.</Em>
                </>
              }
            />
          </Reveal>
          <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {d.process.map((p, i) => (
              <li key={p.title}>
                <Reveal delay={i * 80} className="h-full">
                  <Card className="h-full p-6">
                    <span className="font-serif text-4xl text-brand">{i + 1}</span>
                    <h3 className="mt-3 text-lg font-semibold tracking-tight">{p.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{p.text}</p>
                  </Card>
                </Reveal>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <Section id="konsultasi" className="scroll-mt-20 border-t border-line">
        <Container>
          <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
            <div>
              <Reveal>
                <SectionHeader
                  kicker="FAQ"
                  title={
                    <>
                      Pertanyaan <Em>umum.</Em>
                    </>
                  }
                />
              </Reveal>
              <div className="mt-8">
                <FaqList items={d.faqs} />
              </div>
            </div>
            <Reveal delay={100}>
              <div className="rounded-card border border-line bg-surface p-6 shadow-card sm:p-8">
                <h2 className="font-serif text-3xl tracking-tight">Jadwalkan konsultasi</h2>
                <p className="mb-6 mt-2 text-sm text-muted">
                  Ceritakan kebutuhan Anda tentang {s.name.toLowerCase()}. Kami membalas lewat email.
                </p>
                <ConsultForm defaultTopic={s.slug} source={`/layanan/${s.slug}`} />
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      <Section className="border-t border-line bg-sand/60 py-16">
        <Container>
          <p className="mb-6 text-sm font-semibold uppercase tracking-[0.16em] text-muted">Layanan lainnya</p>
          <div className="grid gap-4 sm:grid-cols-3">
            {others.map((o) => (
              <Link key={o.slug} href={`/layanan/${o.slug}`} className="group block">
                <Card interactive className="flex h-full items-start gap-4 p-5">
                  <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg border border-line group-hover:text-accent">
                    <Icon name={o.icon} className="size-5" />
                  </span>
                  <span>
                    <span className="block font-semibold">{o.name}</span>
                    <span className="block text-sm text-muted">{o.short}</span>
                  </span>
                </Card>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: s.name,
          description: d.intro,
          url: `${siteUrl}/layanan/${s.slug}`,
          provider: { "@type": "Organization", name: site.legalName, url: siteUrl },
          areaServed: "ID",
        }}
      />
    </>
  );
}

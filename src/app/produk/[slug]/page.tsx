import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ConsultForm } from "@/components/forms/consult-form";
import { FaqList } from "@/components/faq-list";
import { Icon } from "@/components/icon";
import { JsonLd } from "@/components/json-ld";
import { Reveal } from "@/components/motion/reveal";
import { PageHero } from "@/components/page-hero";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card, Tile } from "@/components/ui/card";
import { Container, Em, Kicker, Section, SectionHeader } from "@/components/ui/section";
import { productDetails } from "@/content/product-details";
import { productBySlug, products } from "@/content/products";
import { site, siteUrl } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/produk/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = productBySlug(slug);
  if (!p) return {};
  return {
    title: p.name,
    description: p.tagline,
    alternates: { canonical: `/produk/${p.slug}` },
    openGraph: { title: `${p.name} | Omnity`, description: p.tagline },
  };
}

export default async function ProductPage({ params }: PageProps<"/produk/[slug]">) {
  const { slug } = await params;
  const p = productBySlug(slug);
  const d = productDetails[slug];
  if (!p || !d) notFound();

  const related = products.filter((x) => x.slug !== p.slug).slice(0, 3);

  return (
    <>
      <PageHero
        kicker="Produk Omnity"
        crumbs={[
          { label: "Produk", href: "/produk" },
          { label: p.name, href: `/produk/${p.slug}` },
        ]}
        title={
          <span className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {p.name}
            {p.badge ? <Badge tone="leaf">{p.badge}</Badge> : null}
          </span>
        }
        lead={p.tagline}
        actions={
          <>
            <ButtonLink href={`/kontak?topik=produk-${p.slug}`} size="lg" shape="pill">
              Minta demo
            </ButtonLink>
            <ButtonLink href="/produk" variant="secondary" size="lg" shape="pill">
              Semua produk
            </ButtonLink>
          </>
        }
      />

      {/* Problem */}
      <Section className="border-y border-line bg-sand/60 py-16 sm:py-20">
        <Container>
          <Reveal>
            <div className="grid gap-8 lg:grid-cols-[1fr_2fr] lg:gap-16">
              <Kicker>Masalah yang diselesaikan</Kicker>
              <p className="font-serif text-3xl leading-snug tracking-tight text-ink sm:text-4xl">
                {d.problem}
              </p>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* Features */}
      <Section>
        <Container>
          <Reveal>
            <SectionHeader
              kicker="Fitur utama"
              title={
                <>
                  Yang Anda dapatkan dengan <Em>{p.name}.</Em>
                </>
              }
            />
          </Reveal>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {d.features.map((f, i) => (
              <Reveal key={f.title} delay={i * 70}>
                <Card className="h-full p-6">
                  <span className="inline-flex size-9 items-center justify-center rounded-lg bg-brand-50 font-serif text-lg text-brand">
                    {i + 1}
                  </span>
                  <h3 className="mt-5 text-lg font-semibold tracking-tight">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{f.text}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* Use cases + integrations */}
      <Section className="border-t border-line pt-16 sm:pt-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
            <Reveal>
              <SectionHeader
                kicker="Use case"
                title={
                  <>
                    Dipakai untuk <Em>apa saja.</Em>
                  </>
                }
              />
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {d.useCases.map((u) => (
                  <Tile key={u.title} className="bg-surface">
                    <h3 className="font-semibold">{u.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted">{u.text}</p>
                  </Tile>
                ))}
              </div>
            </Reveal>
            {d.integrations || d.certifications ? (
              <Reveal delay={100}>
                <Card className="h-full p-7">
                  {d.integrations ? (
                    <>
                      <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted">Integrasi</h3>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {d.integrations.map((i) => (
                          <span key={i} className="rounded-full border border-line px-3 py-1 text-sm">
                            {i}
                          </span>
                        ))}
                      </div>
                    </>
                  ) : null}
                  {d.certifications ? (
                    <>
                      <h3 className="mt-7 text-sm font-semibold uppercase tracking-[0.14em] text-muted">Sertifikasi</h3>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {d.certifications.map((c) => (
                          <span
                            key={c}
                            className="inline-flex items-center gap-1.5 rounded-full bg-leaf-50 px-3 py-1 text-sm font-medium text-leaf"
                          >
                            <Icon name="shield-check" className="size-4" />
                            {c}
                          </span>
                        ))}
                      </div>
                    </>
                  ) : null}
                </Card>
              </Reveal>
            ) : null}
          </div>
        </Container>
      </Section>

      {/* FAQ + demo form */}
      <Section className="border-t border-line">
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
              <div id="demo" className="rounded-card border border-line bg-surface p-6 shadow-card sm:p-8">
                <h2 className="font-serif text-3xl tracking-tight">Minta demo {p.name}</h2>
                <p className="mb-6 mt-2 text-sm text-muted">
                  Ceritakan kebutuhan Anda. Tim kami akan menghubungi untuk menjadwalkan demo.
                </p>
                <ConsultForm defaultTopic={`produk-${p.slug}`} source={`/produk/${p.slug}`} />
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* Related */}
      <Section className="border-t border-line bg-sand/60 py-16">
        <Container>
          <p className="mb-6 text-sm font-semibold uppercase tracking-[0.16em] text-muted">Produk lainnya</p>
          <div className="grid gap-4 sm:grid-cols-3">
            {related.map((r) => (
              <Link key={r.slug} href={`/produk/${r.slug}`} className="group block">
                <Card interactive className="flex h-full items-start gap-4 p-5">
                  <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg border border-line group-hover:text-accent">
                    <Icon name={r.icon} className="size-5" />
                  </span>
                  <span>
                    <span className="block font-semibold">{r.name}</span>
                    <span className="block text-sm text-muted">{r.short}</span>
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
          "@type": "Product",
          name: p.name,
          description: p.tagline,
          url: `${siteUrl}/produk/${p.slug}`,
          brand: { "@type": "Brand", name: "Omnity" },
          manufacturer: { "@type": "Organization", name: site.legalName },
        }}
      />
    </>
  );
}

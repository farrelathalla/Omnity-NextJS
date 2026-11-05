import type { Metadata } from "next";
import { ConsultForm } from "@/components/forms/consult-form";
import { Icon } from "@/components/icon";
import { PageHero } from "@/components/page-hero";
import { Card } from "@/components/ui/card";
import { Container, Em, Section } from "@/components/ui/section";
import { isTopic } from "@/content/topics";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Kontak",
  description:
    "Hubungi Omnity untuk konsultasi, demo produk, atau proyek baru. Ceritakan kebutuhan Anda dan kami membalas lewat email.",
  alternates: { canonical: "/kontak" },
};

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export default async function ContactPage({ searchParams }: PageProps<"/kontak">) {
  const sp = await searchParams;
  const topik = first(sp.topik);
  const pesan = first(sp.pesan)?.slice(0, 400) ?? "";

  return (
    <>
      <PageHero
        kicker="Kontak"
        crumbs={[{ label: "Kontak", href: "/kontak" }]}
        title={
          <>
            Mari <Em tone="ink">ngobrol.</Em>
          </>
        }
        lead="Ceritakan kebutuhan Anda: konsultasi, demo produk, atau proyek website baru. Kami membalas lewat email."
      />
      <Section className="pt-0 sm:pt-0">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:gap-14">
            <div className="space-y-4">
              <Card className="p-6">
                <span className="inline-flex size-10 items-center justify-center rounded-lg bg-sand">
                  <Icon name="mail" className="size-5" />
                </span>
                <h2 className="mt-4 text-sm font-semibold uppercase tracking-[0.14em] text-muted">Email</h2>
                <a
                  href={`mailto:${site.email}`}
                  className="mt-1 block text-lg font-medium text-ink underline-offset-4 hover:underline"
                >
                  {site.email}
                </a>
              </Card>
              <Card className="p-6">
                <span className="inline-flex size-10 items-center justify-center rounded-lg bg-sand">
                  <Icon name="map-pin" className="size-5" />
                </span>
                <h2 className="mt-4 text-sm font-semibold uppercase tracking-[0.14em] text-muted">Kantor</h2>
                <address className="mt-1 text-[1.02rem] not-italic leading-relaxed text-ink/85">
                  {site.legalName}
                  <br />
                  {site.address.line1}
                  <br />
                  {site.address.line2}
                  <br />
                  {site.address.city}
                </address>
              </Card>
              <p className="px-1 text-sm leading-relaxed text-muted">
                Untuk memulai proyek website, lebih cepat lewat{" "}
                <a href="/mulai" className="font-medium text-accent hover:underline">
                  Design Anything
                </a>
                : isi survei, terima mockup, baru putuskan.
              </p>
            </div>

            <div className="rounded-card border border-line bg-surface p-6 shadow-card sm:p-8">
              <h2 className="font-serif text-3xl tracking-tight">Kirim permintaan</h2>
              <p className="mb-6 mt-2 text-sm text-muted">Semua kolom bertanda wajib, kecuali yang tertulis opsional.</p>
              <ConsultForm
                defaultTopic={isTopic(topik) ? topik : "umum"}
                defaultMessage={pesan}
                source="/kontak"
              />
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}

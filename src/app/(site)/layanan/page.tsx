import type { Metadata } from "next";
import Link from "next/link";
import { CtaBand } from "@/components/home/cta-band";
import { Icon } from "@/components/icon";
import { Reveal } from "@/components/motion/reveal";
import { PageHero } from "@/components/page-hero";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container, Em } from "@/components/ui/section";
import { services } from "@/content/services";

export const metadata: Metadata = {
  title: "Layanan",
  description:
    "Konsultasi IT, audit IT dan keamanan, solutioning, software development dan integrasi, managed IT, network, serta pembuatan website.",
  alternates: { canonical: "/layanan" },
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        kicker="Layanan"
        crumbs={[{ label: "Layanan", href: "/layanan" }]}
        title={
          <>
            Teknologi yang <Em tone="ink">didampingi.</Em>
          </>
        }
        lead="Dari menentukan arah, memeriksa keamanan, merancang solusi, sampai membangun dan merawatnya."
        actions={
          <ButtonLink href="/kontak" shape="pill">
            Jadwalkan konsultasi
          </ButtonLink>
        }
      />
      <section className="pb-24">
        <Container>
          <div className="grid gap-4 md:grid-cols-2">
            {services.map((s, i) => (
              <Reveal key={s.slug} delay={(i % 2) * 80}>
                <Link href={`/layanan/${s.slug}`} className="group block h-full">
                  <Card interactive className="flex h-full flex-col p-7 sm:p-8">
                    <span className="inline-flex size-12 items-center justify-center rounded-xl bg-ink text-white">
                      <Icon name={s.icon} className="size-6" />
                    </span>
                    <h2 className="mt-6 font-serif text-3xl tracking-tight">{s.name}</h2>
                    <p className="mt-3 flex-1 leading-relaxed text-muted">{s.blurb}</p>
                    <ul className="mt-5 flex flex-wrap gap-2">
                      {s.points.map((p) => (
                        <li key={p} className="rounded-full border border-line px-3 py-1 text-xs text-ink/80">
                          {p}
                        </li>
                      ))}
                    </ul>
                    <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
                      Selengkapnya
                      <Icon name="arrow-right" className="size-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </Card>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
      <CtaBand />
    </>
  );
}

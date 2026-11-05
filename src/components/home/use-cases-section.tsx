import Link from "next/link";
import { Icon } from "@/components/icon";
import { Reveal } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Container, Em, Section, SectionHeader } from "@/components/ui/section";
import { useCases } from "@/content/use-cases";

/** H6: use cases for AI solutions: problem -> Omnity solution -> outcome. */
export function UseCasesSection() {
  return (
    <Section id="use-case" className="border-t border-line">
      <Container>
        <Reveal>
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <SectionHeader
              kicker="Solusi AI"
              title={
                <>
                  AI untuk masalah <Em>nyata di bisnis Anda.</Em>
                </>
              }
              lead="Tiga contoh bagaimana asisten AI, otomasi, dan analitik dipakai di operasional sehari-hari."
            />
            <Link
              href="/produk/solusi-ai"
              className="inline-flex items-center gap-1.5 self-start text-sm font-semibold text-accent hover:underline lg:self-auto"
            >
              Lihat Solusi AI <Icon name="arrow-right" className="size-4" />
            </Link>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {useCases.map((u, i) => (
            <Reveal key={u.title} delay={i * 90}>
              <Card className="flex h-full flex-col p-7">
                <div className="flex items-center justify-between">
                  <span className="inline-flex size-11 items-center justify-center rounded-xl bg-sand text-ink">
                    <Icon name={u.icon} className="size-5" />
                  </span>
                  <Badge>Contoh skenario</Badge>
                </div>
                <h3 className="mt-5 font-serif text-2xl tracking-tight">{u.title}</h3>
                <dl className="mt-5 space-y-4 text-sm leading-relaxed">
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Masalah</dt>
                    <dd className="mt-1 text-ink/80">{u.problem}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">Solusi Omnity</dt>
                    <dd className="mt-1 text-ink/80">{u.solution}</dd>
                  </div>
                  <div className="rounded-xl bg-sand p-3.5">
                    <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Yang dituju</dt>
                    <dd className="mt-1 text-ink">{u.outcome}</dd>
                  </div>
                </dl>
              </Card>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}

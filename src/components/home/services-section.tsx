import Link from "next/link";
import { Icon } from "@/components/icon";
import { Reveal } from "@/components/motion/reveal";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container, Em, Section, SectionHeader } from "@/components/ui/section";
import { services } from "@/content/services";

const featured = services.filter((s) => s.highlight);
const rest = services.filter((s) => !s.highlight);

/** H4: services as a bento grid, consulting / audit / solutioning first. */
export function ServicesSection() {
  return (
    <Section id="layanan" className="border-y border-line bg-sand/60">
      <Container>
        <Reveal>
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <SectionHeader
              kicker="Layanan & konsultasi"
              title={
                <>
                  Bukan hanya produk. <Em>Kami mendampingi.</Em>
                </>
              }
              lead="Dari menentukan arah teknologi, memeriksa keamanan, sampai merancang dan membangun solusinya."
            />
            <ButtonLink href="/kontak" variant="secondary" shape="pill" className="self-start lg:self-auto">
              Jadwalkan konsultasi
              <Icon name="arrow-right" className="size-4" />
            </ButtonLink>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {featured.map((s, i) => (
            <Reveal key={s.slug} delay={i * 80}>
              <Card interactive className="flex h-full flex-col p-7">
                <span className="inline-flex size-12 items-center justify-center rounded-xl bg-ink text-white">
                  <Icon name={s.icon} className="size-6" />
                </span>
                <h3 className="mt-6 font-serif text-3xl tracking-tight">{s.name}</h3>
                <p className="mt-3 text-[0.97rem] leading-relaxed text-muted">{s.blurb}</p>
                <ul className="mt-5 space-y-2">
                  {s.points.map((p) => (
                    <li key={p} className="flex items-start gap-2 text-sm text-ink">
                      <Icon name="check" className="mt-0.5 size-4 shrink-0 text-accent" />
                      {p}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-2 pt-7">
                  <Link
                    href={`/kontak?topik=${s.slug}`}
                    className="inline-flex items-center gap-1 text-sm font-semibold text-accent hover:underline"
                  >
                    Jadwalkan konsultasi <Icon name="arrow-right" className="size-4" />
                  </Link>
                  <Link
                    href={`/layanan/${s.slug}`}
                    className="text-sm font-medium text-muted transition-colors hover:text-ink"
                  >
                    Detail
                  </Link>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {rest.map((s, i) => (
            <Reveal key={s.slug} delay={i * 70}>
              <Link href={`/layanan/${s.slug}`} className="group block h-full">
                <Card interactive className="flex h-full flex-col p-6">
                  <span className="inline-flex size-10 items-center justify-center rounded-lg border border-line text-ink transition-colors group-hover:border-brand/30 group-hover:text-accent">
                    <Icon name={s.icon} className="size-5" />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold tracking-tight">{s.name}</h3>
                  <p className="mt-1.5 flex-1 text-sm leading-relaxed text-muted">{s.short}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-accent">
                    Selengkapnya
                    <Icon name="arrow-right" className="size-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Card>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}

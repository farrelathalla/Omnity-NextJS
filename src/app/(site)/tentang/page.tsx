import type { Metadata } from "next";
import Link from "next/link";
import { CtaBand } from "@/components/home/cta-band";
import { Icon } from "@/components/icon";
import { Reveal } from "@/components/motion/reveal";
import { PageHero } from "@/components/page-hero";
import { ButtonLink } from "@/components/ui/button";
import { Card, Tile } from "@/components/ui/card";
import { Container, Em, Section, SectionHeader } from "@/components/ui/section";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Tentang Kami",
  description:
    "PT Omnity Solusi Integrasi: perusahaan IT dan fintech Indonesia yang membangun produk pembayaran dan bisnis, serta mendampingi perusahaan lewat konsultasi, audit, dan solusi teknologi.",
  alternates: { canonical: "/tentang" },
};

const pillars = [
  {
    icon: "wallet" as const,
    title: "Produk",
    text: "Platform pembayaran digital, HRIS, kartu prabayar, manajemen aset, monitoring kendaraan, kasir, dan transportasi publik.",
    href: "/produk",
  },
  {
    icon: "compass" as const,
    title: "Layanan",
    text: "Konsultasi IT, audit dan keamanan, solutioning, software development, managed IT, dan network.",
    href: "/layanan",
  },
  {
    icon: "sparkles" as const,
    title: "Design Anything",
    text: "Isi survei singkat, terima mockup website, lalu putuskan. Cara paling ringan untuk memulai website baru.",
    href: "/mulai",
  },
];

const values = [
  { title: "Jelas", text: "Penjelasan tanpa jargon, penawaran yang rinci, dan cakupan yang tertulis." },
  { title: "Teruji", text: "Kami menguji sebelum meluncurkan, dan mendampingi setelahnya." },
  { title: "Bertanggung jawab", text: "Data dan keamanan diperlakukan serius sejak hari pertama." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        kicker="Tentang kami"
        crumbs={[{ label: "Tentang Kami", href: "/tentang" }]}
        title={
          <>
            Teknologi yang <Em tone="ink">memudahkan bisnis.</Em>
          </>
        }
        lead={`${site.legalName} adalah perusahaan IT dan fintech di Indonesia. Kami membangun produk pembayaran dan bisnis, serta mendampingi perusahaan lewat konsultasi, audit, dan solusi teknologi.`}
        actions={
          <ButtonLink href="/kontak" shape="pill">
            Hubungi kami
          </ButtonLink>
        }
      />

      <Section className="pt-4 sm:pt-4">
        <Container>
          <div className="grid gap-4 md:grid-cols-3">
            {pillars.map((p, i) => (
              <Reveal key={p.title} delay={i * 80}>
                <Link href={p.href} className="group block h-full">
                  <Card interactive className="flex h-full flex-col p-7">
                    <span className="inline-flex size-11 items-center justify-center rounded-xl bg-ink text-white">
                      <Icon name={p.icon} className="size-5" />
                    </span>
                    <h2 className="mt-5 font-serif text-3xl tracking-tight">{p.title}</h2>
                    <p className="mt-2 flex-1 text-[0.97rem] leading-relaxed text-muted">{p.text}</p>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
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

      <Section className="border-y border-line bg-sand/60">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
            <Reveal>
              <SectionHeader
                kicker="Visi"
                title={
                  <>
                    Mitra teknologi yang <Em>bisa diandalkan.</Em>
                  </>
                }
                lead="Menjadi mitra teknologi yang membuat bisnis di Indonesia lebih mudah bertransaksi, bekerja, dan bertumbuh."
              />
            </Reveal>
            <Reveal delay={100}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Misi</h2>
              <ul className="mt-5 space-y-4">
                {[
                  "Menyediakan produk yang aman, cepat, dan mudah dipakai.",
                  "Mendampingi perusahaan mengambil keputusan teknologi yang tepat.",
                  "Membangun solusi yang dirancang bersama pengguna dan diuji sebelum diluncurkan.",
                ].map((m) => (
                  <li key={m} className="flex items-start gap-3 text-[1.05rem] text-ink/85">
                    <Icon name="check" className="mt-1.5 size-4 shrink-0 text-accent" />
                    {m}
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
              kicker="Cara kami bekerja"
              title={
                <>
                  Tiga hal yang kami <Em>pegang.</Em>
                </>
              }
            />
          </Reveal>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 80}>
                <Tile className="h-full bg-surface p-6">
                  <h3 className="font-serif text-2xl tracking-tight">{v.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{v.text}</p>
                </Tile>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-8" delay={150}>
            <p className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-sm text-ink/80">
              <Icon name="shield-check" className="size-4 text-leaf" />
              OmniPay dibangun mengikuti standar keamanan PCI DSS.
            </p>
          </Reveal>
        </Container>
      </Section>
      <CtaBand />
    </>
  );
}

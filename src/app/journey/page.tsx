import type { Metadata } from "next";
import { CtaBand } from "@/components/home/cta-band";
import { Reveal } from "@/components/motion/reveal";
import { PageHero } from "@/components/page-hero";
import { ButtonLink } from "@/components/ui/button";
import { Container, Em, Section } from "@/components/ui/section";

export const metadata: Metadata = {
  title: "Journey",
  description:
    "Perjalanan sebuah proyek bersama Omnity: memahami kebutuhan, merancang, membangun dan menguji, lalu meluncurkan dan mendampingi.",
  alternates: { canonical: "/journey" },
};

const steps = [
  {
    title: "Memahami kebutuhan",
    text: "Kami mulai dengan mendengarkan: tujuan bisnis, proses yang berjalan, kendala, dan siapa penggunanya. Hasilnya adalah pemahaman bersama sebelum satu baris pun dibangun.",
    gets: "Ringkasan kebutuhan dan ruang lingkup",
  },
  {
    title: "Merancang solusi",
    text: "Kebutuhan diterjemahkan menjadi rancangan: alur, antarmuka, arsitektur, dan integrasi. Untuk website, tahap ini menghasilkan mockup yang bisa Anda lihat dan komentari.",
    gets: "Rancangan, mockup, dan penawaran",
  },
  {
    title: "Membangun dan menguji",
    text: "Pengerjaan berjalan dalam iterasi pendek dengan demo berkala. Setiap bagian diuji sebelum diserahkan, termasuk di berbagai perangkat dan skenario.",
    gets: "Sistem yang berfungsi dan sudah diuji",
  },
  {
    title: "Meluncurkan dan mendampingi",
    text: "Setelah live, kami mendampingi masa awal pemakaian, memantau, dan menyiapkan langkah perawatan atau pengembangan berikutnya.",
    gets: "Peluncuran, panduan, dan dukungan",
  },
];

export default function JourneyPage() {
  return (
    <>
      <PageHero
        kicker="Journey"
        crumbs={[{ label: "Journey", href: "/journey" }]}
        title={
          <>
            Dari ide ke <Em tone="ink">hasil nyata.</Em>
          </>
        }
        lead="Empat tahap yang kami jalani bersama setiap klien, dari obrolan pertama sampai setelah peluncuran."
        actions={
          <ButtonLink href="/mulai" shape="pill">
            Mulai Proyek
          </ButtonLink>
        }
      />
      <Section className="pt-4 sm:pt-4">
        <Container>
          <ol className="relative mx-auto max-w-3xl space-y-12 border-l border-line pl-8 sm:pl-12">
            {steps.map((s, i) => (
              <li key={s.title} className="relative">
                <span className="absolute -left-[3.2rem] top-0 inline-flex size-10 items-center justify-center rounded-full border border-line bg-canvas font-serif text-xl text-brand shadow-card sm:-left-[4.2rem] sm:size-12 sm:text-2xl">
                  {i + 1}
                </span>
                <Reveal>
                  <h2 className="font-serif text-3xl tracking-tight sm:text-4xl">{s.title}</h2>
                  <p className="mt-3 text-[1.05rem] leading-relaxed text-muted">{s.text}</p>
                  <p className="mt-4 inline-flex rounded-full bg-sand px-3.5 py-1.5 text-sm text-ink/80">
                    Anda mendapat: {s.gets}
                  </p>
                </Reveal>
              </li>
            ))}
          </ol>
        </Container>
      </Section>
      <CtaBand />
    </>
  );
}

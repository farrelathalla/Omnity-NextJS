import { Reveal } from "@/components/motion/reveal";
import { ButtonLink } from "@/components/ui/button";
import { Container, Em, Section, SectionHeader } from "@/components/ui/section";

const steps = [
  { title: "Isi survei", text: "Ceritakan bisnis, tujuan, dan referensi Anda lewat survei singkat." },
  { title: "Terima mockup", text: "Tim kami menyiapkan mockup website sesuai jawaban survei Anda." },
  { title: "Setujui penawaran", text: "Lihat cakupan, biaya, dan estimasi waktu. Setuju dulu, baru lanjut." },
  { title: "Website dibangun", text: "Proyek dikerjakan sesuai paket, dan progresnya bisa Anda pantau." },
];

/** H5: four numbered steps, from idea to website. */
export function ProcessSection() {
  return (
    <Section id="cara-kerja">
      <Container>
        <Reveal>
          <SectionHeader
            align="center"
            kicker="Cara kerja"
            title={
              <>
                Dari ide ke website, <Em>dalam empat langkah.</Em>
              </>
            }
          />
        </Reveal>

        <ol className="relative mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          <span
            aria-hidden="true"
            className="absolute left-0 right-0 top-[1.9rem] hidden h-px bg-gradient-to-r from-transparent via-line to-transparent lg:block"
          />
          {steps.map((s, i) => (
            <li key={s.title}>
              <Reveal delay={i * 110} className="relative text-center lg:text-left">
                <span className="relative z-10 mx-auto inline-flex size-[3.8rem] items-center justify-center rounded-full border border-line bg-canvas font-serif text-3xl text-brand shadow-card lg:mx-0">
                  {i + 1}
                </span>
                <h3 className="mt-5 text-lg font-semibold tracking-tight">{s.title}</h3>
                <p className="mx-auto mt-2 max-w-[16rem] text-sm leading-relaxed text-muted lg:mx-0">{s.text}</p>
              </Reveal>
            </li>
          ))}
        </ol>

        <Reveal className="mt-14 flex justify-center" delay={150}>
          <ButtonLink href="/mulai" size="lg" shape="pill">
            Mulai Proyek
          </ButtonLink>
        </Reveal>
      </Container>
    </Section>
  );
}

import { Reveal } from "@/components/motion/reveal";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/section";

/** H8: closing call to action, right above the dark footer. */
export function CtaBand() {
  return (
    <section className="pb-20 pt-4 sm:pb-24">
      <Container>
        <Reveal>
          <div className="relative isolate overflow-hidden rounded-[1.75rem] bg-ink px-6 py-14 text-center text-white sm:px-12 sm:py-20">
            <div
              aria-hidden="true"
              className="absolute -left-20 -top-24 -z-10 size-[26rem] rounded-full bg-[radial-gradient(closest-side,rgb(232_80_30/0.5),transparent)]"
            />
            <div
              aria-hidden="true"
              className="absolute -bottom-32 -right-16 -z-10 size-[26rem] rounded-full bg-[radial-gradient(closest-side,rgb(59_91_219/0.4),transparent)]"
            />
            <div aria-hidden="true" className="bg-dots absolute inset-0 -z-10 opacity-[0.07] invert" />
            <h2 className="mx-auto max-w-2xl font-serif text-4xl leading-[1.05] tracking-tight sm:text-6xl">
              Siap memulai? Dapatkan <em className="italic text-brand">mockup website</em> Anda.
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-lg text-white/65">
              Isi survei singkat, dan tim kami menyiapkan mockup sebelum Anda memutuskan apa pun.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <ButtonLink href="/mulai" variant="light" size="lg" shape="pill">
                Mulai Proyek
              </ButtonLink>
              <ButtonLink href="/kontak" variant="outline-light" size="lg" shape="pill">
                Jadwalkan konsultasi
              </ButtonLink>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

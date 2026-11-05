import { Backdrop } from "@/components/layout/backdrop";
import { ButtonLink } from "@/components/ui/button";
import { Container, Em } from "@/components/ui/section";

// Temporary shell: replaced by the real homepage sections in phase 2.
export default function HomePage() {
  return (
    <section className="relative isolate overflow-hidden py-28 sm:py-40">
      <Backdrop />
      <Container className="text-center">
        <h1 className="mx-auto max-w-3xl animate-hero-enter font-serif text-6xl leading-[0.95] tracking-tight sm:text-8xl">
          Bangun <Em tone="ink">apa pun.</Em>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-muted">
          Website, aplikasi, sampai sistem pembayaran, dirancang dan dibangun oleh tim Omnity.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <ButtonLink href="/styleguide">Lihat styleguide</ButtonLink>
        </div>
      </Container>
    </section>
  );
}

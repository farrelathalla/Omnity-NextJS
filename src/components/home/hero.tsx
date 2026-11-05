import { Backdrop } from "@/components/layout/backdrop";
import { Container, Em } from "@/components/ui/section";
import { site } from "@/lib/site";
import { HeroPrompt } from "./hero-prompt";

/** H1: "Design Anything" version of the hero (brief chapter 06). */
export function Hero() {
  return (
    <section className="relative isolate overflow-hidden pb-28 pt-14 sm:pb-20 sm:pt-20 lg:pt-24">
      <Backdrop />
      <Container>
        <div className="animate-hero-enter text-center">
          <h1 className="mx-auto max-w-4xl font-serif text-[3.4rem] font-normal leading-[0.95] tracking-tight text-ink sm:text-7xl lg:text-[6rem]">
            Bangun <Em tone="ink">apa pun.</Em>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-balance text-lg leading-relaxed text-muted sm:text-xl">
            Website, aplikasi, sampai sistem pembayaran, dirancang dan dibangun oleh tim Omnity.
          </p>
        </div>

        <div className="mt-9 animate-hero-enter [animation-delay:120ms] sm:mt-11">
          <HeroPrompt />
          <div className="mt-6 flex flex-col items-center gap-1 text-center">
            <p className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm font-medium text-ink/80">
              <span>Dipercaya {site.proof.clients} klien</span>
              <span aria-hidden="true" className="h-3.5 w-px bg-line" />
              <span>{site.proof.projects} proyek selesai</span>
            </p>
            <p className="text-xs text-muted">
              Ceritakan kebutuhan Anda, tim kami yang menyiapkan mockup-nya.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}

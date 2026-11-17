import type { Metadata } from "next";
import { CtaBand } from "@/components/home/cta-band";
import { PageHero } from "@/components/page-hero";
import { ButtonLink } from "@/components/ui/button";
import { Container, Em } from "@/components/ui/section";
import { WorkGrid } from "@/components/work-grid";
import { works, workTypes } from "@/content/works";

export const metadata: Metadata = {
  title: "Karya",
  description:
    "Website, platform, dan aplikasi yang pernah kami bangun: OmniPay, C-Access, SB Hospitality, Saiga Conservation Alliance, dan lainnya. Sebagian bisa langsung dicoba.",
  alternates: { canonical: "/karya" },
};

export default function WorksPage() {
  return (
    <>
      <PageHero
        kicker="Karya"
        crumbs={[{ label: "Karya", href: "/karya" }]}
        title={
          <>
            Karya yang <Em tone="ink">pernah kami buat.</Em>
          </>
        }
        lead="Website, platform pembayaran, dan aplikasi mobile, dari organisasi konservasi internasional sampai industri manufaktur dan hospitality. Proyek bertanda Bisa dicoba punya pratinjau interaktif."
        actions={
          <ButtonLink href="/mulai" shape="pill">
            Mulai Proyek
          </ButtonLink>
        }
      />
      <section className="pb-24">
        <Container>
          <WorkGrid works={works} types={workTypes} />
        </Container>
      </section>
      <CtaBand />
    </>
  );
}

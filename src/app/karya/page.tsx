import type { Metadata } from "next";
import { CtaBand } from "@/components/home/cta-band";
import { PageHero } from "@/components/page-hero";
import { ButtonLink } from "@/components/ui/button";
import { Container, Em } from "@/components/ui/section";
import { WorkGrid } from "@/components/work-grid";
import { workCategories, works } from "@/content/works";

export const metadata: Metadata = {
  title: "Karya",
  description:
    "Website yang pernah kami bangun: Saiga Conservation Alliance, Lextera Survey Indonesia, dan NCB Living. Lihat sorotan desktop dan mobile.",
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
        lead="Website yang sudah berjalan, dari organisasi konservasi internasional sampai distributor teknologi survei dan studio arsitektur."
        actions={
          <ButtonLink href="/mulai" shape="pill">
            Mulai Proyek
          </ButtonLink>
        }
      />
      <section className="pb-24">
        <Container>
          <WorkGrid works={works} categories={workCategories} />
        </Container>
      </section>
      <CtaBand />
    </>
  );
}

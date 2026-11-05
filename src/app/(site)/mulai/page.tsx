import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { TemplatePicker } from "@/components/projects/template-picker";
import { Container, Em } from "@/components/ui/section";
import { templates } from "@/content/templates";

export const metadata: Metadata = {
  title: "Design Anything",
  description:
    "Isi survei singkat, terima mockup website dari tim Omnity, lalu putuskan. Pilih template sebagai titik awal atau mulai dari nol.",
  alternates: { canonical: "/mulai" },
};

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export default async function StartPage({ searchParams }: PageProps<"/mulai">) {
  const t = first((await searchParams).template);
  const initialTemplate = templates.some((x) => x.id === t) ? t : undefined;

  return (
    <>
      <PageHero
        kicker="Design Anything"
        crumbs={[{ label: "Mulai Proyek", href: "/mulai" }]}
        title={
          <>
            Lihat mockup-nya <Em tone="ink">sebelum bayar.</Em>
          </>
        }
        lead="Pilih template sebagai titik awal (atau mulai dari nol), isi survei singkat 8 langkah, dan tim kami menyiapkan mockup website Anda. Setelah itu Anda menerima penawaran dan memutuskan."
      />
      <section className="pb-24">
        <Container>
          <TemplatePicker initialTemplate={initialTemplate} />
        </Container>
      </section>
    </>
  );
}

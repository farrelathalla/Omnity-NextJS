import type { Metadata } from "next";
import { Icon } from "@/components/icon";
import { PageHero } from "@/components/page-hero";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container, Em, Section } from "@/components/ui/section";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Karier",
  description: "Bergabung dengan tim Omnity: engineering, desain produk, dan implementasi solusi.",
  alternates: { canonical: "/karier" },
};

const areas = [
  { title: "Engineering", text: "Membangun aplikasi web, mobile, dan integrasi sistem." },
  { title: "Desain produk", text: "Merancang antarmuka dan pengalaman yang jelas dan nyaman." },
  { title: "Implementasi & dukungan", text: "Mendampingi klien memakai produk dan layanan kami." },
];

export default function CareersPage() {
  return (
    <>
      <PageHero
        kicker="Karier"
        crumbs={[{ label: "Karier", href: "/karier" }]}
        title={
          <>
            Bangun bersama <Em tone="ink">tim Omnity.</Em>
          </>
        }
        lead="Kami mencari orang yang suka memecahkan masalah nyata dengan teknologi, dan senang bekerja dengan jelas dan rapi."
      />
      <Section className="pt-4 sm:pt-4">
        <Container>
          <div className="grid gap-4 md:grid-cols-3">
            {areas.map((a) => (
              <Card key={a.title} className="p-6">
                <h2 className="font-serif text-2xl tracking-tight">{a.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted">{a.text}</p>
              </Card>
            ))}
          </div>

          <div className="mt-8 rounded-card border border-line bg-sand p-8 sm:p-10">
            <h2 className="font-serif text-3xl tracking-tight">Lowongan terbuka</h2>
            <p className="mt-3 max-w-2xl text-muted">
              Saat ini belum ada lowongan yang dipublikasikan di halaman ini. Tetap kirimkan CV dan
              portofolio Anda; kami menyimpannya dan menghubungi bila ada posisi yang cocok.
            </p>
            <ButtonLink href={`mailto:${site.email}?subject=Lamaran%20Omnity`} className="mt-6" shape="pill">
              <Icon name="mail" className="size-4" />
              Kirim ke {site.email}
            </ButtonLink>
          </div>
        </Container>
      </Section>
    </>
  );
}

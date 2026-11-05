import type { Metadata } from "next";
import Link from "next/link";
import { CtaBand } from "@/components/home/cta-band";
import { Icon } from "@/components/icon";
import { Reveal } from "@/components/motion/reveal";
import { PageHero } from "@/components/page-hero";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container, Em } from "@/components/ui/section";
import { products } from "@/content/products";

export const metadata: Metadata = {
  title: "Produk",
  description:
    "OmniPay, Omnidoc, OmniCard, OmniAssetTracker, OmniWHERE, OmniPOS, OmniTRANS, dan Solusi AI: produk Omnity untuk pembayaran, HR, aset, armada, kasir, dan transportasi.",
  alternates: { canonical: "/produk" },
};

export default function ProductsPage() {
  return (
    <>
      <PageHero
        kicker="Produk"
        crumbs={[{ label: "Produk", href: "/produk" }]}
        title={
          <>
            Produk untuk <Em tone="ink">setiap kebutuhan.</Em>
          </>
        }
        lead="Dari pembayaran digital, HRIS, kartu prabayar, sampai monitoring kendaraan dan solusi AI. Pilih yang sesuai, atau kombinasikan."
        actions={
          <ButtonLink href="/kontak?topik=umum" shape="pill">
            Minta demo
          </ButtonLink>
        }
      />
      <section className="pb-24">
        <Container>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p, i) => (
              <Reveal key={p.slug} delay={(i % 3) * 80}>
                <Link href={`/produk/${p.slug}`} className="group block h-full">
                  <Card interactive className="flex h-full flex-col p-7">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex size-12 items-center justify-center rounded-xl border border-line transition-colors group-hover:border-brand/30 group-hover:text-accent">
                        <Icon name={p.icon} className="size-6" />
                      </span>
                      {p.badge ? <Badge tone="leaf">{p.badge}</Badge> : null}
                    </div>
                    <h2 className="mt-6 font-serif text-3xl tracking-tight">{p.name}</h2>
                    <p className="mt-2 flex-1 text-[0.97rem] leading-relaxed text-muted">{p.tagline}</p>
                    <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
                      Pelajari
                      <Icon name="arrow-right" className="size-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </Card>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
      <CtaBand />
    </>
  );
}

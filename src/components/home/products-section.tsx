import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/icon";
import { Reveal } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Container, Em, Section, SectionHeader } from "@/components/ui/section";
import { products } from "@/content/products";

const omnipay = products.find((p) => p.slug === "omnipay")!;
const ai = products.find((p) => p.slug === "solusi-ai")!;
const others = products.filter((p) => p.slug !== "omnipay" && p.slug !== "solusi-ai");

const omnipayPoints = [
  "Kartu debit & kredit",
  "QRIS dan e-wallet",
  "Pembayaran contactless",
  "Standar keamanan PCI DSS",
];
const aiChips = ["Chatbot & asisten AI", "Otomasi dokumen", "Analitik & prediksi"];

/** H3: product grid, OmniPay featured (brief chapter 06). */
export function ProductsSection() {
  return (
    <Section id="produk">
      <Container>
        <Reveal>
          <SectionHeader
            kicker="Produk Omnity"
            title={
              <>
                Satu ekosistem, <Em>banyak solusi.</Em>
              </>
            }
            lead="Dari pembayaran digital sampai transportasi publik, pilih produk yang sesuai kebutuhan bisnis Anda."
          />
        </Reveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Reveal className="sm:col-span-2 lg:row-span-2" delay={0}>
            <Link href={`/produk/${omnipay.slug}`} className="group block h-full">
              <Card interactive className="flex h-full flex-col justify-between overflow-hidden p-6 sm:p-8">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex size-11 items-center justify-center rounded-xl bg-brand-50 text-accent">
                      <Icon name={omnipay.icon} className="size-6" />
                    </span>
                    <Badge tone="brand">Unggulan</Badge>
                  </div>
                  <h3 className="mt-6 font-serif text-4xl tracking-tight sm:text-5xl">{omnipay.name}</h3>
                  <p className="mt-3 max-w-md text-[1.02rem] leading-relaxed text-muted">{omnipay.tagline}</p>
                  <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
                    {omnipayPoints.map((p) => (
                      <li key={p} className="flex items-center gap-2 text-sm text-ink">
                        <Icon name="check" className="size-4 shrink-0 text-accent" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-8">
                  <Image
                    src="/brand/payments.webp"
                    alt="Metode pembayaran yang didukung: Visa, Mastercard, JCB, UnionPay, GPN, QRIS, GoPay, OVO, ShopeePay, DANA, LinkAja, dan sertifikasi PCI DSS"
                    width={1200}
                    height={307}
                    sizes="(min-width: 1024px) 560px, 90vw"
                    className="h-auto w-full max-w-lg opacity-95"
                  />
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
                    Pelajari OmniPay
                    <Icon name="arrow-right" className="size-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Card>
            </Link>
          </Reveal>

          {others.map((p, i) => (
            <Reveal key={p.slug} delay={(i + 1) * 60}>
              <Link href={`/produk/${p.slug}`} className="group block h-full">
                <Card interactive className="flex h-full flex-col p-6">
                  <span className="inline-flex size-10 items-center justify-center rounded-lg border border-line text-ink transition-colors group-hover:border-brand/30 group-hover:text-accent">
                    <Icon name={p.icon} className="size-5" />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold tracking-tight">{p.name}</h3>
                  <p className="mt-1.5 flex-1 text-sm leading-relaxed text-muted">{p.short}</p>
                  <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-accent">
                    Pelajari
                    <Icon name="arrow-right" className="size-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Card>
              </Link>
            </Reveal>
          ))}

          <Reveal className="sm:col-span-2" delay={400}>
            <Link href={`/produk/${ai.slug}`} className="group block h-full">
              <Card
                interactive
                className="relative flex h-full flex-col justify-between overflow-hidden border-ink/10 bg-ink p-6 text-white sm:p-7"
              >
                <div
                  aria-hidden="true"
                  className="absolute -right-16 -top-20 size-64 rounded-full bg-[radial-gradient(closest-side,rgb(232_80_30/0.55),transparent)]"
                />
                <div className="relative">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex size-10 items-center justify-center rounded-lg bg-white/10">
                      <Icon name={ai.icon} className="size-5" />
                    </span>
                    <Badge tone="leaf">{ai.badge}</Badge>
                  </div>
                  <h3 className="mt-5 font-serif text-3xl tracking-tight">{ai.name}</h3>
                  <p className="mt-2 max-w-md text-sm leading-relaxed text-white/70">{ai.tagline}</p>
                </div>
                <div className="relative mt-6 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-2">
                    {aiChips.map((c) => (
                      <span key={c} className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/80">
                        {c}
                      </span>
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-white">
                    Lihat use case
                    <Icon name="arrow-right" className="size-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Card>
            </Link>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}

import type { Metadata } from "next";
import { OmnityLogo, OmnityMark } from "@/components/brand/logo";
import { Icon } from "@/components/icon";
import { Backdrop } from "@/components/layout/backdrop";
import { Marquee } from "@/components/motion/marquee";
import { Reveal } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card, Tile } from "@/components/ui/card";
import { Field, Input, Select, Textarea } from "@/components/ui/form";
import { Container, Em, Kicker, Section, SectionHeader } from "@/components/ui/section";

export const metadata: Metadata = {
  title: "Styleguide",
  robots: { index: false, follow: false },
};

const swatches = [
  { name: "Canvas", token: "bg-canvas", hex: "#FAFAF7", note: "latar utama" },
  { name: "Ink", token: "bg-ink", hex: "#0E1220", note: "teks, tombol, footer" },
  { name: "Omnity Orange", token: "bg-brand", hex: "#E8501E", note: "aksen, link" },
  { name: "Muted", token: "bg-muted", hex: "#6B7280", note: "teks sekunder" },
  { name: "Line", token: "bg-line", hex: "#E5E7EB", note: "border kartu" },
  { name: "Night", token: "bg-night", hex: "#010309", note: "footer" },
];

const scale = [64, 48, 32, 24, 18, 16, 14, 12];

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-line py-12">
      <h2 className="mb-6 text-sm font-semibold uppercase tracking-[0.16em] text-muted">
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function StyleguidePage() {
  return (
    <div className="relative isolate overflow-hidden">
      <Backdrop className="h-[40rem]" />
      <Container className="pb-24 pt-16">
        <Kicker>Design system</Kicker>
        <h1 className="mt-3 animate-hero-enter font-serif text-6xl leading-[0.95] tracking-tight sm:text-8xl">
          Styleguide <Em tone="ink">Omnity.</Em>
        </h1>
        <p className="mt-5 max-w-xl text-lg text-muted">
          Semua token dan komponen yang dipakai di situs. Rasa aidesigner.ai (tenang, premium,
          banyak ruang kosong) dengan identitas oranye Omnity.
        </p>

        <div className="mt-14">
          <Block title="Logo">
            <div className="flex flex-wrap items-center gap-10">
              <OmnityLogo />
              <span className="rounded-xl bg-night p-5">
                <OmnityLogo tone="light" />
              </span>
              <OmnityMark className="size-14" />
            </div>
          </Block>

          <Block title="Warna">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
              {swatches.map((s) => (
                <div key={s.name}>
                  <div className={`${s.token} h-20 rounded-xl border border-line`} />
                  <p className="mt-2 text-sm font-semibold">{s.name}</p>
                  <p className="text-xs text-muted">
                    {s.hex} · {s.note}
                  </p>
                </div>
              ))}
            </div>
          </Block>

          <Block title="Tipografi">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="p-6">
                <p className="font-serif text-5xl leading-none tracking-tight sm:text-6xl">
                  Bangun <Em tone="ink">apa pun.</Em>
                </p>
                <p className="mt-4 text-sm text-muted">
                  Instrument Serif, hanya untuk judul besar. Satu kata kunci miring (abu
                  bergradien di hero, oranye di judul section).
                </p>
                <p className="mt-6 font-serif text-4xl tracking-tight">
                  Cara kerja, <Em>dari ide ke website.</Em>
                </p>
              </Card>
              <Card className="p-6">
                <p className="text-2xl font-semibold tracking-tight">Inter untuk UI & teks</p>
                <p className="mt-2">
                  Body 16 px, line-height 1,6. Label kecil uppercase dengan letter-spacing lebar.
                </p>
                <div className="mt-4 flex flex-wrap items-baseline gap-x-5 gap-y-1">
                  {scale.map((s) => (
                    <span key={s} style={{ fontSize: Math.min(s, 40) }} className="leading-tight">
                      {s}
                    </span>
                  ))}
                </div>
              </Card>
            </div>
          </Block>

          <Block title="Tombol">
            <div className="flex flex-wrap items-center gap-3">
              <Button>Primer</Button>
              <Button variant="brand">Brand</Button>
              <Button variant="secondary">Sekunder</Button>
              <Button variant="ghost">Ghost</Button>
              <Button shape="pill">Pill (navbar)</Button>
              <Button shape="pill" variant="secondary">
                Masuk
              </Button>
              <ButtonLink href="/styleguide" size="lg">
                Mulai Desain <Icon name="arrow-right" className="size-4" />
              </ButtonLink>
              <Button size="sm">Kecil</Button>
              <Button disabled>Nonaktif</Button>
            </div>
            <div className="mt-4 flex gap-3 rounded-xl bg-night p-5">
              <Button variant="light" shape="pill">
                Mulai Proyek
              </Button>
              <Button variant="outline-light" shape="pill">
                Pelajari
              </Button>
            </div>
          </Block>

          <Block title="Kartu & badge">
            <div className="grid gap-4 md:grid-cols-3">
              <Card interactive className="p-6">
                <span className="mb-4 inline-flex size-10 items-center justify-center rounded-lg border border-line">
                  <Icon name="wallet" className="size-5" />
                </span>
                <h3 className="font-semibold">Kartu interaktif</h3>
                <p className="mt-1 text-sm text-muted">Hover: naik 2 px, bayangan lembut.</p>
              </Card>
              <Card className="p-6">
                <h3 className="font-semibold">Kartu statis</h3>
                <p className="mt-1 text-sm text-muted">
                  Putih, border 1 px #E5E7EB, radius 16 px.
                </p>
              </Card>
              <Tile>
                <h3 className="font-semibold">Tile sand</h3>
                <p className="mt-1 text-sm text-muted">Kotak info ala brief.</p>
              </Tile>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <Badge>Netral</Badge>
              <Badge tone="brand">Publik</Badge>
              <Badge tone="sky">Login</Badge>
              <Badge tone="leaf">Baru</Badge>
              <Badge tone="dark">Permintaan masuk</Badge>
            </div>
          </Block>

          <Block title="Form">
            <div className="grid max-w-3xl gap-5 sm:grid-cols-2">
              <Field label="Nama lengkap" htmlFor="sg-name">
                <Input id="sg-name" placeholder="Nama Anda" />
              </Field>
              <Field label="Industri" htmlFor="sg-ind" hint="Dipakai untuk rekomendasi menu.">
                <Select id="sg-ind" defaultValue="">
                  <option value="" disabled>
                    Pilih industri
                  </option>
                  <option>Retail / F&B</option>
                  <option>Jasa profesional</option>
                </Select>
              </Field>
              <Field label="Email" htmlFor="sg-mail" error="Format email belum benar.">
                <Input id="sg-mail" defaultValue="anda@" aria-invalid="true" aria-describedby="sg-mail-error" />
              </Field>
              <Field label="Cerita singkat" htmlFor="sg-msg" className="sm:col-span-2">
                <Textarea id="sg-msg" placeholder="Ceritakan bisnis Anda..." />
              </Field>
            </div>
          </Block>

          <Block title="Section header">
            <SectionHeader
              kicker="06 · Homepage"
              title={
                <>
                  Homepage, <Em>section per section.</Em>
                </>
              }
              lead="Kicker oranye, judul serif dengan kata miring, lead abu."
            />
          </Block>

          <Block title="Gerak">
            <div className="space-y-6">
              <div>
                <p className="mb-3 text-sm text-muted">
                  Marquee dua baris berlawanan arah, pause saat hover, berhenti jika reduced-motion.
                </p>
                <div className="space-y-3">
                  <Marquee direction="left" duration={40}>
                    {Array.from({ length: 8 }, (_, i) => (
                      <Tile key={i} className="flex h-20 w-56 items-center justify-center font-serif text-2xl">
                        Karya {i + 1}
                      </Tile>
                    ))}
                  </Marquee>
                  <Marquee direction="right" duration={44}>
                    {Array.from({ length: 8 }, (_, i) => (
                      <Tile key={i} className="flex h-20 w-56 items-center justify-center font-serif text-2xl">
                        Studi {i + 1}
                      </Tile>
                    ))}
                  </Marquee>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {[0, 120, 240].map((d) => (
                  <Reveal key={d} delay={d}>
                    <Card className="p-6">
                      <p className="font-semibold">Reveal +{d} ms</p>
                      <p className="text-sm text-muted">Fade dan naik 20 px saat terlihat.</p>
                    </Card>
                  </Reveal>
                ))}
              </div>
            </div>
          </Block>
        </div>
      </Container>

      <Section className="border-t border-line bg-sand py-10">
        <Container className="text-sm text-muted">
          Komponen navigasi (Navbar dengan mega menu, drawer mobile, footer sticky) tampil di
          halaman ini sebagai bagian dari layout.
        </Container>
      </Section>
    </div>
  );
}

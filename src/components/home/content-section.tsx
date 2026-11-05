import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/icon";
import { Reveal } from "@/components/motion/reveal";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container, Em, Section, SectionHeader } from "@/components/ui/section";
import { formatDateId } from "@/lib/utils";
import { getLatestPosts } from "@/lib/posts";

/** H7: latest blog posts + a forum teaser (forum itself is a later phase). */
export async function ContentSection() {
  const posts = await getLatestPosts(3);

  return (
    <Section id="blog" className="border-t border-line">
      <Container>
        <Reveal>
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <SectionHeader
              kicker="Blog & forum"
              title={
                <>
                  Belajar dulu, <Em>bertanya kapan saja.</Em>
                </>
              }
              lead="Tulisan dari tim Omnity tentang teknologi, pembayaran digital, dan cara membangun bisnis yang efisien."
            />
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 self-start text-sm font-semibold text-accent hover:underline lg:self-auto"
            >
              Semua artikel <Icon name="arrow-right" className="size-4" />
            </Link>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-4 lg:grid-cols-[2fr_1fr]">
          {posts.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-3 lg:col-span-1 lg:grid-cols-3">
              {posts.map((p, i) => (
                <Reveal key={p.slug} delay={i * 80}>
                  <Link href={`/blog/${p.slug}`} className="group block h-full">
                    <Card interactive className="flex h-full flex-col overflow-hidden">
                      <div className="relative aspect-[16/9] bg-sand">
                        {p.cover ? (
                          <Image
                            src={p.cover}
                            alt=""
                            fill
                            sizes="(min-width: 1024px) 22vw, 90vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                          />
                        ) : null}
                      </div>
                      <div className="flex flex-1 flex-col p-5">
                        <p className="text-xs text-muted">{formatDateId(p.publishedAt)}</p>
                        <h3 className="mt-1.5 font-serif text-xl leading-snug tracking-tight">{p.title}</h3>
                      </div>
                    </Card>
                  </Link>
                </Reveal>
              ))}
            </div>
          ) : (
            <Reveal>
              <Card className="flex h-full flex-col items-start justify-center gap-4 border-dashed bg-transparent p-8 shadow-none sm:p-10">
                <span className="inline-flex size-11 items-center justify-center rounded-xl bg-sand">
                  <Icon name="book-open" className="size-5" />
                </span>
                <h3 className="font-serif text-3xl tracking-tight">Artikel pertama segera terbit.</h3>
                <p className="max-w-md text-muted">
                  Tim Omnity sedang menyiapkan tulisan tentang teknologi dan bisnis. Kunjungi blog untuk
                  melihat yang terbaru.
                </p>
                <ButtonLink href="/blog" variant="secondary" shape="pill">
                  Buka blog
                </ButtonLink>
              </Card>
            </Reveal>
          )}

          <Reveal delay={120}>
            <Card className="flex h-full flex-col justify-between bg-sand p-7">
              <div>
                <span className="inline-flex size-11 items-center justify-center rounded-xl bg-surface">
                  <Icon name="message" className="size-5" />
                </span>
                <h3 className="mt-5 font-serif text-3xl tracking-tight">Forum tanya-jawab</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  Tanyakan apa pun seputar produk, layanan, dan teknologi. Forum akan segera dibuka, tim Omnity
                  ikut menjawab.
                </p>
              </div>
              <ButtonLink href="/forum" className="mt-8 self-start" shape="pill">
                Tanya di forum
              </ButtonLink>
            </Card>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}

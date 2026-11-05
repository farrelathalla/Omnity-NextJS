import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/icon";
import { PageHero } from "@/components/page-hero";
import { Card } from "@/components/ui/card";
import { Container, Em } from "@/components/ui/section";
import { Input } from "@/components/ui/form";
import { getPublishedPosts, type PostCard } from "@/lib/posts";
import { formatDateId } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Blog",
  description: "Tulisan dari tim Omnity tentang teknologi, pembayaran digital, dan cara membangun bisnis yang efisien.",
  alternates: { canonical: "/blog" },
};

// Reads the database per request (search and pagination are query-driven).
export const dynamic = "force-dynamic";

const PAGE = 9;
const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

function Cover({ post, priority }: { post: PostCard; priority?: boolean }) {
  return (
    <div className="relative aspect-video overflow-hidden bg-sand">
      {post.cover ? (
        <Image
          src={post.cover}
          alt=""
          fill
          sizes="(min-width: 1024px) 380px, 100vw"
          quality={75}
          loading={priority ? "eager" : undefined}
          fetchPriority={priority ? "high" : undefined}
          className="object-cover transition-transform duration-500 ease-out-soft group-hover:scale-[1.03]"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center font-serif text-4xl text-ink/15">Omnity</div>
      )}
    </div>
  );
}

export default async function BlogPage({ searchParams }: PageProps<"/blog">) {
  const sp = await searchParams;
  const q = first(sp.q)?.trim().slice(0, 80) || undefined;
  const limit = Math.min(Math.max(Number(first(sp.n)) || PAGE, PAGE), 90);
  const { posts, total } = await getPublishedPosts({ limit: limit + 1, q });
  const shown = posts.slice(0, limit);
  const hasMore = total > limit;
  const [lead, ...rest] = shown;

  const moreHref = `/blog?${new URLSearchParams({ ...(q ? { q } : {}), n: String(limit + PAGE) })}`;

  return (
    <>
      <PageHero
        kicker="Blog"
        crumbs={[{ label: "Blog", href: "/blog" }]}
        title={
          <>
            Belajar dari <Em tone="ink">tim Omnity.</Em>
          </>
        }
        lead="Tulisan tentang teknologi, pembayaran digital, dan cara membangun bisnis yang efisien."
      >
        <form method="get" role="search" className="mt-8 flex max-w-md gap-2">
          <Input name="q" defaultValue={q} placeholder="Cari artikel..." aria-label="Cari artikel" />
          <button className="h-11 shrink-0 rounded-[11px] bg-ink px-5 text-sm font-medium text-white hover:bg-ink-soft">
            Cari
          </button>
        </form>
      </PageHero>

      <section className="pb-24">
        <Container>
          {shown.length === 0 ? (
            <Card className="mx-auto max-w-xl border-dashed bg-transparent p-10 text-center shadow-none">
              <span className="mx-auto inline-flex size-12 items-center justify-center rounded-xl bg-sand">
                <Icon name="book-open" className="size-6" />
              </span>
              <h2 className="mt-5 font-serif text-3xl tracking-tight">
                {q ? "Tidak ada artikel yang cocok." : "Artikel pertama segera terbit."}
              </h2>
              <p className="mt-2 text-muted">
                {q
                  ? "Coba kata kunci lain."
                  : "Tim Omnity sedang menyiapkan tulisan tentang teknologi dan bisnis."}
              </p>
              {q ? (
                <Link href="/blog" className="mt-5 inline-block text-sm font-semibold text-accent hover:underline">
                  Lihat semua artikel
                </Link>
              ) : null}
            </Card>
          ) : (
            <>
              {lead ? (
                <Link href={`/blog/${lead.slug}`} className="group mb-8 block">
                  <Card interactive className="grid overflow-hidden lg:grid-cols-[1.3fr_1fr]">
                    <Cover post={lead} priority />
                    <div className="flex flex-col justify-center p-7 sm:p-10">
                      <p className="text-sm text-muted">
                        {formatDateId(lead.publishedAt)} · {lead.readingMinutes} menit baca
                      </p>
                      <h2 className="mt-3 font-serif text-3xl leading-tight tracking-tight sm:text-5xl">{lead.title}</h2>
                      <p className="mt-4 line-clamp-3 text-muted">{lead.excerpt}</p>
                      <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
                        Baca selengkapnya
                        <Icon name="arrow-right" className="size-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </Card>
                </Link>
              ) : null}

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((p) => (
                  <Link key={p.id} href={`/blog/${p.slug}`} className="group block">
                    <Card interactive className="flex h-full flex-col overflow-hidden">
                      <Cover post={p} />
                      <div className="flex flex-1 flex-col p-6">
                        <p className="text-xs text-muted">
                          {formatDateId(p.publishedAt)} · {p.readingMinutes} menit baca
                        </p>
                        <h3 className="mt-2 font-serif text-2xl leading-snug tracking-tight">{p.title}</h3>
                        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">{p.excerpt}</p>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>

              {hasMore ? (
                <div className="mt-12 text-center">
                  <Link
                    href={moreHref}
                    scroll={false}
                    className="inline-flex h-11 items-center rounded-full border border-line bg-surface px-6 text-sm font-medium hover:border-ink/30"
                  >
                    Muat lebih banyak
                  </Link>
                </div>
              ) : null}
            </>
          )}
        </Container>
      </section>
    </>
  );
}

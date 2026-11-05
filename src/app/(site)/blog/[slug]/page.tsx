import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PostArticle } from "@/components/blog/post-article";
import { CtaBand } from "@/components/home/cta-band";
import { JsonLd } from "@/components/json-ld";
import { Breadcrumbs } from "@/components/page-hero";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/section";
import { getPostBySlug, getRelatedPosts } from "@/lib/posts";
import { siteUrl } from "@/lib/site";
import { formatDateId } from "@/lib/utils";

// Rendered on demand, then cached for a minute; saving in the admin revalidates it immediately.
export const revalidate = 60;
export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const row = await getPostBySlug(slug);
  if (!row) return {};
  const { post } = row;
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      publishedTime: post.publishedAt?.toISOString(),
      authors: [row.authorName],
      images: post.coverPath ? [{ url: `/uploads/${post.coverPath}`, width: 1600, height: 900 }] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const row = await getPostBySlug(slug);
  if (!row) notFound();
  const { post, authorName } = row;
  const related = await getRelatedPosts(post.id, 3);

  return (
    <>
      <Container className="pt-8">
        <Breadcrumbs
          items={[
            { label: "Blog", href: "/blog" },
            { label: post.title, href: `/blog/${post.slug}` },
          ]}
        />
      </Container>
      <PostArticle post={{ ...post, authorName }} />

      {related.length > 0 ? (
        <section className="border-t border-line bg-sand/60 py-16">
          <Container>
            <p className="mb-6 text-sm font-semibold uppercase tracking-[0.16em] text-muted">Artikel terkait</p>
            <div className="grid gap-5 md:grid-cols-3">
              {related.map((r) => (
                <Link key={r.id} href={`/blog/${r.slug}`} className="group block">
                  <Card interactive className="h-full overflow-hidden">
                    <div className="relative aspect-video bg-sand">
                      {r.cover ? (
                        <Image src={r.cover} alt="" fill sizes="(min-width: 768px) 360px, 100vw" quality={75} className="object-cover" />
                      ) : null}
                    </div>
                    <div className="p-5">
                      <p className="text-xs text-muted">{formatDateId(r.publishedAt)}</p>
                      <h3 className="mt-1.5 font-serif text-xl leading-snug tracking-tight">{r.title}</h3>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      <CtaBand />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.excerpt,
          datePublished: post.publishedAt?.toISOString(),
          dateModified: post.updatedAt.toISOString(),
          author: { "@type": "Person", name: authorName },
          publisher: { "@type": "Organization", name: "Omnity", logo: { "@type": "ImageObject", url: `${siteUrl}/brand/omnity-mark.svg` } },
          mainEntityOfPage: `${siteUrl}/blog/${post.slug}`,
          image: post.coverPath ? `${siteUrl}/uploads/${post.coverPath}` : undefined,
        }}
      />
    </>
  );
}

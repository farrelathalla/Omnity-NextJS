import Image from "next/image";
import { ShareButtons } from "@/components/blog/share-buttons";
import { Prose } from "@/components/prose";
import { Container } from "@/components/ui/section";
import { siteUrl } from "@/lib/site";
import { formatDateId } from "@/lib/utils";

export type ArticleData = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverPath: string | null;
  publishedAt: Date | null;
  readingMinutes: number;
  authorName: string;
};

/** One article, shared by the public page and the admin preview. */
export function PostArticle({ post, preview }: { post: ArticleData; preview?: boolean }) {
  return (
    <article>
      <Container className="max-w-[820px] pb-10 pt-12 sm:pt-16">
        {preview ? (
          <p className="mb-6 rounded-xl bg-sky-50 px-4 py-2.5 text-sm text-sky">
            Pratinjau: halaman ini belum tentu terlihat publik.
          </p>
        ) : null}
        <p className="text-sm text-muted">
          {post.publishedAt ? formatDateId(post.publishedAt) : "Belum terbit"} · {post.readingMinutes} menit baca
        </p>
        <h1 className="mt-4 font-serif text-4xl leading-[1.05] tracking-tight sm:text-6xl">{post.title}</h1>
        {post.excerpt ? <p className="mt-5 text-xl leading-relaxed text-muted">{post.excerpt}</p> : null}
        <p className="mt-6 text-sm">
          Oleh <span className="font-semibold">{post.authorName}</span>
        </p>
      </Container>

      {post.coverPath ? (
        <Container className="max-w-[1000px]">
          <Image
            src={`/uploads/${post.coverPath}`}
            alt=""
            width={1600}
            height={900}
            sizes="(min-width: 1024px) 940px, 100vw"
            quality={85}
            loading="eager"
            fetchPriority="high"
            className="h-auto w-full rounded-2xl border border-line object-cover"
          />
        </Container>
      ) : null}

      <Container className="pb-4 pt-10 sm:pt-14">
        {/* Sanitised with sanitize-html on save (src/lib/html.ts). */}
        <Prose dangerouslySetInnerHTML={{ __html: post.content }} />
        <div className="mx-auto mt-12 max-w-[680px] border-t border-line pt-6">
          <ShareButtons url={`${siteUrl}/blog/${post.slug}`} title={post.title} />
        </div>
      </Container>
    </article>
  );
}

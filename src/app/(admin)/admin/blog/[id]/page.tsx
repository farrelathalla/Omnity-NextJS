import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PostForm } from "@/components/admin/post-form";
import { requireAdmin } from "@/lib/auth";
import { adminStatus, getPostById } from "@/lib/posts";

export const metadata: Metadata = { title: "Edit artikel" };
export const dynamic = "force-dynamic";

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

const savedText: Record<string, string> = {
  draft: "Draf tersimpan.",
  now: "Artikel diterbitkan.",
  schedule: "Artikel dijadwalkan.",
};

export default async function EditPostPage({ params, searchParams }: PageProps<"/admin/blog/[id]">) {
  const { id: rawId } = await params;
  await requireAdmin(`/admin/blog/${rawId}`);
  const id = Number(rawId);
  if (!Number.isInteger(id)) notFound();
  const post = await getPostById(id);
  if (!post) notFound();
  const saved = first((await searchParams).disimpan);
  const status = adminStatus(post);

  return (
    <div className="max-w-6xl">
      <Link href="/admin/blog" className="text-sm text-muted hover:text-ink">
        &larr; Semua artikel
      </Link>
      <h1 className="mb-6 mt-3 font-serif text-4xl tracking-tight">Edit artikel</h1>
      {saved && savedText[saved] ? (
        <p role="status" className="mb-6 rounded-xl bg-leaf-50 px-4 py-3 text-sm text-leaf">
          {savedText[saved]}{" "}
          {status === "published" ? (
            <Link href={`/blog/${post.slug}`} target="_blank" className="font-semibold underline">
              Lihat artikel
            </Link>
          ) : null}
        </p>
      ) : null}
      <PostForm
        key={`${post.id}-${post.updatedAt.getTime()}`}
        initial={{
          id: post.id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          coverPath: post.coverPath,
          mode: status === "draft" ? "draft" : status === "scheduled" ? "schedule" : "now",
          publishedAt: post.publishedAt?.toISOString() ?? null,
        }}
      />
    </div>
  );
}

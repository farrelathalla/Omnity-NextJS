import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostArticle } from "@/components/blog/post-article";
import { requireAdmin } from "@/lib/auth";
import { getPostById } from "@/lib/posts";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export const metadata: Metadata = { title: "Pratinjau artikel" };
export const dynamic = "force-dynamic";

export default async function PreviewPage({ params }: PageProps<"/admin/blog/[id]/preview">) {
  const { id: rawId } = await params;
  await requireAdmin(`/admin/blog/${rawId}/preview`);
  const id = Number(rawId);
  if (!Number.isInteger(id)) notFound();
  const post = await getPostById(id);
  if (!post) notFound();
  const [author] = await db().select({ name: users.name }).from(users).where(eq(users.id, post.authorId)).limit(1);

  return (
    <div className="-mx-5 -my-8 bg-canvas sm:-mx-8 lg:-mx-12 lg:-my-10">
      <PostArticle post={{ ...post, authorName: author?.name ?? "Omnity" }} preview />
    </div>
  );
}

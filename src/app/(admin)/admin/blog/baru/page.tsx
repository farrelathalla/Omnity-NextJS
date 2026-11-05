import type { Metadata } from "next";
import Link from "next/link";
import { PostForm } from "@/components/admin/post-form";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = { title: "Artikel baru" };

export default async function NewPostPage() {
  await requireAdmin("/admin/blog/baru");
  return (
    <div className="max-w-6xl">
      <Link href="/admin/blog" className="text-sm text-muted hover:text-ink">
        &larr; Semua artikel
      </Link>
      <h1 className="mb-8 mt-3 font-serif text-4xl tracking-tight">Artikel baru</h1>
      <PostForm
        initial={{ title: "", slug: "", excerpt: "", content: "", coverPath: null, mode: "draft", publishedAt: null }}
      />
    </div>
  );
}

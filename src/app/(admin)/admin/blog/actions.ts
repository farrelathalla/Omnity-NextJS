"use server";

import { and, eq, ne } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/db";
import { posts } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { makeExcerpt, plainText, readingMinutes, sanitizePostHtml } from "@/lib/html";
import { slugify } from "@/lib/slug";

export type SavePostState = {
  message?: string;
  errors?: Partial<Record<"title" | "slug" | "content" | "publishAt" | "excerpt", string>>;
};

const schema = z.object({
  id: z.coerce.number().int().positive().optional(),
  title: z.string().trim().min(3, "Judul minimal 3 karakter").max(200, "Judul maksimal 200 karakter"),
  slug: z.string().trim().max(120).optional(),
  excerpt: z.string().trim().max(400, "Ringkasan maksimal 400 karakter").optional(),
  content: z.string().max(400_000, "Isi artikel terlalu panjang"),
  // Only paths produced by our own upload pipeline are accepted.
  coverPath: z.string().regex(/^\d{4}\/\d{2}\/[a-f0-9]+\.webp$/).optional().or(z.literal("")),
  mode: z.enum(["draft", "now", "schedule"]),
  publishAt: z.string().optional(),
});

async function uniqueSlug(base: string, excludeId?: number) {
  const root = base || "artikel";
  for (let n = 1; n < 200; n++) {
    const candidate = n === 1 ? root : `${root}-${n}`;
    const [hit] = await db()
      .select({ id: posts.id })
      .from(posts)
      .where(excludeId ? and(eq(posts.slug, candidate), ne(posts.id, excludeId)) : eq(posts.slug, candidate))
      .limit(1);
    if (!hit) return candidate;
  }
  return `${root}-${Date.now()}`;
}

export async function savePost(_prev: SavePostState, formData: FormData): Promise<SavePostState> {
  const admin = await requireAdmin("/admin/blog");

  const parsed = schema.safeParse({
    id: formData.get("id") || undefined,
    title: formData.get("title"),
    slug: formData.get("slug") || undefined,
    excerpt: formData.get("excerpt") || undefined,
    content: formData.get("content") ?? "",
    coverPath: formData.get("coverPath") || "",
    mode: formData.get("mode"),
    publishAt: formData.get("publishAt") || undefined,
  });
  if (!parsed.success) {
    const errors: NonNullable<SavePostState["errors"]> = {};
    for (const i of parsed.error.issues) {
      const k = i.path[0] as keyof NonNullable<SavePostState["errors"]>;
      if (k && !errors[k]) errors[k] = i.message;
    }
    return { message: "Periksa kembali isian yang ditandai.", errors };
  }
  const v = parsed.data;

  const content = sanitizePostHtml(v.content);
  if (v.mode !== "draft" && plainText(content).length < 20) {
    return { message: "Isi artikel masih kosong.", errors: { content: "Tulis isi artikel sebelum diterbitkan." } };
  }

  const existing = v.id
    ? (await db().select().from(posts).where(eq(posts.id, v.id)).limit(1))[0]
    : undefined;
  if (v.id && !existing) return { message: "Artikel tidak ditemukan." };

  const slug = await uniqueSlug(slugify(v.slug || v.title), existing?.id);
  const now = new Date();

  let publishedAt: Date | null = existing?.publishedAt ?? null;
  let status: "draft" | "published" = "draft";
  if (v.mode === "now") {
    status = "published";
    const keep = existing?.status === "published" && existing.publishedAt && existing.publishedAt <= now;
    publishedAt = keep ? existing!.publishedAt : now;
  } else if (v.mode === "schedule") {
    const when = v.publishAt ? new Date(v.publishAt) : null;
    if (!when || Number.isNaN(when.getTime()) || when.getTime() < now.getTime() + 60_000) {
      return {
        message: "Waktu jadwal tidak valid.",
        errors: { publishAt: "Pilih waktu terbit di masa depan." },
      };
    }
    status = "published";
    publishedAt = when;
  }

  // An excerpt the admin never edited (empty, or still equal to the one we generated from the
  // previous content) follows the article; a hand-written one is kept as is.
  const wasAuto = !!existing && existing.excerpt === makeExcerpt(existing.content);
  const keepManual = !!v.excerpt && !(wasAuto && v.excerpt === existing?.excerpt);

  const values = {
    title: v.title,
    slug,
    excerpt: keepManual ? v.excerpt! : makeExcerpt(content),
    content,
    coverPath: v.coverPath || null,
    status,
    publishedAt,
    readingMinutes: readingMinutes(content),
  };

  let id = existing?.id;
  if (existing) {
    await db().update(posts).set(values).where(eq(posts.id, existing.id));
  } else {
    const [res] = await db().insert(posts).values({ ...values, authorId: admin.id });
    id = res.insertId;
  }

  revalidatePath("/blog");
  revalidatePath("/");
  revalidatePath(`/blog/${slug}`);
  if (existing && existing.slug !== slug) revalidatePath(`/blog/${existing.slug}`);
  revalidatePath("/sitemap.xml");
  redirect(`/admin/blog/${id}?disimpan=${v.mode}`);
}

export async function deletePost(formData: FormData) {
  await requireAdmin("/admin/blog");
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id) || id <= 0) redirect("/admin/blog");
  const [row] = await db().select({ slug: posts.slug }).from(posts).where(eq(posts.id, id)).limit(1);
  await db().delete(posts).where(eq(posts.id, id));
  revalidatePath("/blog");
  revalidatePath("/");
  if (row) revalidatePath(`/blog/${row.slug}`);
  revalidatePath("/sitemap.xml");
  redirect("/admin/blog?dihapus=1");
}

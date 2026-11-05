import "server-only";
import { and, desc, eq, like, lte, ne, or, sql, type SQL } from "drizzle-orm";
import { db } from "@/db";
import { posts, users, type Post } from "@/db/schema";

export type PostCard = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  cover: string | null;
  publishedAt: string;
  readingMinutes: number;
  authorName: string;
};

export const uploadUrl = (rel: string | null) => (rel ? `/uploads/${rel}` : null);

const cardFields = {
  id: posts.id,
  slug: posts.slug,
  title: posts.title,
  excerpt: posts.excerpt,
  coverPath: posts.coverPath,
  publishedAt: posts.publishedAt,
  readingMinutes: posts.readingMinutes,
  authorName: users.name,
};

type CardRow = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  coverPath: string | null;
  publishedAt: Date | null;
  readingMinutes: number;
  authorName: string;
};

const toCard = (r: CardRow): PostCard => ({
  id: r.id,
  slug: r.slug,
  title: r.title,
  excerpt: r.excerpt,
  cover: uploadUrl(r.coverPath),
  publishedAt: (r.publishedAt ?? new Date()).toISOString(),
  readingMinutes: r.readingMinutes,
  authorName: r.authorName,
});

/** Public visibility: published, and its publish time has arrived (this is what "scheduled" means). */
const isVisible = () => and(eq(posts.status, "published"), lte(posts.publishedAt, sql`NOW()`))!;

const escapeLike = (s: string) => s.replace(/[\\%_]/g, (c) => `\\${c}`);

export async function getPublishedPosts(opts: { limit: number; q?: string }) {
  const search: SQL | undefined = opts.q
    ? or(
        like(posts.title, `%${escapeLike(opts.q)}%`),
        like(posts.excerpt, `%${escapeLike(opts.q)}%`),
      )
    : undefined;
  const where = search ? and(isVisible(), search) : isVisible();

  const [rows, [count]] = await Promise.all([
    db()
      .select(cardFields)
      .from(posts)
      .innerJoin(users, eq(users.id, posts.authorId))
      .where(where)
      .orderBy(desc(posts.publishedAt), desc(posts.id))
      .limit(opts.limit),
    db().select({ n: sql<number>`COUNT(*)` }).from(posts).where(where),
  ]);
  return { posts: rows.map(toCard), total: Number(count?.n ?? 0) };
}

/** Used by static pages (home, sitemap): never throws, a missing DB just means no posts. */
export async function getLatestPosts(limit = 3): Promise<PostCard[]> {
  try {
    return (await getPublishedPosts({ limit })).posts;
  } catch (err) {
    console.error("[posts] getLatestPosts failed:", err instanceof Error ? err.message : err);
    return [];
  }
}

export async function getPostBySlug(slug: string, opts: { preview?: boolean } = {}) {
  const [row] = await db()
    .select({ post: posts, authorName: users.name })
    .from(posts)
    .innerJoin(users, eq(users.id, posts.authorId))
    .where(opts.preview ? eq(posts.slug, slug) : and(eq(posts.slug, slug), isVisible()))
    .limit(1);
  return row ?? null;
}

export async function getPostById(id: number) {
  const [row] = await db().select().from(posts).where(eq(posts.id, id)).limit(1);
  return row ?? null;
}

export async function getRelatedPosts(excludeId: number, limit = 3): Promise<PostCard[]> {
  const rows = await db()
    .select(cardFields)
    .from(posts)
    .innerJoin(users, eq(users.id, posts.authorId))
    .where(and(isVisible(), ne(posts.id, excludeId)))
    .orderBy(desc(posts.publishedAt))
    .limit(limit);
  return rows.map(toCard);
}

export type AdminPostStatus = "draft" | "scheduled" | "published";

export function adminStatus(p: Pick<Post, "status" | "publishedAt">): AdminPostStatus {
  if (p.status !== "published") return "draft";
  return p.publishedAt && p.publishedAt.getTime() > Date.now() ? "scheduled" : "published";
}

export async function listAdminPosts(opts: { q?: string }) {
  const where = opts.q ? like(posts.title, `%${escapeLike(opts.q)}%`) : undefined;
  return db()
    .select({
      id: posts.id,
      title: posts.title,
      slug: posts.slug,
      status: posts.status,
      publishedAt: posts.publishedAt,
      updatedAt: posts.updatedAt,
      authorName: users.name,
    })
    .from(posts)
    .innerJoin(users, eq(users.id, posts.authorId))
    .where(where)
    .orderBy(desc(posts.updatedAt));
}

// Replaced by DB-backed queries in phase 4. Until then there are no posts.
export type PostCard = {
  slug: string;
  title: string;
  excerpt: string;
  cover: string | null;
  publishedAt: string;
};

export async function getLatestPosts(limit = 3): Promise<PostCard[]> {
  void limit;
  return [];
}

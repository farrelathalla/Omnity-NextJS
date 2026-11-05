import { eq, sql } from "drizzle-orm";
import { headers } from "next/headers";
import { db } from "@/db";
import { rateLimits } from "@/db/schema";

/** Client IP behind Hostinger's proxy / local dev. */
export async function clientIp(): Promise<string> {
  const h = await headers();
  const fwd = h.get("x-forwarded-for");
  return (fwd?.split(",")[0] ?? h.get("x-real-ip") ?? "unknown").trim().slice(0, 64);
}

/**
 * Fixed-window limiter stored in MySQL (works across processes).
 * Returns ok=false once `max` hits are exceeded within `windowSec`.
 */
export async function rateLimit(key: string, max: number, windowSec: number) {
  const now = Date.now();
  const windowMs = windowSec * 1000;
  // MySQL evaluates the assignments left to right, so `count` still sees the old window_start.
  await db().execute(sql`
    INSERT INTO rate_limits (\`key\`, \`count\`, window_start)
    VALUES (${key}, 1, ${now})
    ON DUPLICATE KEY UPDATE
      \`count\` = IF(window_start + ${windowMs} < ${now}, 1, \`count\` + 1),
      window_start = IF(window_start + ${windowMs} < ${now}, ${now}, window_start)
  `);
  const [row] = await db().select().from(rateLimits).where(eq(rateLimits.key, key));
  const count = row?.count ?? 1;
  const retryAfter = Math.max(0, Math.ceil(((row?.windowStart ?? now) + windowMs - now) / 1000));
  return { ok: count <= max, retryAfter };
}

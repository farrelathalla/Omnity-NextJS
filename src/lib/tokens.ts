import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { and, eq, isNull, sql } from "drizzle-orm";
import { db } from "@/db";
import { emailTokens } from "@/db/schema";

export type TokenType = "verify" | "reset";

const sha256 = (s: string) => createHash("sha256").update(s).digest("hex");

/**
 * Creates a one-time token for a user and returns the RAW value (to put in the
 * email link). Only its hash is stored, so a database leak does not leak live
 * links. Older unused tokens of the same type are invalidated.
 */
export async function issueToken(userId: number, type: TokenType, ttlMinutes: number) {
  await db()
    .delete(emailTokens)
    .where(and(eq(emailTokens.userId, userId), eq(emailTokens.type, type), isNull(emailTokens.usedAt)));
  const raw = randomBytes(32).toString("base64url");
  await db().insert(emailTokens).values({
    userId,
    type,
    tokenHash: sha256(raw),
    expiresAt: new Date(Date.now() + ttlMinutes * 60_000),
  });
  return raw;
}

/** Read-only check, used to decide whether to show the "set new password" form. */
export async function peekToken(raw: string, type: TokenType): Promise<number | null> {
  if (!raw || raw.length > 100) return null;
  const [row] = await db()
    .select({ userId: emailTokens.userId })
    .from(emailTokens)
    .where(
      and(
        eq(emailTokens.tokenHash, sha256(raw)),
        eq(emailTokens.type, type),
        isNull(emailTokens.usedAt),
        sql`${emailTokens.expiresAt} > NOW()`,
      ),
    )
    .limit(1);
  return row?.userId ?? null;
}

/** Atomically spends a token (single UPDATE), so a link cannot be used twice, even concurrently. */
export async function consumeToken(raw: string, type: TokenType): Promise<number | null> {
  const userId = await peekToken(raw, type);
  if (!userId) return null;
  const [res] = await db()
    .update(emailTokens)
    .set({ usedAt: sql`NOW()` })
    .where(
      and(
        eq(emailTokens.tokenHash, sha256(raw)),
        eq(emailTokens.type, type),
        isNull(emailTokens.usedAt),
        sql`${emailTokens.expiresAt} > NOW()`,
      ),
    );
  return res.affectedRows === 1 ? userId : null;
}

import "server-only";
import { eq } from "drizzle-orm";
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { db } from "@/db";
import { users, type User } from "@/db/schema";
import { siteUrl } from "@/lib/site";

export const SESSION_COOKIE = "omnity_session";
const SESSION_DAYS = 14;

function secret() {
  const s = process.env.AUTH_SECRET;
  if (!s || s.length < 32) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("AUTH_SECRET must be set (32+ characters) in production");
    }
    return new TextEncoder().encode("dev-only-insecure-secret-dev-only-insecure");
  }
  return new TextEncoder().encode(s);
}

type SessionPayload = { sub: string; role: string; tv: number };

/** Signs a session JWT and stores it in an httpOnly cookie. */
export async function createSession(user: Pick<User, "id" | "role" | "tokenVersion">) {
  const token = await new SignJWT({ role: user.role, tv: user.tokenVersion })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(String(user.id))
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DAYS}d`)
    .sign(secret());

  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: siteUrl.startsWith("https://"),
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
}

export async function destroySession() {
  (await cookies()).delete(SESSION_COOKIE);
}

/**
 * The signed-in user, or null. Re-checks the database on every request so a
 * role change or `tokenVersion` bump takes effect immediately. Memoised per request.
 */
export const getCurrentUser = cache(async (): Promise<User | null> => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify<SessionPayload>(token, secret(), { algorithms: ["HS256"] });
    const id = Number(payload.sub);
    if (!Number.isInteger(id)) return null;
    const [user] = await db().select().from(users).where(eq(users.id, id)).limit(1);
    if (!user || user.tokenVersion !== payload.tv) return null;
    return user;
  } catch {
    return null;
  }
});

/** Only allow same-site relative redirects (blocks open redirects like //evil.com). */
export function safeNext(next: string | null | undefined): string | null {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.includes("\\")) return null;
  return next;
}

export async function requireUser(next = "/") {
  const user = await getCurrentUser();
  if (!user) redirect(`/masuk?next=${encodeURIComponent(next)}`);
  return user;
}

/** Use at the top of every admin page, server action and route handler. */
export async function requireAdmin(next = "/admin") {
  const user = await requireUser(next);
  if (user.role !== "admin") redirect("/");
  return user;
}

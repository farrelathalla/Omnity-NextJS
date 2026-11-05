import { decodeIdToken } from "arctic";
import { eq, or } from "drizzle-orm";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { sendWelcomeEmail } from "@/lib/account-mail";
import { createSession, safeNext } from "@/lib/auth";
import { googleClient, googleEnabled } from "@/lib/google";
import { siteUrl } from "@/lib/site";

type Claims = { sub?: string; email?: string; email_verified?: boolean; name?: string };

const fail = (why: string) => NextResponse.redirect(new URL(`/masuk?google=${why}`, siteUrl));

export async function GET(req: Request) {
  if (!googleEnabled()) return fail("nonaktif");
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  const jar = await cookies();
  const savedState = jar.get("g_state")?.value;
  const verifier = jar.get("g_verifier")?.value;
  const next = safeNext(jar.get("g_next")?.value);
  for (const c of ["g_state", "g_verifier", "g_next"]) jar.delete({ name: c, path: "/api/auth/google" });

  // `state` ties the callback to the browser that started the flow (CSRF protection).
  if (!code || !state || !savedState || state !== savedState || !verifier) return fail("gagal");

  let claims: Claims;
  try {
    const tokens = await googleClient().validateAuthorizationCode(code, verifier);
    claims = decodeIdToken(tokens.idToken()) as Claims;
  } catch {
    return fail("gagal");
  }
  const email = claims.email?.toLowerCase();
  if (!claims.sub || !email || claims.email_verified !== true) return fail("email");

  const [found] = await db()
    .select()
    .from(users)
    .where(or(eq(users.googleId, claims.sub), eq(users.email, email)))
    .limit(1);

  let user = found;
  let created = false;
  if (!user) {
    const [res] = await db().insert(users).values({
      email,
      name: (claims.name ?? email.split("@")[0]).slice(0, 120),
      googleId: claims.sub,
      emailVerifiedAt: new Date(), // Google vouches for the address
    });
    [user] = await db().select().from(users).where(eq(users.id, res.insertId)).limit(1);
    created = true;
  } else if (!user.googleId || !user.emailVerifiedAt) {
    // Same verified address: link the Google identity to the existing account.
    await db()
      .update(users)
      .set({ googleId: claims.sub, emailVerifiedAt: user.emailVerifiedAt ?? new Date() })
      .where(eq(users.id, user.id));
    user = { ...user, googleId: claims.sub, emailVerifiedAt: user.emailVerifiedAt ?? new Date() };
  }

  await createSession(user);
  if (created) await sendWelcomeEmail(user);

  // First Google sign-in: company and phone are still needed (brief chapter 09).
  const incomplete = !user.company || !user.phone;
  const dest = incomplete
    ? `/profil/lengkapi${next ? `?next=${encodeURIComponent(next)}` : ""}`
    : (next ?? (user.role === "admin" ? "/admin" : "/"));
  return NextResponse.redirect(new URL(dest, siteUrl));
}

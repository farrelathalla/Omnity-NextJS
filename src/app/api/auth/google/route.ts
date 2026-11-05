import { generateCodeVerifier, generateState } from "arctic";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { safeNext } from "@/lib/auth";
import { googleClient, googleEnabled } from "@/lib/google";
import { siteUrl } from "@/lib/site";

const COOKIE = { httpOnly: true, sameSite: "lax" as const, path: "/api/auth/google", maxAge: 600 };

/** Starts the Google OAuth flow (PKCE + state, kept in short-lived httpOnly cookies). */
export async function GET(req: Request) {
  if (!googleEnabled()) return NextResponse.redirect(new URL("/masuk?google=nonaktif", siteUrl));

  const state = generateState();
  const verifier = generateCodeVerifier();
  const next = safeNext(new URL(req.url).searchParams.get("next"));
  const url = googleClient().createAuthorizationURL(state, verifier, ["openid", "profile", "email"]);

  const jar = await cookies();
  const secure = siteUrl.startsWith("https://");
  jar.set("g_state", state, { ...COOKIE, secure });
  jar.set("g_verifier", verifier, { ...COOKIE, secure });
  jar.set("g_next", next ?? "", { ...COOKIE, secure });
  return NextResponse.redirect(url);
}

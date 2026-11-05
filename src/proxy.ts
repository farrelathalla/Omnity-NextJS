import { NextResponse, type NextRequest } from "next/server";

/**
 * Optimistic gate (Next 16 "proxy", formerly middleware): visitors without a
 * session cookie are sent to the login page with the full target preserved.
 * This is only a convenience: the real checks (signature, user, role) run in
 * `requireUser()` / `requireAdmin()` on every page, action and route handler.
 */
export function proxy(req: NextRequest) {
  if (req.cookies.has("omnity_session")) return NextResponse.next();
  const url = req.nextUrl.clone();
  const target = req.nextUrl.pathname + req.nextUrl.search;
  url.pathname = "/masuk";
  url.search = `?next=${encodeURIComponent(target)}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/admin/:path*", "/proyek/:path*", "/profil/:path*"],
};

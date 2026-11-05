import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { unreadCount } from "@/lib/notify";

/** Who is signed in? Used by the client (navbar, auth modal). Never cached, never leaks email/phone. */
export async function GET() {
  const user = await getCurrentUser();
  const badge = user ? await unreadCount(user.id).catch(() => 0) : 0;
  return NextResponse.json(
    {
      user: user
        ? {
            name: user.name,
            role: user.role,
            // unread notifications: new mockup / quote / status change
            badge,
          }
        : null,
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}

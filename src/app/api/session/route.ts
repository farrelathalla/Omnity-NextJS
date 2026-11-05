import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

/** Who is signed in? Used by the client (navbar, auth modal). Never cached, never leaks email/phone. */
export async function GET() {
  const user = await getCurrentUser();
  return NextResponse.json(
    {
      user: user
        ? {
            name: user.name,
            role: user.role,
            // Filled in by the project dashboard in later phases (new mockups/quotes).
            badge: 0,
          }
        : null,
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}

import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { projects, quotes, users } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { buildQuotePdf } from "@/lib/quote-pdf";

export const runtime = "nodejs";

/** Quote PDF, built on demand. Admins can fetch any; owners only quotes that were actually sent. */
export async function GET(_req: Request, ctx: RouteContext<"/api/quotes/[id]/pdf">) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Masuk terlebih dulu." }, { status: 401 });

  const { id } = await ctx.params;
  const qid = Number(id);
  if (!Number.isInteger(qid)) return new NextResponse("Not found", { status: 404 });

  const [row] = await db()
    .select({ quote: quotes, project: projects, customer: users })
    .from(quotes)
    .innerJoin(projects, eq(projects.id, quotes.projectId))
    .innerJoin(users, eq(users.id, projects.userId))
    .where(eq(quotes.id, qid))
    .limit(1);

  // 404 (not 403) for strangers and for drafts, so quote ids reveal nothing.
  const isAdmin = user.role === "admin";
  if (!row || (!isAdmin && (row.project.userId !== user.id || row.quote.status === "draft"))) {
    return new NextResponse("Not found", { status: 404 });
  }

  const bytes = await buildQuotePdf(row);
  const name = `penawaran-${row.project.id.slice(0, 8)}-v${row.quote.version}.pdf`;
  return new NextResponse(Buffer.from(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${name}"`,
      "Cache-Control": "private, no-store",
    },
  });
}

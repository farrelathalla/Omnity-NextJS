import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { mockups, projects, uploads } from "@/db/schema";
import { and, isNotNull } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";
import { readStored, removeStored } from "@/lib/storage";

/**
 * Mockup files are uploaded by admins, so the customer is not the file's owner.
 * They may read one only when it belongs to THEIR project and its version is published.
 */
async function ownsPublishedMockup(fileId: string, kind: string, userId: number) {
  if (kind !== "mockup") return false;
  const [row] = await db()
    .select({ owner: projects.userId })
    .from(mockups)
    .innerJoin(projects, eq(projects.id, mockups.projectId))
    .where(and(eq(mockups.fileId, fileId), isNotNull(mockups.publishedAt)))
    .limit(1);
  return row?.owner === userId;
}

async function authorise(id: string) {
  const user = await getCurrentUser();
  if (!user) return { error: NextResponse.json({ error: "Masuk terlebih dulu." }, { status: 401 }) };
  if (!/^[a-f0-9]{32}$/.test(id)) return { error: new NextResponse("Not found", { status: 404 }) };

  const [file] = await db().select().from(uploads).where(eq(uploads.id, id)).limit(1);
  // Same 404 for "missing" and "not yours", so ids cannot be probed.
  if (!file || file.visibility !== "private") return { error: new NextResponse("Not found", { status: 404 }) };
  const isAdmin = user.role === "admin";
  if (!isAdmin && file.ownerId !== user.id && !(await ownsPublishedMockup(file.id, file.kind, user.id))) {
    return { error: new NextResponse("Not found", { status: 404 }) };
  }
  return { user, file, isAdmin };
}

/** Private project files: only the owner and admins can read them. */
export async function GET(_req: Request, ctx: RouteContext<"/api/files/[id]">) {
  const { id } = await ctx.params;
  const a = await authorise(id);
  if ("error" in a) return a.error;
  const data = await readStored(a.file.path);
  if (!data) return new NextResponse("Not found", { status: 404 });
  return new NextResponse(new Uint8Array(data), {
    headers: {
      "Content-Type": a.file.mime,
      "Content-Disposition": `inline; filename="${(a.file.originalName ?? "file").replace(/[^\w.\- ]/g, "_")}"`,
      "Cache-Control": "private, max-age=3600",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

/** Owner removes an attachment while the project is still a draft. */
export async function DELETE(_req: Request, ctx: RouteContext<"/api/files/[id]">) {
  const { id } = await ctx.params;
  const a = await authorise(id);
  if ("error" in a) return a.error;
  if (a.file.ownerId !== a.user.id) return new NextResponse("Not found", { status: 404 });
  if (a.file.projectId) {
    const [p] = await db().select({ status: projects.status }).from(projects).where(eq(projects.id, a.file.projectId)).limit(1);
    if (p?.status !== "draft") return NextResponse.json({ error: "Proyek sudah dikirim." }, { status: 409 });
  }
  await db().delete(uploads).where(eq(uploads.id, id));
  await removeStored(a.file.path);
  return NextResponse.json({ ok: true });
}

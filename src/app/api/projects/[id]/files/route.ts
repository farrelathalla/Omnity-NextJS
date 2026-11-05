import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { uploads } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { getOwnedProject } from "@/lib/projects";
import { rateLimit } from "@/lib/rate-limit";
import { removeStored, saveImage, UploadError } from "@/lib/storage";

export const runtime = "nodejs";

const LIMITS = { logo: 1, ref: 3 } as const;

/** Upload a logo or reference screenshot for a DRAFT project. Files are private to the owner and admins. */
export async function POST(req: Request, ctx: RouteContext<"/api/projects/[id]/files">) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Masuk terlebih dulu." }, { status: 401 });

  const origin = req.headers.get("origin");
  const host = req.headers.get("host");
  if (origin && host && new URL(origin).host !== host) {
    return NextResponse.json({ error: "Asal permintaan tidak valid." }, { status: 403 });
  }

  const { id } = await ctx.params;
  const project = await getOwnedProject(id, user.id);
  if (!project || project.status !== "draft") {
    return NextResponse.json({ error: "Proyek tidak ditemukan atau sudah dikirim." }, { status: 404 });
  }
  const limit = await rateLimit(`project-upload:${user.id}`, 40, 60 * 60);
  if (!limit.ok) return NextResponse.json({ error: "Terlalu banyak unggahan, coba lagi nanti." }, { status: 429 });

  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  const kind = form?.get("kind") === "logo" ? "logo" : "ref";
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Pilih file gambar." }, { status: 400 });
  }

  const dbKind = `project-${kind}`;
  const existing = await db()
    .select({ id: uploads.id, path: uploads.path })
    .from(uploads)
    .where(and(eq(uploads.projectId, id), eq(uploads.kind, dbKind)));

  // A new logo replaces the old one; screenshots are capped.
  if (kind === "logo") {
    for (const old of existing) {
      await db().delete(uploads).where(eq(uploads.id, old.id));
      await removeStored(old.path);
    }
  } else if (existing.length >= LIMITS.ref) {
    return NextResponse.json({ error: `Maksimal ${LIMITS.ref} screenshot referensi.` }, { status: 400 });
  }

  try {
    const saved = await saveImage({
      buffer: Buffer.from(await file.arrayBuffer()),
      kind: dbKind,
      ownerId: user.id,
      visibility: "private",
      projectId: id,
      originalName: file.name,
    });
    return NextResponse.json({ id: saved.id, name: file.name, url: saved.url });
  } catch (err) {
    if (err instanceof UploadError) return NextResponse.json({ error: err.message }, { status: 400 });
    console.error("[project-upload] failed", err);
    return NextResponse.json({ error: "Gagal memproses gambar." }, { status: 500 });
  }
}

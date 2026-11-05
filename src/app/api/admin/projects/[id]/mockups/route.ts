import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { mockups } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { getAdminProject, getMockups, latestMockupVersion } from "@/lib/admin-projects";
import { rateLimit } from "@/lib/rate-limit";
import { saveImage, savePdf, UploadError } from "@/lib/storage";

export const runtime = "nodejs";

const meta = z.object({
  title: z.string().trim().min(1, "Beri judul (mis. nama halaman)").max(120),
  device: z.enum(["desktop", "mobile", "any"]),
  kind: z.enum(["image", "pdf", "link"]),
  note: z.string().trim().max(1000).optional(),
  url: z.string().trim().max(400).optional(),
});

/** Admin adds one mockup item (image, PDF, or a Figma/prototype link) to the project's pending version. */
export async function POST(req: Request, ctx: RouteContext<"/api/admin/projects/[id]/mockups">) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") return NextResponse.json({ error: "Tidak diizinkan." }, { status: 401 });

  const origin = req.headers.get("origin");
  const host = req.headers.get("host");
  if (origin && host && new URL(origin).host !== host) {
    return NextResponse.json({ error: "Asal permintaan tidak valid." }, { status: 403 });
  }
  const limit = await rateLimit(`mockup-upload:${user.id}`, 120, 60 * 60);
  if (!limit.ok) return NextResponse.json({ error: "Terlalu banyak unggahan." }, { status: 429 });

  const { id } = await ctx.params;
  const row = await getAdminProject(id);
  if (!row) return NextResponse.json({ error: "Proyek tidak ditemukan." }, { status: 404 });
  const status = row.project.status;
  if (status !== "in_review" && status !== "mockup_in_progress" && status !== "revision_requested") {
    return NextResponse.json({ error: "Mockup hanya bisa ditambah saat status Ditinjau, Pembuatan mockup, atau Revisi diminta." }, { status: 409 });
  }

  const form = await req.formData().catch(() => null);
  const parsed = meta.safeParse({
    title: form?.get("title"),
    device: form?.get("device"),
    kind: form?.get("kind"),
    note: form?.get("note") || undefined,
    url: form?.get("url") || undefined,
  });
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Isian belum benar." }, { status: 400 });
  const m = parsed.data;

  // Pending items join the unpublished version; once published, the next upload starts a new one.
  const existing = await getMockups(id);
  const latest = await latestMockupVersion(id);
  const latestHasPublished = existing.some((e) => e.version === latest && e.publishedAt);
  const version = latest === 0 ? 1 : latestHasPublished ? latest + 1 : latest;

  let fileId: string | null = null;
  let url: string | null = null;
  try {
    if (m.kind === "link") {
      if (!m.url || !/^https:\/\/[^\s]+$/i.test(m.url)) {
        return NextResponse.json({ error: "Tautan harus diawali https://" }, { status: 400 });
      }
      url = m.url;
    } else {
      const file = form?.get("file");
      if (!(file instanceof File) || file.size === 0) {
        return NextResponse.json({ error: "Pilih file." }, { status: 400 });
      }
      const buffer = Buffer.from(await file.arrayBuffer());
      const saved =
        m.kind === "pdf"
          ? await savePdf({ buffer, kind: "mockup", ownerId: user.id, projectId: id, originalName: file.name })
          : await saveImage({ buffer, kind: "mockup", ownerId: user.id, visibility: "private", projectId: id, originalName: file.name, maxWidth: 2400 });
      fileId = saved.id;
    }
  } catch (err) {
    if (err instanceof UploadError) return NextResponse.json({ error: err.message }, { status: 400 });
    console.error("[mockup-upload] failed", err);
    return NextResponse.json({ error: "Gagal memproses file." }, { status: 500 });
  }

  await db().insert(mockups).values({
    projectId: id,
    version,
    title: m.title,
    device: m.device,
    kind: m.kind,
    fileId,
    url,
    note: m.note ?? null,
    createdBy: user.id,
  });
  return NextResponse.json({ ok: true, version });
}

import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";
import { saveImage, UploadError } from "@/lib/storage";

export const runtime = "nodejs";

/** Admin image upload for blog covers and inline images. Returns { url }. */
export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Tidak diizinkan." }, { status: 401 });
  }

  // Same-origin only (cookie-authenticated POST): reject cross-site requests.
  const origin = req.headers.get("origin");
  const host = req.headers.get("host");
  if (origin && host && new URL(origin).host !== host) {
    return NextResponse.json({ error: "Asal permintaan tidak valid." }, { status: 403 });
  }

  const limit = await rateLimit(`upload:${user.id}`, 60, 60 * 60);
  if (!limit.ok) {
    return NextResponse.json({ error: "Terlalu banyak unggahan, coba lagi nanti." }, { status: 429 });
  }

  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  const kind = form?.get("kind") === "cover" ? "post-cover" : "post-inline";
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Pilih file gambar." }, { status: 400 });
  }

  try {
    const saved = await saveImage({
      buffer: Buffer.from(await file.arrayBuffer()),
      kind,
      ownerId: user.id,
      crop169: kind === "post-cover",
    });
    return NextResponse.json({ url: saved.url, path: saved.path });
  } catch (err) {
    if (err instanceof UploadError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    console.error("[upload] failed", err);
    return NextResponse.json({ error: "Gagal memproses gambar." }, { status: 500 });
  }
}

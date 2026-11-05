import "server-only";
import { randomBytes } from "node:crypto";
import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { db } from "@/db";
import { uploads } from "@/db/schema";

/**
 * Upload root. In production keep it OUTSIDE the app folder (UPLOAD_DIR) so a
 * deploy that replaces the app never deletes uploads.
 */
export const uploadRoot = () => path.resolve(process.env.UPLOAD_DIR ?? "storage/uploads");

export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;
const ALLOWED = new Set(["jpeg", "png", "webp", "gif", "avif"]);

export class UploadError extends Error {}

/**
 * Validates the file by decoding it (not by trusting the extension or MIME),
 * re-encodes to WebP, strips metadata, and records it. `crop169` makes a 16:9 cover.
 */
export async function saveImage(opts: {
  buffer: Buffer;
  kind: string;
  ownerId: number;
  crop169?: boolean;
  /** max output width (default 1600); mockups use more */
  maxWidth?: number;
  /** private files live under UPLOAD_DIR/private and are never served by /uploads/* */
  visibility?: "public" | "private";
  projectId?: string;
  originalName?: string;
}) {
  if (opts.buffer.length > MAX_UPLOAD_BYTES) {
    throw new UploadError("Ukuran file maksimal 8 MB.");
  }
  let meta;
  try {
    meta = await sharp(opts.buffer).metadata();
  } catch {
    throw new UploadError("File bukan gambar yang valid.");
  }
  if (!meta.format || !ALLOWED.has(meta.format)) {
    throw new UploadError("Format gambar harus JPG, PNG, WebP, GIF, atau AVIF.");
  }
  if ((meta.width ?? 0) > 12000 || (meta.height ?? 0) > 12000) {
    throw new UploadError("Dimensi gambar terlalu besar.");
  }

  let pipeline = sharp(opts.buffer, { limitInputPixels: 100_000_000 }).rotate();
  pipeline = opts.crop169
    ? pipeline.resize(1600, 900, { fit: "cover", position: "attention" })
    : pipeline.resize({ width: opts.maxWidth ?? 1600, withoutEnlargement: true });
  const out = await pipeline.webp({ quality: 82 }).toBuffer();

  const now = new Date();
  const isPrivate = opts.visibility === "private";
  const rel = `${isPrivate ? "private/" : ""}${now.getUTCFullYear()}/${String(now.getUTCMonth() + 1).padStart(2, "0")}/${randomBytes(9).toString("hex")}.webp`;
  const abs = path.join(uploadRoot(), rel);
  await mkdir(path.dirname(abs), { recursive: true });
  await writeFile(abs, out);

  const id = randomBytes(16).toString("hex");
  await db().insert(uploads).values({
    id,
    kind: opts.kind,
    path: rel,
    mime: "image/webp",
    size: out.length,
    ownerId: opts.ownerId,
    visibility: isPrivate ? "private" : "public",
    projectId: opts.projectId ?? null,
    originalName: opts.originalName?.slice(0, 160) ?? null,
  });
  return { id, path: rel, url: isPrivate ? `/api/files/${id}` : `/uploads/${rel}` };
}

/** Reads a stored file, refusing anything outside the upload root. */
export async function readStored(rel: string) {
  const root = uploadRoot();
  const abs = path.resolve(root, rel);
  if (!abs.startsWith(root + path.sep)) return null;
  try {
    return await readFile(abs);
  } catch {
    return null;
  }
}

/** Deletes a stored file from disk (best effort; the DB row is removed by the caller). */
export async function removeStored(rel: string) {
  const root = uploadRoot();
  const abs = path.resolve(root, rel);
  if (!abs.startsWith(root + path.sep)) return;
  await unlink(abs).catch(() => {});
}

export const MAX_PDF_BYTES = 15 * 1024 * 1024;

/** Stores a PDF privately. Validated by its signature, not by its name; never served from /uploads. */
export async function savePdf(opts: {
  buffer: Buffer;
  kind: string;
  ownerId: number;
  projectId?: string;
  originalName?: string;
}) {
  if (opts.buffer.length > MAX_PDF_BYTES) throw new UploadError("Ukuran PDF maksimal 15 MB.");
  if (opts.buffer.subarray(0, 5).toString("latin1") !== "%PDF-") throw new UploadError("File bukan PDF yang valid.");

  const now = new Date();
  const rel = `private/${now.getUTCFullYear()}/${String(now.getUTCMonth() + 1).padStart(2, "0")}/${randomBytes(9).toString("hex")}.pdf`;
  const abs = path.join(uploadRoot(), rel);
  await mkdir(path.dirname(abs), { recursive: true });
  await writeFile(abs, opts.buffer);

  const id = randomBytes(16).toString("hex");
  await db().insert(uploads).values({
    id,
    kind: opts.kind,
    path: rel,
    mime: "application/pdf",
    size: opts.buffer.length,
    ownerId: opts.ownerId,
    visibility: "private",
    projectId: opts.projectId ?? null,
    originalName: opts.originalName?.slice(0, 160) ?? null,
  });
  return { id, path: rel, url: `/api/files/${id}` };
}

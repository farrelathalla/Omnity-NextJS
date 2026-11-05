"use server";

import { and, desc, eq, isNull, ne, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/db";
import { mockups, projects, quotes, uploads } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { getAdminProject, latestMockupVersion } from "@/lib/admin-projects";
import { notifyUser } from "@/lib/notify";
import { addEvent } from "@/lib/projects";
import { STATUS_HINT, STATUS_LABEL, adminNextStatuses, isStatus, type ProjectStatus } from "@/lib/project-status";
import { computeTotals, endOfDayJakarta, quoteInputSchema } from "@/lib/quote";
import { removeStored } from "@/lib/storage";

export type ActionResult = { ok: true; message?: string } | { ok: false; error: string };

const projectId = z.string().regex(/^[a-f0-9]{16}$/);

const changeSchema = z.object({
  id: projectId,
  to: z.string(),
  note: z.string().trim().max(1000).optional(),
});

export async function changeStatus(input: { id: string; to: string; note?: string }): Promise<ActionResult> {
  const admin = await requireAdmin("/admin/proyek");
  const parsed = changeSchema.safeParse(input);
  if (!parsed.success || !isStatus(parsed.data.to)) return { ok: false, error: "Permintaan tidak valid." };
  const { id, note } = parsed.data;
  const to = parsed.data.to as ProjectStatus;

  const row = await getAdminProject(id);
  if (!row || !isStatus(row.project.status)) return { ok: false, error: "Proyek tidak ditemukan." };
  const from = row.project.status;
  if (!adminNextStatuses(from).includes(to)) {
    return {
      ok: false,
      error: `Dari "${STATUS_LABEL[from]}" tidak bisa langsung ke "${STATUS_LABEL[to]}".`,
    };
  }

  // Compare-and-set: a stale tab or a double click cannot move the project twice.
  const [res] = await db()
    .update(projects)
    .set({ status: to })
    .where(and(eq(projects.id, id), eq(projects.status, from)));
  if (res.affectedRows !== 1) return { ok: false, error: "Status sudah berubah. Muat ulang halaman." };

  await addEvent({ projectId: id, from, to, note: note || null, byUserId: admin.id });
  await notifyUser({
    userId: row.user.id,
    email: row.user.email,
    title: `Status proyek: ${STATUS_LABEL[to]}`,
    body: note ? `${STATUS_HINT[to]} Catatan tim: ${note}` : STATUS_HINT[to],
    href: `/proyek/${id}`,
    rows: [["Proyek", row.project.title], ["Status", STATUS_LABEL[to]]],
  });
  revalidatePath(`/admin/proyek/${id}`);
  revalidatePath(`/proyek/${id}`);
  revalidatePath("/admin/proyek");
  return { ok: true, message: `Status diubah ke "${STATUS_LABEL[to]}" dan pengguna diberi tahu.` };
}

export async function saveNote(input: { id: string; note: string }): Promise<ActionResult> {
  await requireAdmin("/admin/proyek");
  const parsed = z.object({ id: projectId, note: z.string().max(5000) }).safeParse(input);
  if (!parsed.success) return { ok: false, error: "Catatan terlalu panjang." };
  await db().update(projects).set({ adminNote: parsed.data.note || null }).where(eq(projects.id, parsed.data.id));
  revalidatePath(`/admin/proyek/${parsed.data.id}`);
  return { ok: true, message: "Catatan internal tersimpan." };
}

/** Removes a mockup item that has not been published yet (published ones are history). */
export async function deleteMockup(input: { id: number }): Promise<ActionResult> {
  await requireAdmin("/admin/proyek");
  const [m] = await db().select().from(mockups).where(eq(mockups.id, input.id)).limit(1);
  if (!m) return { ok: false, error: "Item tidak ditemukan." };
  if (m.publishedAt) return { ok: false, error: "Mockup yang sudah dipublikasikan tidak bisa dihapus." };
  await db().delete(mockups).where(eq(mockups.id, m.id));
  if (m.fileId) {
    const [f] = await db().select({ path: uploads.path }).from(uploads).where(eq(uploads.id, m.fileId)).limit(1);
    await db().delete(uploads).where(eq(uploads.id, m.fileId));
    if (f) await removeStored(f.path);
  }
  revalidatePath(`/admin/proyek/${m.projectId}`);
  return { ok: true };
}

/** Saves the working draft of the quote (creates version N+1 if the last one was already sent). */
export async function saveQuote(input: { id: string; quote: unknown }): Promise<ActionResult> {
  const admin = await requireAdmin("/admin/proyek");
  const pid = projectId.safeParse(input.id);
  const parsed = quoteInputSchema.safeParse(input.quote);
  if (!pid.success) return { ok: false, error: "Proyek tidak valid." };
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Isian penawaran belum benar." };
  const q = parsed.data;

  const row = await getAdminProject(pid.data);
  if (!row) return { ok: false, error: "Proyek tidak ditemukan." };

  const totals = computeTotals(q.items, q.discount, q.dpPercent);
  const values = {
    items: JSON.stringify(q.items),
    discount: totals.discount,
    dpPercent: q.dpPercent,
    total: totals.total,
    timeline: q.timeline,
    validUntil: q.validUntil ? endOfDayJakarta(q.validUntil) : null,
    scope: q.scope || null,
    revisions: q.revisions,
    domainHosting: q.domainHosting,
    terms: q.terms || null,
  };

  const [draft] = await db()
    .select({ id: quotes.id })
    .from(quotes)
    .where(and(eq(quotes.projectId, pid.data), eq(quotes.status, "draft")))
    .limit(1);
  if (draft) {
    await db().update(quotes).set(values).where(eq(quotes.id, draft.id));
  } else {
    const [last] = await db()
      .select({ v: quotes.version })
      .from(quotes)
      .where(eq(quotes.projectId, pid.data))
      .orderBy(desc(quotes.version))
      .limit(1);
    await db().insert(quotes).values({
      ...values,
      projectId: pid.data,
      version: (last?.v ?? 0) + 1,
      status: "draft",
      createdBy: admin.id,
    });
  }
  revalidatePath(`/admin/proyek/${pid.data}`);
  return { ok: true, message: "Draf penawaran tersimpan." };
}

/**
 * Publishes the pending mockup items and the draft quote together, moves the
 * project to "Mockup & penawaran tersedia", and tells the customer.
 */
export async function publishDeliverables(input: { id: string }): Promise<ActionResult> {
  const admin = await requireAdmin("/admin/proyek");
  const pid = projectId.safeParse(input.id);
  if (!pid.success) return { ok: false, error: "Proyek tidak valid." };
  const row = await getAdminProject(pid.data);
  if (!row) return { ok: false, error: "Proyek tidak ditemukan." };
  const from = row.project.status;
  if (from !== "mockup_in_progress" && from !== "revision_requested") {
    return { ok: false, error: 'Ubah status ke "Pembuatan mockup" dulu sebelum mempublikasikan.' };
  }

  const pending = await db()
    .select()
    .from(mockups)
    .where(and(eq(mockups.projectId, pid.data), isNull(mockups.publishedAt)));
  if (pending.length === 0) return { ok: false, error: "Unggah minimal satu mockup baru sebelum mempublikasikan." };

  const [draft] = await db()
    .select()
    .from(quotes)
    .where(and(eq(quotes.projectId, pid.data), eq(quotes.status, "draft")))
    .limit(1);
  if (!draft) return { ok: false, error: "Susun dan simpan penawaran dulu." };
  if (draft.total <= 0) return { ok: false, error: "Total penawaran masih 0. Isi harga item." };

  const [res] = await db()
    .update(projects)
    .set({ status: "mockup_ready" })
    .where(and(eq(projects.id, pid.data), eq(projects.status, from)));
  if (res.affectedRows !== 1) return { ok: false, error: "Status sudah berubah. Muat ulang halaman." };

  // Older offers can no longer be accepted; the new one replaces them.
  await db()
    .update(quotes)
    .set({ status: "superseded" })
    .where(and(eq(quotes.projectId, pid.data), eq(quotes.status, "sent"), ne(quotes.id, draft.id)));
  await db().update(quotes).set({ status: "sent", sentAt: sql`NOW()` }).where(eq(quotes.id, draft.id));
  await db()
    .update(mockups)
    .set({ publishedAt: sql`NOW()` })
    .where(and(eq(mockups.projectId, pid.data), isNull(mockups.publishedAt)));

  const version = await latestMockupVersion(pid.data);
  await addEvent({
    projectId: pid.data,
    from,
    to: "mockup_ready",
    note: `Mockup v${version} dan penawaran v${draft.version} dipublikasikan.`,
    byUserId: admin.id,
  });
  await notifyUser({
    userId: row.user.id,
    email: row.user.email,
    title: version > 1 ? "Mockup revisi dan penawaran siap" : "Mockup dan penawaran siap",
    body: "Mockup website Anda sudah tersedia beserta penawarannya. Silakan tinjau, lalu minta revisi atau setujui penawaran.",
    href: `/proyek/${pid.data}?tab=mockup`,
    cta: "Lihat mockup dan penawaran",
    rows: [["Proyek", row.project.title], ["Total penawaran", `Rp ${draft.total.toLocaleString("id-ID")}`]],
  });
  revalidatePath(`/admin/proyek/${pid.data}`);
  revalidatePath(`/proyek/${pid.data}`);
  revalidatePath("/admin/proyek");
  return { ok: true, message: "Mockup dan penawaran dipublikasikan. Pengguna sudah diberi tahu." };
}

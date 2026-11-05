"use server";

import { and, desc, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/db";
import { projects, quotes } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { emailLayout, sendMail } from "@/lib/mail";
import { notifyUser } from "@/lib/notify";
import { addEvent, getOwnedProject } from "@/lib/projects";
import { computeTotals, formatRupiah, isExpired, parseItems } from "@/lib/quote";
import { rateLimit } from "@/lib/rate-limit";
import { siteUrl } from "@/lib/site";

export type DeliverableResult = { ok: true; message: string } | { ok: false; error: string };

const adminEmail = () => process.env.MAIL_ADMIN_TO ?? "corporate@omnity.co.id";

/** Customer asks for changes to the mockup: mockup_ready -> revision_requested. */
export async function requestRevision(input: { id: string; note: string }): Promise<DeliverableResult> {
  const user = await requireUser("/proyek");
  const parsed = z.object({ id: z.string(), note: z.string().trim().min(10, "Tulis catatan revisi minimal 10 karakter.").max(2000) }).safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Catatan belum benar." };

  const limit = await rateLimit(`revision:${user.id}`, 20, 60 * 60);
  if (!limit.ok) return { ok: false, error: "Terlalu sering. Coba lagi nanti." };

  const project = await getOwnedProject(parsed.data.id, user.id);
  if (!project) return { ok: false, error: "Proyek tidak ditemukan." };
  if (project.status !== "mockup_ready") return { ok: false, error: "Revisi hanya bisa diminta saat mockup tersedia." };

  const [res] = await db()
    .update(projects)
    .set({ status: "revision_requested" })
    .where(and(eq(projects.id, project.id), eq(projects.status, "mockup_ready")));
  if (res.affectedRows !== 1) return { ok: false, error: "Status proyek sudah berubah." };
  await addEvent({ projectId: project.id, from: "mockup_ready", to: "revision_requested", note: parsed.data.note, byUserId: user.id });

  const toAdmin = emailLayout({
    title: `Revisi diminta: ${project.title}`,
    intro: `${user.name} meminta revisi mockup.`,
    rows: [["Catatan", parsed.data.note], ["Kontak", `${user.email} · ${user.phone ?? "-"}`]],
    cta: { label: "Buka di admin", href: `${siteUrl}/admin/proyek/${project.id}` },
  });
  await Promise.all([
    sendMail({ to: adminEmail(), subject: `Revisi diminta: ${project.title}`, replyTo: user.email, ...toAdmin }),
    notifyUser({
      userId: user.id,
      email: user.email,
      title: "Permintaan revisi Anda kami terima",
      body: "Tim kami akan memperbarui mockup sesuai catatan Anda dan memberi kabar saat versi baru siap.",
      href: `/proyek/${project.id}`,
      rows: [["Catatan Anda", parsed.data.note]],
    }),
  ]);
  revalidatePath(`/proyek/${project.id}`);
  revalidatePath("/proyek");
  return { ok: true, message: "Permintaan revisi terkirim." };
}

/**
 * Customer accepts the current offer: quote sent -> approved, project mockup_ready -> awaiting_payment.
 * (Online payment is the next step of the roadmap; for now the team follows up with payment details.)
 */
export async function approveQuote(input: { id: string }): Promise<DeliverableResult> {
  const user = await requireUser("/proyek");
  const project = await getOwnedProject(String(input.id), user.id);
  if (!project) return { ok: false, error: "Proyek tidak ditemukan." };
  if (project.status !== "mockup_ready") return { ok: false, error: "Penawaran tidak sedang menunggu persetujuan." };

  const [quote] = await db()
    .select()
    .from(quotes)
    .where(and(eq(quotes.projectId, project.id), eq(quotes.status, "sent")))
    .orderBy(desc(quotes.version))
    .limit(1);
  if (!quote) return { ok: false, error: "Belum ada penawaran yang bisa disetujui." };
  if (isExpired(quote.validUntil)) {
    return { ok: false, error: "Penawaran sudah melewati masa berlaku. Hubungi tim untuk penawaran baru." };
  }

  // Both flips must win their compare-and-set, so a double click approves exactly once.
  const [q] = await db()
    .update(quotes)
    .set({ status: "approved", approvedAt: sql`NOW()` })
    .where(and(eq(quotes.id, quote.id), eq(quotes.status, "sent")));
  if (q.affectedRows !== 1) return { ok: false, error: "Penawaran sudah diproses." };
  const [p] = await db()
    .update(projects)
    .set({ status: "awaiting_payment" })
    .where(and(eq(projects.id, project.id), eq(projects.status, "mockup_ready")));
  if (p.affectedRows !== 1) return { ok: false, error: "Status proyek sudah berubah." };

  const t = computeTotals(parseItems(quote.items), quote.discount, quote.dpPercent);
  await addEvent({
    projectId: project.id,
    from: "mockup_ready",
    to: "awaiting_payment",
    note: `Penawaran v${quote.version} disetujui (total ${formatRupiah(t.total)}, DP ${formatRupiah(t.dpAmount)}).`,
    byUserId: user.id,
  });

  const toAdmin = emailLayout({
    title: `Penawaran disetujui: ${project.title}`,
    intro: `${user.name} menyetujui penawaran. Kirim instruksi pembayaran DP.`,
    rows: [
      ["Total", formatRupiah(t.total)],
      [`DP ${quote.dpPercent}%`, formatRupiah(t.dpAmount)],
      ["Kontak", `${user.email} · ${user.phone ?? "-"}`],
    ],
    cta: { label: "Buka di admin", href: `${siteUrl}/admin/proyek/${project.id}` },
  });
  await Promise.all([
    sendMail({ to: adminEmail(), subject: `Penawaran disetujui: ${project.title}`, replyTo: user.email, ...toAdmin }),
    notifyUser({
      userId: user.id,
      email: user.email,
      title: "Penawaran disetujui, terima kasih",
      body: `Tim kami akan menghubungi Anda untuk pembayaran DP ${formatRupiah(t.dpAmount)} dan memulai pengerjaan.`,
      href: `/proyek/${project.id}`,
      rows: [["Total", formatRupiah(t.total)], [`DP ${quote.dpPercent}%`, formatRupiah(t.dpAmount)]],
    }),
  ]);
  revalidatePath(`/proyek/${project.id}`);
  revalidatePath("/proyek");
  return { ok: true, message: "Penawaran disetujui." };
}

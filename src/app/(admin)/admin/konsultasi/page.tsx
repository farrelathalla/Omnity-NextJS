import type { Metadata } from "next";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { inquiries } from "@/db/schema";
import { topicLabel } from "@/content/topics";
import { requireAdmin } from "@/lib/auth";
import { formatDateId } from "@/lib/utils";

export const metadata: Metadata = { title: "Konsultasi" };
export const dynamic = "force-dynamic";

export default async function AdminInquiriesPage() {
  await requireAdmin("/admin/konsultasi");
  const rows = await db().select().from(inquiries).orderBy(desc(inquiries.createdAt)).limit(200);

  return (
    <div className="max-w-5xl">
      <h1 className="font-serif text-4xl tracking-tight">Konsultasi</h1>
      <p className="mt-1 text-muted">Permintaan dari form kontak, demo produk, dan halaman layanan. Semuanya juga dikirim ke email admin.</p>

      <ul className="mt-6 space-y-3">
        {rows.length === 0 ? <li className="rounded-card border border-dashed border-line p-10 text-center text-muted">Belum ada permintaan.</li> : null}
        {rows.map((r) => (
          <li key={r.id}>
            <details className="group rounded-card border border-line bg-surface p-5 open:shadow-card">
              <summary className="flex cursor-pointer list-none flex-wrap items-center gap-x-4 gap-y-1 [&::-webkit-details-marker]:hidden">
                <span className="font-semibold">{r.name}</span>
                <span className="text-sm text-muted">{r.company ?? r.email}</span>
                <span className="rounded-full bg-sand px-2.5 py-0.5 text-xs">{topicLabel(r.topic)}</span>
                <span className="ml-auto text-xs text-muted">{formatDateId(r.createdAt)}</span>
              </summary>
              <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-[8rem_1fr]">
                <dt className="text-muted">Email</dt>
                <dd><a className="text-accent hover:underline" href={`mailto:${r.email}`}>{r.email}</a></dd>
                <dt className="text-muted">Ponsel</dt>
                <dd>{r.phone ?? "-"}</dd>
                <dt className="text-muted">Dari halaman</dt>
                <dd>{r.source ?? "-"}</dd>
                <dt className="text-muted">Pesan</dt>
                <dd className="whitespace-pre-wrap">{r.message}</dd>
              </dl>
            </details>
          </li>
        ))}
      </ul>
    </div>
  );
}

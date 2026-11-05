import type { Metadata } from "next";
import Link from "next/link";
import { DeleteDraftButton } from "@/components/projects/delete-draft-button";
import { Icon } from "@/components/icon";
import { PageHero } from "@/components/page-hero";
import { StatusBadge } from "@/components/projects/status";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container, Em } from "@/components/ui/section";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { notifications } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { listUserProjects, statusOf } from "@/lib/projects";
import { STATUS_HINT } from "@/lib/project-status";
import { formatDateId } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Proyek Saya",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default async function MyProjectsPage() {
  const user = await requireUser("/proyek");
  const items = await listUserProjects(user.id);
  const recent = await db()
    .select()
    .from(notifications)
    .where(eq(notifications.userId, user.id))
    .orderBy(desc(notifications.createdAt))
    .limit(5);

  return (
    <>
      <PageHero
        kicker="Proyek Saya"
        title={
          <>
            Proyek <Em tone="ink">Anda.</Em>
          </>
        }
        lead="Pantau status, lihat mockup, dan tinjau penawaran di satu tempat."
        actions={
          <ButtonLink href="/mulai" shape="pill">
            Proyek baru
          </ButtonLink>
        }
      />
      <section className="pb-24">
        <Container>
          {recent.length > 0 ? (
            <div className="mb-10">
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted">Pemberitahuan terbaru</h2>
              <ul className="divide-y divide-line overflow-hidden rounded-card border border-line bg-surface">
                {recent.map((n) => (
                  <li key={n.id}>
                    <Link href={n.href} className="flex items-start gap-3 px-5 py-4 transition-colors hover:bg-sand/50">
                      <span
                        aria-hidden="true"
                        className={`mt-1.5 size-2 shrink-0 rounded-full ${n.readAt ? "bg-transparent" : "bg-brand"}`}
                      />
                      <span className="min-w-0 flex-1">
                        <span className={`block text-sm ${n.readAt ? "" : "font-semibold"}`}>
                          {n.title}
                          {n.readAt ? null : <span className="sr-only"> (belum dibaca)</span>}
                        </span>
                        <span className="block truncate text-sm text-muted">{n.body}</span>
                      </span>
                      <span className="shrink-0 text-xs text-muted">{formatDateId(n.createdAt)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {items.length === 0 ? (
            <Card className="mx-auto max-w-xl border-dashed bg-transparent p-10 text-center shadow-none">
              <span className="mx-auto inline-flex size-12 items-center justify-center rounded-xl bg-sand">
                <Icon name="layers" className="size-6" />
              </span>
              <h2 className="mt-5 font-serif text-3xl tracking-tight">Belum ada proyek.</h2>
              <p className="mt-2 text-muted">
                Mulai dari Design Anything: isi survei singkat dan tim kami menyiapkan mockup website Anda.
              </p>
              <div className="mt-6 flex justify-center">
                <ButtonLink href="/mulai" shape="pill">
                  Mulai proyek
                </ButtonLink>
              </div>
            </Card>
          ) : (
            <ul className="grid gap-4">
              {items.map((p) => {
                const status = statusOf(p);
                const draft = status === "draft";
                return (
                  <li key={p.id}>
                    <Card className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-3">
                          <h2 className="truncate font-serif text-2xl tracking-tight">
                            {p.title || "Proyek tanpa judul"}
                          </h2>
                          <StatusBadge status={status} />
                        </div>
                        <p className="mt-1.5 text-sm text-muted">
                          {draft ? `Langkah ${p.surveyStep} dari 8. ` : ""}
                          {STATUS_HINT[status]}
                        </p>
                        <p className="mt-1 text-xs text-muted">
                          {draft ? "Dibuat" : "Dikirim"} {formatDateId(draft ? p.createdAt : (p.submittedAt ?? p.createdAt))}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-4">
                        {draft ? <DeleteDraftButton id={p.id} /> : null}
                        <Link
                          href={draft ? `/mulai/survei/${p.id}` : `/proyek/${p.id}`}
                          className="inline-flex h-10 items-center gap-1.5 rounded-full bg-ink px-5 text-sm font-medium text-white transition-colors hover:bg-ink-soft"
                        >
                          {draft ? "Lanjutkan survei" : "Lihat detail"}
                          <Icon name="arrow-right" className="size-4" />
                        </Link>
                      </div>
                    </Card>
                  </li>
                );
              })}
            </ul>
          )}
        </Container>
      </section>
    </>
  );
}

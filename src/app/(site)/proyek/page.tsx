import type { Metadata } from "next";
import Link from "next/link";
import { DeleteDraftButton } from "@/components/projects/delete-draft-button";
import { Icon } from "@/components/icon";
import { PageHero } from "@/components/page-hero";
import { StatusBadge } from "@/components/projects/status";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container, Em } from "@/components/ui/section";
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

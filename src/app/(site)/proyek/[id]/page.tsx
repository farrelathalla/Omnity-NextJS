import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Icon } from "@/components/icon";
import { MockupViewer, QuoteView, type ViewerVersion } from "@/components/projects/deliverables";
import { StatusBadge, StatusStepper } from "@/components/projects/status";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/section";
import { db } from "@/db";
import { mockups, quotes } from "@/db/schema";
import { and, asc, desc, eq, isNotNull, ne } from "drizzle-orm";
import { requireUser } from "@/lib/auth";
import { markProjectNotificationsRead } from "@/lib/notify";
import { isExpired, parseItems } from "@/lib/quote";
import { getOwnedProject, getProjectEvents, getProjectFiles, statusOf } from "@/lib/projects";
import { STATUS_HINT, STATUS_LABEL, isStatus } from "@/lib/project-status";
import { parseSurvey, summaryRows } from "@/lib/survey";
import { cn, formatDateId } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Detail proyek",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

const TABS = [
  { id: "ringkasan", label: "Ringkasan" },
  { id: "mockup", label: "Mockup" },
  { id: "penawaran", label: "Penawaran" },
  { id: "riwayat", label: "Riwayat" },
] as const;

const time = (d: Date) =>
  new Intl.DateTimeFormat("id-ID", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Jakarta" }).format(d);

export default async function ProjectPage({ params, searchParams }: PageProps<"/proyek/[id]">) {
  const { id } = await params;
  const sp = await searchParams;
  const user = await requireUser(`/proyek/${id}`);
  const project = await getOwnedProject(id, user.id);
  if (!project) notFound();
  const status = statusOf(project);
  if (status === "draft") redirect(`/mulai/survei/${id}`);

  const tab = TABS.find((t) => t.id === first(sp.tab))?.id ?? (status === "mockup_ready" ? "mockup" : "ringkasan");
  const sent = first(sp.terkirim) === "1";
  const [files, events, publishedMockups, quoteRows] = await Promise.all([
    getProjectFiles(id),
    getProjectEvents(id),
    // customers only ever see published items
    db().select().from(mockups).where(and(eq(mockups.projectId, id), isNotNull(mockups.publishedAt))).orderBy(asc(mockups.version), asc(mockups.id)),
    db().select().from(quotes).where(and(eq(quotes.projectId, id), ne(quotes.status, "draft"))).orderBy(desc(quotes.version)),
  ]);
  await markProjectNotificationsRead(user.id, id);
  const versions: ViewerVersion[] = [...new Set(publishedMockups.map((m) => m.version))].map((v) => ({
    version: v,
    items: publishedMockups
      .filter((m) => m.version === v)
      .map((m) => ({ id: m.id, title: m.title, device: m.device, kind: m.kind, fileId: m.fileId, url: m.url, note: m.note })),
  }));
  const quote = quoteRows.find((q) => q.status === "sent" || q.status === "approved") ?? quoteRows[0];
  const dateOnly = (d: Date | null) => (d ? formatDateId(d) : null);
  const survey = parseSurvey(project.survey);
  const sections = summaryRows(survey, files.some((f) => f.id === survey.brand.logo));

  return (
    <section className="pb-24 pt-10 sm:pt-14">
      <Container className="max-w-5xl">
        <Link href="/proyek" className="text-sm text-muted hover:text-ink">
          &larr; Semua proyek
        </Link>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <h1 className="font-serif text-4xl leading-tight tracking-tight sm:text-5xl">{project.title || "Proyek"}</h1>
          <StatusBadge status={status} />
        </div>
        <p className="mt-2 text-muted">{STATUS_HINT[status]}</p>

        {sent ? (
          <p role="status" className="mt-6 rounded-xl border border-leaf/25 bg-leaf-50 px-4 py-3 text-sm text-leaf">
            Permintaan terkirim. Kami sudah mengirim konfirmasi ke email Anda. Estimasi mockup 2 sampai 3 hari kerja.
          </p>
        ) : null}

        <div className="mt-8">
          <StatusStepper status={status} />
        </div>

        <nav aria-label="Bagian proyek" className="mt-10 flex gap-1 overflow-x-auto border-b border-line scrollbar-none">
          {TABS.map((t) => (
            <Link
              key={t.id}
              href={`/proyek/${id}?tab=${t.id}`}
              scroll={false}
              aria-current={tab === t.id ? "page" : undefined}
              className={cn(
                "-mb-px shrink-0 border-b-2 px-4 py-3 text-sm font-medium transition-colors",
                tab === t.id ? "border-ink text-ink" : "border-transparent text-muted hover:text-ink",
              )}
            >
              {t.label}
            </Link>
          ))}
        </nav>

        <div className="mt-8">
          {tab === "ringkasan" ? (
            <div className="grid gap-6 lg:grid-cols-2">
              {sections.map((r) => (
                <Card key={r.step} className="p-6">
                  <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted">{r.title}</h2>
                  <dl className="mt-3 space-y-2 text-sm">
                    {r.items.map(([k, v]) => (
                      <div key={k} className="grid grid-cols-[8rem_1fr] gap-3">
                        <dt className="text-muted">{k}</dt>
                        <dd className="break-words text-ink">{v}</dd>
                      </div>
                    ))}
                  </dl>
                </Card>
              ))}
              {files.length > 0 ? (
                <Card className="p-6 lg:col-span-2">
                  <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted">Lampiran</h2>
                  <div className="mt-3 flex flex-wrap gap-3">
                    {files.map((f) => (
                      <a
                        key={f.id}
                        href={`/api/files/${f.id}`}
                        target="_blank"
                        rel="noopener"
                        className="group block"
                        aria-label={`Buka ${f.name ?? "lampiran"}`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={`/api/files/${f.id}`}
                          alt={f.name ?? "Lampiran"}
                          className="size-24 rounded-xl border border-line object-cover transition-transform group-hover:scale-[1.03]"
                        />
                        <span className="mt-1 block max-w-24 truncate text-xs text-muted">
                          {f.kind === "project-logo" ? "Logo" : "Referensi"}
                        </span>
                      </a>
                    ))}
                  </div>
                </Card>
              ) : null}
            </div>
          ) : null}

          {tab === "mockup" ? (
            versions.length > 0 ? (
              <MockupViewer projectId={id} versions={versions} canRevise={status === "mockup_ready"} />
            ) : (
              <Card className="border-dashed bg-transparent p-10 text-center shadow-none">
                <span className="mx-auto inline-flex size-12 items-center justify-center rounded-xl bg-sand">
                  <Icon name="monitor" className="size-6" />
                </span>
                <h2 className="mt-5 font-serif text-3xl tracking-tight">Mockup belum tersedia.</h2>
                <p className="mx-auto mt-2 max-w-md text-muted">
                  Tim kami sedang menyiapkannya. Saat siap, mockup muncul di sini dan Anda mendapat email.
                </p>
              </Card>
            )
          ) : null}

          {tab === "penawaran" ? (
            quote ? (
              <QuoteView
                projectId={id}
                canApprove={status === "mockup_ready" && quote.status === "sent"}
                quote={{
                  id: quote.id,
                  version: quote.version,
                  status: quote.status,
                  items: parseItems(quote.items),
                  discount: quote.discount,
                  dpPercent: quote.dpPercent,
                  timeline: quote.timeline,
                  validUntil: dateOnly(quote.validUntil),
                  expired: isExpired(quote.validUntil),
                  scope: quote.scope,
                  revisions: quote.revisions,
                  domainHosting: quote.domainHosting,
                  terms: quote.terms,
                  sentAt: dateOnly(quote.sentAt),
                  approvedAt: dateOnly(quote.approvedAt),
                }}
              />
            ) : (
              <Card className="border-dashed bg-transparent p-10 text-center shadow-none">
                <span className="mx-auto inline-flex size-12 items-center justify-center rounded-xl bg-sand">
                  <Icon name="file-text" className="size-6" />
                </span>
                <h2 className="mt-5 font-serif text-3xl tracking-tight">Penawaran belum tersedia.</h2>
                <p className="mx-auto mt-2 max-w-md text-muted">
                  Penawaran (cakupan, biaya, estimasi waktu) dikirim bersama mockup.
                </p>
              </Card>
            )
          ) : null}

          {tab === "riwayat" ? (
            <ol className="relative max-w-2xl space-y-6 border-l border-line pl-6">
              {events.map((e) => (
                <li key={e.id} className="relative">
                  <span className="absolute -left-[1.95rem] top-1.5 size-3 rounded-full border-2 border-canvas bg-ink" />
                  <p className="text-xs text-muted">
                    {formatDateId(e.createdAt)} · {time(e.createdAt)} WIB
                  </p>
                  <p className="mt-0.5 flex flex-wrap items-center gap-2 font-medium">
                    {e.fromStatus && isStatus(e.fromStatus) ? (
                      <>
                        <Badge>{STATUS_LABEL[e.fromStatus]}</Badge>
                        <Icon name="arrow-right" className="size-3.5 text-muted" />
                      </>
                    ) : null}
                    {isStatus(e.toStatus) ? <Badge tone="dark">{STATUS_LABEL[e.toStatus]}</Badge> : e.toStatus}
                  </p>
                  {e.note ? <p className="mt-1 text-sm text-muted">{e.note}</p> : null}
                </li>
              ))}
            </ol>
          ) : null}
        </div>

        <div className="mt-12 flex flex-wrap items-center gap-3 border-t border-line pt-6 text-sm text-muted">
          Ada yang ingin ditanyakan tentang proyek ini?
          <ButtonLink href={`/kontak?topik=pembuatan-website&pesan=${encodeURIComponent(`Tentang proyek ${project.title} (${project.id})`)}`} variant="secondary" size="sm" shape="pill">
            Hubungi tim
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  MockupPanel,
  NotePanel,
  QuoteEditor,
  SectionCard,
  StatusPanel,
  type QuoteFormState,
} from "@/components/admin/project-panels";
import { Icon } from "@/components/icon";
import { StatusBadge } from "@/components/projects/status";
import { Badge } from "@/components/ui/badge";
import { getAdminProject, getMockups, getQuotes } from "@/lib/admin-projects";
import { requireAdmin } from "@/lib/auth";
import { getProjectEvents, getProjectFiles, statusOf } from "@/lib/projects";
import { STATUS_LABEL, isStatus } from "@/lib/project-status";
import { DEFAULT_ITEMS, DEFAULT_TERMS, defaultValidUntil, parseItems } from "@/lib/quote";
import { parseSurvey, summaryRows } from "@/lib/survey";
import { formatDateId } from "@/lib/utils";

export const metadata: Metadata = { title: "Detail proyek" };
export const dynamic = "force-dynamic";

const time = (d: Date) =>
  new Intl.DateTimeFormat("id-ID", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Jakarta" }).format(d);
const ymd = (d: Date) => d.toISOString().slice(0, 10);

export default async function AdminProjectPage({ params }: PageProps<"/admin/proyek/[id]">) {
  const { id } = await params;
  await requireAdmin(`/admin/proyek/${id}`);
  const row = await getAdminProject(id);
  if (!row) notFound();
  const { project, user } = row;
  const status = statusOf(project);

  const [files, events, mocks, quoteRows] = await Promise.all([
    getProjectFiles(id),
    getProjectEvents(id),
    getMockups(id),
    getQuotes(id),
  ]);
  const survey = parseSurvey(project.survey);
  const sections = summaryRows(survey, files.some((f) => f.id === survey.brand.logo));
  const surveyFiles = files.filter((f) => f.kind.startsWith("project-"));

  const draft = quoteRows.find((q) => q.status === "draft");
  const basis = draft ?? quoteRows[0];
  const initial: QuoteFormState = {
    items: basis ? parseItems(basis.items) : DEFAULT_ITEMS,
    discount: basis?.discount ?? 0,
    dpPercent: basis?.dpPercent ?? 50,
    timeline: basis?.timeline || "14 hari kerja setelah DP diterima",
    validUntil: draft?.validUntil ? ymd(draft.validUntil) : defaultValidUntil(14),
    scope: basis?.scope ?? `Halaman: ${survey.pages.join(", ")}. Desain responsif (desktop dan mobile).`,
    revisions: basis?.revisions ?? 2,
    domainHosting:
      basis?.domainHosting ??
      (survey.domain.needHelp === "yes" ? "Dibantu pengadaan domain dan hosting (biaya terpisah)." : "Tidak termasuk."),
    terms: basis?.terms ?? DEFAULT_TERMS,
  };
  const pendingMockups = mocks.filter((m) => !m.publishedAt).length;
  const canUpload = status === "in_review" || status === "mockup_in_progress" || status === "revision_requested";
  const canPublish = status === "mockup_in_progress" || status === "revision_requested";

  return (
    <div className="max-w-6xl">
      <Link href="/admin/proyek" className="text-sm text-muted hover:text-ink">
        &larr; Semua proyek
      </Link>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <h1 className="font-serif text-4xl tracking-tight">{project.title || "Tanpa judul"}</h1>
        <StatusBadge status={status} />
      </div>
      <p className="mt-1 text-sm text-muted">
        ID {project.id} · dikirim {project.submittedAt ? formatDateId(project.submittedAt) : "-"}
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_22rem]">
        <div className="min-w-0 space-y-6">
          <SectionCard title="Survei">
            <div className="grid gap-5 sm:grid-cols-2">
              {sections.map((r) => (
                <div key={r.step}>
                  <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{r.title}</h3>
                  <dl className="mt-1.5 space-y-1 text-sm">
                    {r.items.map(([k, v]) => (
                      <div key={k} className="grid grid-cols-[7rem_1fr] gap-2">
                        <dt className="text-muted">{k}</dt>
                        <dd className="break-words">{v}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}
            </div>
            {surveyFiles.length > 0 ? (
              <div className="mt-5 border-t border-line pt-4">
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted">Lampiran pengguna</h3>
                <div className="flex flex-wrap gap-3">
                  {surveyFiles.map((f) => (
                    <a key={f.id} href={`/api/files/${f.id}`} target="_blank" rel="noopener" className="block">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={`/api/files/${f.id}`} alt={f.name ?? "Lampiran"} className="size-20 rounded-lg border border-line object-cover" />
                      <span className="mt-1 block max-w-20 truncate text-xs text-muted">{f.kind === "project-logo" ? "Logo" : "Referensi"}</span>
                    </a>
                  ))}
                </div>
              </div>
            ) : null}
          </SectionCard>

          <SectionCard title="Mockup" id="mockup">
            <MockupPanel
              id={id}
              canUpload={canUpload}
              items={mocks.map((m) => ({
                id: m.id,
                version: m.version,
                title: m.title,
                device: m.device,
                kind: m.kind,
                fileId: m.fileId,
                url: m.url,
                published: !!m.publishedAt,
              }))}
            />
          </SectionCard>

          <SectionCard title="Penawaran" id="penawaran">
            <QuoteEditor
              // Remount only when a new offer version has been SENT (new basis). Saving a draft must not
              // remount, or the result message would vanish.
              key={quoteRows.filter((q) => q.status !== "draft").length}
              id={id}
              initial={initial}
              draftQuoteId={draft?.id ?? null}
              canPublish={canPublish}
              pending={pendingMockups}
              history={quoteRows.map((q) => ({ id: q.id, version: q.version, status: q.status, total: q.total }))}
            />
          </SectionCard>
        </div>

        <aside className="space-y-6">
          <SectionCard title="Pelanggan">
            <dl className="space-y-2 text-sm">
              <div><dt className="text-xs text-muted">Nama</dt><dd className="font-medium">{user.name}</dd></div>
              <div><dt className="text-xs text-muted">Perusahaan</dt><dd>{user.company ?? "-"}</dd></div>
              <div><dt className="text-xs text-muted">Email</dt><dd><a className="text-accent hover:underline" href={`mailto:${user.email}`}>{user.email}</a></dd></div>
              <div><dt className="text-xs text-muted">Ponsel / WhatsApp</dt><dd>{user.phone ? <a className="text-accent hover:underline" href={`tel:${user.phone}`}>{user.phone}</a> : "-"}</dd></div>
            </dl>
          </SectionCard>

          <SectionCard title="Status">
            <StatusPanel id={id} status={status} />
          </SectionCard>

          <SectionCard title="Catatan">
            <NotePanel id={id} initial={project.adminNote ?? ""} />
          </SectionCard>

          <SectionCard title="Riwayat">
            <ol className="space-y-4 border-l border-line pl-4">
              {events.map((e) => (
                <li key={e.id} className="relative text-sm">
                  <span className="absolute -left-[1.38rem] top-1.5 size-2.5 rounded-full border-2 border-surface bg-ink" />
                  <p className="text-xs text-muted">
                    {formatDateId(e.createdAt)} · {time(e.createdAt)}
                  </p>
                  <p className="mt-0.5 flex flex-wrap items-center gap-1.5">
                    {e.fromStatus && isStatus(e.fromStatus) ? (
                      <>
                        <Badge>{STATUS_LABEL[e.fromStatus]}</Badge>
                        <Icon name="arrow-right" className="size-3 text-muted" />
                      </>
                    ) : null}
                    {isStatus(e.toStatus) ? <Badge tone="dark">{STATUS_LABEL[e.toStatus]}</Badge> : e.toStatus}
                  </p>
                  {e.note ? <p className="mt-1 text-muted">{e.note}</p> : null}
                </li>
              ))}
            </ol>
          </SectionCard>
        </aside>
      </div>
    </div>
  );
}

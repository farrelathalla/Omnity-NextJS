import type { Metadata } from "next";
import Link from "next/link";
import { StatusBadge } from "@/components/projects/status";
import { Input } from "@/components/ui/form";
import { listAdminProjects, statusCounts } from "@/lib/admin-projects";
import { requireAdmin } from "@/lib/auth";
import { STATUSES, STATUS_LABEL, isStatus } from "@/lib/project-status";
import { cn, formatDateId } from "@/lib/utils";

export const metadata: Metadata = { title: "Proyek" };
export const dynamic = "force-dynamic";

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export default async function AdminProjectsPage({ searchParams }: PageProps<"/admin/proyek">) {
  await requireAdmin("/admin/proyek");
  const sp = await searchParams;
  const status = first(sp.status);
  const q = first(sp.q)?.trim() || undefined;
  const [rows, counts] = await Promise.all([listAdminProjects({ status, q }), statusCounts()]);
  const activeStatus = status && isStatus(status) ? status : undefined;

  const href = (s?: string) => `/admin/proyek?${new URLSearchParams({ ...(s ? { status: s } : {}), ...(q ? { q } : {}) })}`;
  const total = STATUSES.filter((s) => s !== "draft").reduce((n, s) => n + (counts[s] ?? 0), 0);

  return (
    <div className="max-w-6xl">
      <h1 className="font-serif text-4xl tracking-tight">Proyek</h1>
      <p className="mt-1 text-muted">Permintaan Design Anything dari pengguna. Draf survei tidak ditampilkan.</p>

      <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Filter status">
        <Link href={href()} className={cn("rounded-full border px-4 py-1.5 text-sm font-medium", !activeStatus ? "border-ink bg-ink text-white" : "border-line bg-surface hover:border-ink/30")}>
          Semua <span className="opacity-70">{total}</span>
        </Link>
        {STATUSES.filter((s) => s !== "draft").map((s) => (
          <Link key={s} href={href(s)} aria-current={activeStatus === s ? "true" : undefined} className={cn("rounded-full border px-4 py-1.5 text-sm font-medium", activeStatus === s ? "border-ink bg-ink text-white" : "border-line bg-surface hover:border-ink/30")}>
            {STATUS_LABEL[s]} <span className="opacity-70">{counts[s] ?? 0}</span>
          </Link>
        ))}
      </div>

      <form method="get" className="mt-4 flex max-w-lg gap-2" role="search">
        {activeStatus ? <input type="hidden" name="status" value={activeStatus} /> : null}
        <Input name="q" defaultValue={q} placeholder="Cari proyek, nama, email, atau perusahaan..." aria-label="Cari proyek" />
        <button className="h-11 rounded-[11px] border border-line bg-surface px-4 text-sm font-medium hover:border-ink/30">Cari</button>
      </form>

      <div className="mt-6 overflow-x-auto rounded-card border border-line bg-surface">
        <table className="w-full min-w-[44rem] text-left text-sm">
          <thead className="border-b border-line bg-sand/60 text-xs uppercase tracking-wider text-muted">
            <tr>
              <th className="px-4 py-3 font-semibold">Proyek</th>
              <th className="px-4 py-3 font-semibold">Pengguna</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Dikirim</th>
              <th className="px-4 py-3 font-semibold">Diperbarui</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-muted">
                  Belum ada proyek yang cocok.
                </td>
              </tr>
            ) : (
              rows.map((p) => (
                <tr key={p.id} className="hover:bg-sand/40">
                  <td className="px-4 py-3">
                    <Link href={`/admin/proyek/${p.id}`} className="font-medium text-ink hover:underline">
                      {p.title || "Tanpa judul"}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <span className="block">{p.userName}</span>
                    <span className="text-xs text-muted">{p.userCompany ?? p.userEmail}</span>
                  </td>
                  <td className="px-4 py-3">{isStatus(p.status) ? <StatusBadge status={p.status} /> : p.status}</td>
                  <td className="px-4 py-3 text-muted">{p.submittedAt ? formatDateId(p.submittedAt) : "-"}</td>
                  <td className="px-4 py-3 text-muted">{formatDateId(p.updatedAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

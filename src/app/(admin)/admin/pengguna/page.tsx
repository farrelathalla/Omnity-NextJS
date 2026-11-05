import type { Metadata } from "next";
import { desc, like, or, sql } from "drizzle-orm";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Input } from "@/components/ui/form";
import { db } from "@/db";
import { projects, users } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { formatDateId } from "@/lib/utils";

export const metadata: Metadata = { title: "Pengguna" };
export const dynamic = "force-dynamic";

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
const escapeLike = (s: string) => s.replace(/[\\%_]/g, (c) => `\\${c}`);

export default async function AdminUsersPage({ searchParams }: PageProps<"/admin/pengguna">) {
  await requireAdmin("/admin/pengguna");
  const q = first((await searchParams).q)?.trim() || undefined;
  const pat = q ? `%${escapeLike(q)}%` : null;

  const rows = await db()
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      company: users.company,
      phone: users.phone,
      role: users.role,
      verified: users.emailVerifiedAt,
      createdAt: users.createdAt,
      projectCount: sql<number>`(SELECT COUNT(*) FROM ${projects} WHERE ${projects.userId} = ${users.id} AND ${projects.status} <> 'draft')`,
    })
    .from(users)
    .where(pat ? or(like(users.name, pat), like(users.email, pat), like(users.company, pat)) : undefined)
    .orderBy(desc(users.createdAt))
    .limit(500);

  return (
    <div className="max-w-6xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl tracking-tight">Pengguna</h1>
          <p className="mt-1 text-muted">Data pribadi: gunakan untuk follow-up saja, jangan dibagikan.</p>
        </div>
        <ButtonLink href="/admin/pengguna/export" variant="secondary" prefetch={false}>
          Ekspor CSV
        </ButtonLink>
      </div>

      <form method="get" role="search" className="mt-6 flex max-w-md gap-2">
        <Input name="q" defaultValue={q} placeholder="Cari nama, email, perusahaan..." aria-label="Cari pengguna" />
        <button className="h-11 rounded-[11px] border border-line bg-surface px-4 text-sm font-medium hover:border-ink/30">Cari</button>
      </form>

      <div className="mt-6 overflow-x-auto rounded-card border border-line bg-surface">
        <table className="w-full min-w-[46rem] text-left text-sm">
          <thead className="border-b border-line bg-sand/60 text-xs uppercase tracking-wider text-muted">
            <tr>
              <th className="px-4 py-3 font-semibold">Nama</th>
              <th className="px-4 py-3 font-semibold">Kontak</th>
              <th className="px-4 py-3 font-semibold">Perusahaan</th>
              <th className="px-4 py-3 font-semibold">Proyek</th>
              <th className="px-4 py-3 font-semibold">Terdaftar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-10 text-center text-muted">Tidak ada pengguna.</td></tr>
            ) : (
              rows.map((u) => (
                <tr key={u.id} className="hover:bg-sand/40">
                  <td className="px-4 py-3">
                    <span className="font-medium">{u.name}</span>
                    <span className="ml-2 inline-flex gap-1">
                      {u.role === "admin" ? <Badge tone="dark">Admin</Badge> : null}
                      {u.verified ? null : <Badge>Belum verifikasi</Badge>}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <a className="text-accent hover:underline" href={`mailto:${u.email}`}>{u.email}</a>
                    <span className="block text-xs text-muted">{u.phone ?? "-"}</span>
                  </td>
                  <td className="px-4 py-3 text-muted">{u.company ?? "-"}</td>
                  <td className="px-4 py-3 tabular-nums">{Number(u.projectCount)}</td>
                  <td className="px-4 py-3 text-muted">{formatDateId(u.createdAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

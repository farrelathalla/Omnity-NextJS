import type { Metadata } from "next";
import Link from "next/link";
import { DeletePostButton } from "@/components/admin/delete-post-button";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Input } from "@/components/ui/form";
import { requireAdmin } from "@/lib/auth";
import { adminStatus, listAdminPosts } from "@/lib/posts";
import { formatDateId } from "@/lib/utils";

export const metadata: Metadata = { title: "Blog" };
export const dynamic = "force-dynamic";

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

const statusBadge = {
  draft: <Badge>Draf</Badge>,
  scheduled: <Badge tone="sky">Terjadwal</Badge>,
  published: <Badge tone="leaf">Terbit</Badge>,
} as const;

export default async function AdminBlogPage({ searchParams }: PageProps<"/admin/blog">) {
  await requireAdmin("/admin/blog");
  const sp = await searchParams;
  const q = first(sp.q)?.trim() || undefined;
  const rows = await listAdminPosts({ q });

  return (
    <div className="max-w-5xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl tracking-tight">Blog</h1>
          <p className="mt-1 text-muted">Tulis, jadwalkan, dan kelola artikel. Tanpa kategori.</p>
        </div>
        <ButtonLink href="/admin/blog/baru">Artikel baru</ButtonLink>
      </div>

      {first(sp.dihapus) ? (
        <p role="status" className="mt-6 rounded-xl bg-leaf-50 px-4 py-3 text-sm text-leaf">
          Artikel dihapus.
        </p>
      ) : null}

      <form method="get" className="mt-6 flex max-w-md gap-2">
        <Input name="q" defaultValue={q} placeholder="Cari judul..." aria-label="Cari artikel" />
        <button className="h-11 rounded-[11px] border border-line bg-surface px-4 text-sm font-medium hover:border-ink/30">
          Cari
        </button>
      </form>

      <div className="mt-6 overflow-x-auto rounded-card border border-line bg-surface">
        <table className="w-full min-w-[40rem] text-left text-sm">
          <thead className="border-b border-line bg-sand/60 text-xs uppercase tracking-wider text-muted">
            <tr>
              <th className="px-4 py-3 font-semibold">Judul</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Tanggal</th>
              <th className="px-4 py-3 text-right font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-muted">
                  {q ? "Tidak ada artikel yang cocok." : "Belum ada artikel. Mulai dengan menulis yang pertama."}
                </td>
              </tr>
            ) : (
              rows.map((p) => {
                const s = adminStatus(p);
                return (
                  <tr key={p.id} className="hover:bg-sand/40">
                    <td className="max-w-md px-4 py-3">
                      <Link href={`/admin/blog/${p.id}`} className="font-medium text-ink hover:underline">
                        {p.title}
                      </Link>
                      <p className="truncate text-xs text-muted">/blog/{p.slug}</p>
                    </td>
                    <td className="px-4 py-3">{statusBadge[s]}</td>
                    <td className="px-4 py-3 text-muted">
                      {formatDateId(s === "draft" ? p.updatedAt : (p.publishedAt ?? p.updatedAt))}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-4">
                        <Link href={`/admin/blog/${p.id}`} className="font-medium text-accent hover:underline">
                          Edit
                        </Link>
                        {s === "published" ? (
                          <Link href={`/blog/${p.slug}`} target="_blank" className="text-muted hover:text-ink">
                            Lihat
                          </Link>
                        ) : (
                          <Link href={`/admin/blog/${p.id}/preview`} target="_blank" className="text-muted hover:text-ink">
                            Pratinjau
                          </Link>
                        )}
                        <DeletePostButton id={p.id} title={p.title} />
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

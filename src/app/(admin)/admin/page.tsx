import Link from "next/link";
import { and, eq, gt, sql } from "drizzle-orm";
import { Icon } from "@/components/icon";
import { Card } from "@/components/ui/card";
import { db } from "@/db";
import { inquiries, posts, users } from "@/db/schema";
import { statusCounts } from "@/lib/admin-projects";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  const admin = await requireAdmin();
  const d = db();
  const counts = await statusCounts();
  const [[published], [drafts], [people], [leads]] = await Promise.all([
    d.select({ n: sql<number>`COUNT(*)` }).from(posts).where(eq(posts.status, "published")),
    d.select({ n: sql<number>`COUNT(*)` }).from(posts).where(eq(posts.status, "draft")),
    d.select({ n: sql<number>`COUNT(*)` }).from(users),
    d
      .select({ n: sql<number>`COUNT(*)` })
      .from(inquiries)
      .where(and(gt(inquiries.createdAt, sql`NOW() - INTERVAL 30 DAY`))),
  ]);

  const stats = [
    { label: "Permintaan baru", value: counts.requested ?? 0, href: "/admin/proyek?status=requested" },
    { label: "Mockup sedang dibuat", value: (counts.mockup_in_progress ?? 0) + (counts.revision_requested ?? 0), href: "/admin/proyek" },
    { label: "Artikel terbit", value: Number(published?.n ?? 0), href: "/admin/blog" },
    { label: "Draf", value: Number(drafts?.n ?? 0), href: "/admin/blog" },
    { label: "Pengguna", value: Number(people?.n ?? 0), href: "/admin/pengguna" },
    { label: "Konsultasi 30 hari", value: Number(leads?.n ?? 0), href: "/admin/konsultasi" },
  ];

  return (
    <div className="max-w-5xl">
      <h1 className="font-serif text-4xl tracking-tight">Halo, {admin.name.split(" ")[0]}.</h1>
      <p className="mt-2 text-muted">Ringkasan situs Omnity.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => (
          <Link key={s.label} href={s.href}>
            <Card interactive className="p-5">
              <p className="font-serif text-4xl tracking-tight">{s.value}</p>
              <p className="mt-1 text-sm text-muted">{s.label}</p>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link href="/admin/blog/baru">
          <Card interactive className="flex items-center justify-between p-6">
            <span>
              <span className="block font-semibold">Tulis artikel baru</span>
              <span className="text-sm text-muted">Editor dengan foto, judul, dan kutipan.</span>
            </span>
            <Icon name="arrow-right" className="size-5 text-accent" />
          </Card>
        </Link>
      </div>
    </div>
  );
}

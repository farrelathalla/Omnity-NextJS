import { desc, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { projects, users } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { toCsv } from "@/lib/csv";

/** CSV of all users (for follow-up). Admin only; contains personal data, so never cached. */
export async function GET() {
  const me = await getCurrentUser();
  if (!me || me.role !== "admin") return new NextResponse("Not found", { status: 404 });

  const rows = await db()
    .select({
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
    .orderBy(desc(users.createdAt));

  const csv = toCsv(
    ["Nama", "Email", "Perusahaan", "Ponsel", "Peran", "Email terverifikasi", "Terdaftar", "Jumlah proyek"],
    rows.map((r) => [r.name, r.email, r.company, r.phone, r.role, r.verified ? "ya" : "belum", r.createdAt, Number(r.projectCount)]),
  );
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="pengguna-omnity-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "private, no-store",
    },
  });
}

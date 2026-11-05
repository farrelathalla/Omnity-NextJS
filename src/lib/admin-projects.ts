import "server-only";
import { and, desc, eq, inArray, like, or, sql, type SQL } from "drizzle-orm";
import { db } from "@/db";
import { mockups, projects, quotes, users } from "@/db/schema";
import { isStatus, STATUSES, type ProjectStatus } from "@/lib/project-status";

const escapeLike = (s: string) => s.replace(/[\\%_]/g, (c) => `\\${c}`);

/** Admin inbox. Drafts are never listed: they are the customer's private work in progress. */
export async function listAdminProjects(opts: { status?: string; q?: string }) {
  const conds: SQL[] = [];
  if (opts.status && isStatus(opts.status)) conds.push(eq(projects.status, opts.status));
  else conds.push(inArray(projects.status, STATUSES.filter((s) => s !== "draft") as unknown as string[]));
  if (opts.q) {
    const like_ = `%${escapeLike(opts.q)}%`;
    conds.push(or(like(projects.title, like_), like(users.name, like_), like(users.email, like_), like(users.company, like_))!);
  }
  return db()
    .select({
      id: projects.id,
      title: projects.title,
      status: projects.status,
      submittedAt: projects.submittedAt,
      updatedAt: projects.updatedAt,
      userName: users.name,
      userEmail: users.email,
      userCompany: users.company,
    })
    .from(projects)
    .innerJoin(users, eq(users.id, projects.userId))
    .where(and(...conds))
    .orderBy(desc(projects.submittedAt), desc(projects.updatedAt))
    .limit(300);
}

export async function statusCounts() {
  const rows = await db()
    .select({ status: projects.status, n: sql<number>`COUNT(*)` })
    .from(projects)
    .groupBy(projects.status);
  const out: Partial<Record<ProjectStatus, number>> = {};
  for (const r of rows) if (isStatus(r.status)) out[r.status] = Number(r.n);
  return out;
}

export async function getAdminProject(id: string) {
  if (!/^[a-f0-9]{16}$/.test(id)) return null;
  const [row] = await db()
    .select({ project: projects, user: users })
    .from(projects)
    .innerJoin(users, eq(users.id, projects.userId))
    .where(eq(projects.id, id))
    .limit(1);
  return row ?? null;
}

export async function getMockups(projectId: string) {
  return db().select().from(mockups).where(eq(mockups.projectId, projectId)).orderBy(mockups.version, mockups.id);
}

export async function getQuotes(projectId: string) {
  return db().select().from(quotes).where(eq(quotes.projectId, projectId)).orderBy(desc(quotes.version));
}

/** Highest version number used for a project's mockups (0 if none). */
export async function latestMockupVersion(projectId: string) {
  const [row] = await db()
    .select({ v: sql<number>`COALESCE(MAX(${mockups.version}), 0)` })
    .from(mockups)
    .where(eq(mockups.projectId, projectId));
  return Number(row?.v ?? 0);
}

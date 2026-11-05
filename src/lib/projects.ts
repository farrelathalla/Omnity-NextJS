import "server-only";
import { randomBytes } from "node:crypto";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { projectEvents, projects, uploads, type Project } from "@/db/schema";
import { isStatus, type ProjectStatus } from "@/lib/project-status";

export const newProjectId = () => randomBytes(8).toString("hex");

/**
 * A project the given user owns, or null. EVERY user-facing read goes through
 * here (or listUserProjects) so ownership is enforced in one place; this is the
 * application-level replacement for the row-level security the brief mentions.
 */
export async function getOwnedProject(id: string, userId: number): Promise<Project | null> {
  if (!/^[a-f0-9]{16}$/.test(id)) return null;
  const [row] = await db()
    .select()
    .from(projects)
    .where(and(eq(projects.id, id), eq(projects.userId, userId)))
    .limit(1);
  return row ?? null;
}

export async function listUserProjects(userId: number) {
  return db().select().from(projects).where(eq(projects.userId, userId)).orderBy(desc(projects.updatedAt));
}

export async function getProjectFiles(projectId: string) {
  return db()
    .select({
      id: uploads.id,
      kind: uploads.kind,
      name: uploads.originalName,
      size: uploads.size,
    })
    .from(uploads)
    .where(eq(uploads.projectId, projectId))
    .orderBy(uploads.createdAt);
}

export async function getProjectEvents(projectId: string) {
  return db()
    .select()
    .from(projectEvents)
    .where(eq(projectEvents.projectId, projectId))
    .orderBy(desc(projectEvents.createdAt), desc(projectEvents.id));
}

export async function addEvent(opts: {
  projectId: string;
  from: ProjectStatus | null;
  to: ProjectStatus;
  note?: string | null;
  byUserId?: number | null;
}) {
  await db().insert(projectEvents).values({
    projectId: opts.projectId,
    fromStatus: opts.from,
    toStatus: opts.to,
    note: opts.note ?? null,
    byUserId: opts.byUserId ?? null,
  });
}

export const statusOf = (p: Pick<Project, "status">): ProjectStatus => (isStatus(p.status) ? p.status : "draft");

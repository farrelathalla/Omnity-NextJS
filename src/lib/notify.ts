import "server-only";
import { and, eq, isNull, sql } from "drizzle-orm";
import { db } from "@/db";
import { notifications } from "@/db/schema";
import { emailLayout, sendMail } from "@/lib/mail";
import { siteUrl } from "@/lib/site";

/** Stores an in-app notification (the navbar badge) and sends the same message by email. */
export async function notifyUser(opts: {
  userId: number;
  email: string;
  title: string;
  /** one or two sentences, shown in the app and in the email */
  body: string;
  /** site-relative path the notification and the email button open */
  href: string;
  cta?: string;
  rows?: [string, string][];
}) {
  await db().insert(notifications).values({
    userId: opts.userId,
    title: opts.title.slice(0, 160),
    body: opts.body.slice(0, 400),
    href: opts.href.slice(0, 200),
  });
  const m = emailLayout({
    title: opts.title,
    intro: opts.body,
    rows: opts.rows,
    cta: { label: opts.cta ?? "Buka proyek", href: `${siteUrl}${opts.href}` },
  });
  return sendMail({ to: opts.email, subject: `${opts.title} | Omnity`, ...m });
}

export async function unreadCount(userId: number) {
  const [row] = await db()
    .select({ n: sql<number>`COUNT(*)` })
    .from(notifications)
    .where(and(eq(notifications.userId, userId), isNull(notifications.readAt)));
  return Number(row?.n ?? 0);
}

/** Opening a project marks its notifications as read. */
export async function markProjectNotificationsRead(userId: number, projectId: string) {
  await db()
    .update(notifications)
    .set({ readAt: sql`NOW()` })
    .where(
      and(
        eq(notifications.userId, userId),
        isNull(notifications.readAt),
        sql`${notifications.href} LIKE ${`/proyek/${projectId}%`}`,
      ),
    );
}

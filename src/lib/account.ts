import "server-only";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { sendWelcomeEmail } from "@/lib/account-mail";

/**
 * Marks the account's email as verified (first time only) and sends the welcome mail.
 * Deliberately NOT in a "use server" file: those exports are public endpoints.
 */
export async function finishVerification(userId: number) {
  const [user] = await db().select().from(users).where(eq(users.id, userId)).limit(1);
  if (!user) return null;
  if (!user.emailVerifiedAt) {
    await db().update(users).set({ emailVerifiedAt: new Date() }).where(eq(users.id, userId));
    await sendWelcomeEmail(user);
  }
  return user;
}

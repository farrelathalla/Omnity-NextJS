import "server-only";
import { drizzle } from "drizzle-orm/mysql2";
import { migrate } from "drizzle-orm/mysql2/migrator";
import bcrypt from "bcryptjs";
import mysql from "mysql2/promise";
import path from "node:path";

/**
 * Boot-time housekeeping for hosts where a shell is awkward (Hostinger shared hosting).
 * Enabled only with AUTO_MIGRATE=1:
 *   1. applies pending SQL migrations (idempotent, tracked by drizzle),
 *   2. creates the FIRST admin from ADMIN_EMAIL / ADMIN_PASSWORD when no admin exists yet.
 * It never resets an existing admin's password; use `npm run db:seed` for that.
 * Failures are logged and swallowed so a database hiccup cannot stop the site from booting.
 */
export async function runStartupTasks() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.warn("[startup] AUTO_MIGRATE is on but DATABASE_URL is not set; skipping");
    return;
  }
  const conn = await mysql.createConnection({ uri: url, charset: "utf8mb4" });
  try {
    await migrate(drizzle(conn), { migrationsFolder: path.resolve(process.cwd(), "drizzle") });
    console.info("[startup] migrations are up to date");

    const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const password = process.env.ADMIN_PASSWORD;
    if (!email || !password) return;
    if (password.length < 10) {
      console.warn("[startup] ADMIN_PASSWORD is shorter than 10 characters; admin not created");
      return;
    }
    const [admins] = await conn.query<mysql.RowDataPacket[]>("SELECT id FROM users WHERE role = 'admin' LIMIT 1");
    if (admins.length > 0) return;
    const hash = await bcrypt.hash(password, 12);
    await conn.query(
      `INSERT INTO users (email, name, password_hash, role, email_verified_at)
       VALUES (?, ?, ?, 'admin', NOW())
       ON DUPLICATE KEY UPDATE role = 'admin', password_hash = VALUES(password_hash), email_verified_at = COALESCE(email_verified_at, NOW())`,
      [email, process.env.ADMIN_NAME ?? "Admin Omnity", hash],
    );
    console.info(`[startup] first admin created: ${email}`);
  } catch (err) {
    console.error("[startup] failed:", err instanceof Error ? err.message : err);
  } finally {
    await conn.end().catch(() => {});
  }
}

/**
 * Creates or updates the first admin from ADMIN_EMAIL / ADMIN_PASSWORD / ADMIN_NAME.
 *   npm run db:seed
 * Safe to re-run: it resets that admin's password and bumps token_version
 * (which signs out every existing session of that account).
 */
import bcrypt from "bcryptjs";
import mysql from "mysql2/promise";

const { DATABASE_URL, ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME = "Admin Omnity" } = process.env;
if (!DATABASE_URL || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error("Set DATABASE_URL, ADMIN_EMAIL and ADMIN_PASSWORD first.");
  process.exit(1);
}
if (ADMIN_PASSWORD.length < 10) {
  console.error("ADMIN_PASSWORD must be at least 10 characters.");
  process.exit(1);
}

const conn = await mysql.createConnection({ uri: DATABASE_URL, charset: "utf8mb4" });
try {
  const hash = await bcrypt.hash(ADMIN_PASSWORD, 12);
  const email = ADMIN_EMAIL.trim().toLowerCase();
  await conn.query(
    `INSERT INTO users (email, name, password_hash, role, email_verified_at)
     VALUES (?, ?, ?, 'admin', NOW())
     ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash), role = 'admin',
       email_verified_at = COALESCE(email_verified_at, NOW()), token_version = token_version + 1`,
    [email, ADMIN_NAME, hash],
  );
  console.log(`admin ready: ${email}`);
} finally {
  await conn.end();
}

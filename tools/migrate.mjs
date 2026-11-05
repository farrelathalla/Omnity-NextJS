/**
 * Applies SQL migrations from ./drizzle. Needs only runtime deps (drizzle-orm,
 * mysql2), so it also runs on the server:  npm run db:migrate
 */
import { drizzle } from "drizzle-orm/mysql2";
import { migrate } from "drizzle-orm/mysql2/migrator";
import mysql from "mysql2/promise";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}

const conn = await mysql.createConnection({ uri: url, charset: "utf8mb4" });
try {
  await migrate(drizzle(conn), { migrationsFolder: "drizzle" });
  console.log("migrations applied");
} finally {
  await conn.end();
}

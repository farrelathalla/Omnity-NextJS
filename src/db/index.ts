import { drizzle, type MySql2Database } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";

type Db = MySql2Database<typeof schema>;

// One pool per process. Cached on globalThis so dev hot reloads do not leak pools.
const g = globalThis as unknown as { __omnityDb?: Db; __omnityPool?: mysql.Pool };

export function db(): Db {
  if (g.__omnityDb) return g.__omnityDb;
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Copy .env.example to .env.local, or set it in hPanel.",
    );
  }
  g.__omnityPool = mysql.createPool({
    uri: url,
    connectionLimit: 8,
    waitForConnections: true,
    // Store and read DATETIME/TIMESTAMP as UTC regardless of the server zone.
    timezone: "Z",
    charset: "utf8mb4",
  });
  g.__omnityDb = drizzle(g.__omnityPool, { schema, mode: "default" });
  return g.__omnityDb;
}

export { schema };

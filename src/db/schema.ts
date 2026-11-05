import {
  bigint,
  index,
  int,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

/** Consultation requests from /kontak and the service pages. */
export const inquiries = mysqlTable(
  "inquiries",
  {
    id: int("id").autoincrement().primaryKey(),
    name: varchar("name", { length: 120 }).notNull(),
    email: varchar("email", { length: 190 }).notNull(),
    company: varchar("company", { length: 160 }),
    phone: varchar("phone", { length: 32 }),
    topic: varchar("topic", { length: 80 }).notNull().default("umum"),
    message: text("message").notNull(),
    /** path the form was submitted from, e.g. /layanan/audit-it-keamanan */
    source: varchar("source", { length: 160 }),
    ip: varchar("ip", { length: 64 }),
    status: varchar("status", { length: 20 }).notNull().default("new"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [index("inquiries_created_idx").on(t.createdAt)],
);

/** Fixed-window rate limiter (see src/lib/rate-limit.ts). */
export const rateLimits = mysqlTable("rate_limits", {
  key: varchar("key", { length: 190 }).primaryKey(),
  count: int("count").notNull().default(0),
  /** unix ms when the current window started */
  windowStart: bigint("window_start", { mode: "number" }).notNull(),
});

export type Inquiry = typeof inquiries.$inferSelect;
export type NewInquiry = typeof inquiries.$inferInsert;

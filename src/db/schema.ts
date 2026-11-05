import {
  bigint,
  index,
  int,
  longtext,
  mysqlTable,
  text,
  timestamp,
  uniqueIndex,
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

/** Accounts. Admins write the blog and manage projects; users own their projects. */
export const users = mysqlTable(
  "users",
  {
    id: int("id").autoincrement().primaryKey(),
    email: varchar("email", { length: 190 }).notNull(),
    name: varchar("name", { length: 120 }).notNull(),
    /** null for accounts created through Google sign-in */
    passwordHash: varchar("password_hash", { length: 100 }),
    role: varchar("role", { length: 12 }).notNull().default("user"), // "user" | "admin"
    company: varchar("company", { length: 160 }),
    phone: varchar("phone", { length: 32 }),
    googleId: varchar("google_id", { length: 64 }),
    emailVerifiedAt: timestamp("email_verified_at"),
    /** bump to invalidate every existing session of this user */
    tokenVersion: int("token_version").notNull().default(0),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  },
  (t) => [uniqueIndex("users_email_uq").on(t.email), index("users_google_idx").on(t.googleId)],
);

/** Blog posts. No categories (client request). Scheduled = published with a future publishedAt. */
export const posts = mysqlTable(
  "posts",
  {
    id: int("id").autoincrement().primaryKey(),
    title: varchar("title", { length: 200 }).notNull(),
    slug: varchar("slug", { length: 200 }).notNull(),
    excerpt: varchar("excerpt", { length: 400 }).notNull().default(""),
    /** sanitized HTML from the editor */
    content: longtext("content").notNull(),
    coverPath: varchar("cover_path", { length: 255 }),
    status: varchar("status", { length: 12 }).notNull().default("draft"), // "draft" | "published"
    publishedAt: timestamp("published_at"),
    readingMinutes: int("reading_minutes").notNull().default(1),
    authorId: int("author_id").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  },
  (t) => [
    uniqueIndex("posts_slug_uq").on(t.slug),
    index("posts_published_idx").on(t.status, t.publishedAt),
  ],
);

/** Files saved under UPLOAD_DIR (blog images now; logos and mockups later). */
export const uploads = mysqlTable(
  "uploads",
  {
    id: varchar("id", { length: 32 }).primaryKey(),
    kind: varchar("kind", { length: 24 }).notNull(), // post-cover | post-inline | ...
    /** path relative to UPLOAD_DIR, served at /uploads/<path> */
    path: varchar("path", { length: 255 }).notNull(),
    mime: varchar("mime", { length: 60 }).notNull(),
    size: int("size").notNull(),
    ownerId: int("owner_id"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [uniqueIndex("uploads_path_uq").on(t.path)],
);

export type User = typeof users.$inferSelect;
export type Post = typeof posts.$inferSelect;
export type Inquiry = typeof inquiries.$inferSelect;
export type NewInquiry = typeof inquiries.$inferInsert;

import {
  bigint,
  datetime,
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

/**
 * NOTE on dates: nullable moments use DATETIME, not TIMESTAMP. On MariaDB with
 * explicit_defaults_for_timestamp=OFF (the default up to 10.x) a TIMESTAMP that is not
 * declared NULL silently becomes NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP.
 * All values are UTC (the connection pins time_zone to +00:00).
 */

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
    emailVerifiedAt: datetime("email_verified_at", { mode: "date" }),
    /** bump to invalidate every existing session of this user */
    tokenVersion: int("token_version").notNull().default(0),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  },
  (t) => [uniqueIndex("users_email_uq").on(t.email), index("users_google_idx").on(t.googleId)],
);

/** One-time links sent by email: address verification and password reset. Only a SHA-256 hash is stored. */
export const emailTokens = mysqlTable(
  "email_tokens",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("user_id").notNull(),
    type: varchar("type", { length: 12 }).notNull(), // "verify" | "reset"
    tokenHash: varchar("token_hash", { length: 64 }).notNull(),
    expiresAt: datetime("expires_at", { mode: "date" }).notNull(),
    usedAt: datetime("used_at", { mode: "date" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [uniqueIndex("email_tokens_hash_uq").on(t.tokenHash), index("email_tokens_user_idx").on(t.userId, t.type)],
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
    publishedAt: datetime("published_at", { mode: "date" }),
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
    /** "public" files are served from /uploads/*; "private" ones only to the owner and admins */
    visibility: varchar("visibility", { length: 8 }).notNull().default("public"),
    projectId: varchar("project_id", { length: 16 }),
    originalName: varchar("original_name", { length: 160 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [uniqueIndex("uploads_path_uq").on(t.path), index("uploads_project_idx").on(t.projectId)],
);

/** A Design Anything request: survey answers + where it is in the pipeline (see src/lib/project-status.ts). */
export const projects = mysqlTable(
  "projects",
  {
    /** random public id (never an auto-increment number, so URLs cannot be enumerated) */
    id: varchar("id", { length: 16 }).primaryKey(),
    userId: int("user_id").notNull(),
    type: varchar("type", { length: 16 }).notNull().default("website"),
    status: varchar("status", { length: 24 }).notNull().default("draft"),
    /** business name, copied out of the survey for lists */
    title: varchar("title", { length: 160 }).notNull().default(""),
    /** the sentence typed into the hero prompt box */
    prompt: text("prompt"),
    templateId: varchar("template_id", { length: 40 }),
    /** answers of the 8-step survey (JSON, validated by src/lib/survey.ts) */
    survey: longtext("survey").notNull(),
    surveyStep: int("survey_step").notNull().default(1),
    /** internal notes, admin only (phase 7) */
    adminNote: text("admin_note"),
    submittedAt: datetime("submitted_at", { mode: "date" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  },
  (t) => [index("projects_user_idx").on(t.userId, t.updatedAt), index("projects_status_idx").on(t.status)],
);

/** Append-only history of status changes and notes for a project. */
export const projectEvents = mysqlTable(
  "project_events",
  {
    id: int("id").autoincrement().primaryKey(),
    projectId: varchar("project_id", { length: 16 }).notNull(),
    fromStatus: varchar("from_status", { length: 24 }),
    toStatus: varchar("to_status", { length: 24 }).notNull(),
    note: text("note"),
    byUserId: int("by_user_id"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [index("project_events_project_idx").on(t.projectId, t.createdAt)],
);

export type Project = typeof projects.$inferSelect;
export type ProjectEvent = typeof projectEvents.$inferSelect;
export type User = typeof users.$inferSelect;
export type Post = typeof posts.$inferSelect;
export type Inquiry = typeof inquiries.$inferSelect;
export type NewInquiry = typeof inquiries.$inferInsert;

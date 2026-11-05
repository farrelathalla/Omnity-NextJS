/** Project pipeline (brief chapter 07). Pure module: safe to import from client components. */

export const STATUSES = [
  "draft",
  "requested",
  "in_review",
  "mockup_in_progress",
  "mockup_ready",
  "revision_requested",
  "awaiting_payment",
  "in_progress",
  "completed",
  "cancelled",
] as const;

export type ProjectStatus = (typeof STATUSES)[number];

export const STATUS_LABEL: Record<ProjectStatus, string> = {
  draft: "Draf survei",
  requested: "Permintaan masuk",
  in_review: "Ditinjau",
  mockup_in_progress: "Pembuatan mockup",
  mockup_ready: "Mockup & penawaran tersedia",
  revision_requested: "Revisi diminta",
  awaiting_payment: "Menunggu pembayaran",
  in_progress: "Dalam pengerjaan",
  completed: "Selesai",
  cancelled: "Dibatalkan",
};

/** Short text for the user: what happens next at this status. */
export const STATUS_HINT: Record<ProjectStatus, string> = {
  draft: "Lengkapi survei lalu kirim agar tim kami bisa mulai.",
  requested: "Permintaan Anda sudah masuk. Tim kami akan meninjaunya.",
  in_review: "Tim kami sedang meninjau survei Anda.",
  mockup_in_progress: "Mockup sedang dibuat. Estimasi 2 sampai 3 hari kerja.",
  mockup_ready: "Mockup dan penawaran sudah siap. Silakan tinjau.",
  revision_requested: "Catatan revisi Anda sudah kami terima dan sedang dikerjakan.",
  awaiting_payment: "Penawaran disetujui. Menunggu pembayaran untuk memulai pengerjaan.",
  in_progress: "Website Anda sedang dikerjakan.",
  completed: "Proyek selesai.",
  cancelled: "Proyek ini dibatalkan.",
};

export type StatusTone = "neutral" | "brand" | "sky" | "leaf" | "dark";

export const STATUS_TONE: Record<ProjectStatus, StatusTone> = {
  draft: "neutral",
  requested: "dark",
  in_review: "sky",
  mockup_in_progress: "sky",
  mockup_ready: "brand",
  revision_requested: "brand",
  awaiting_payment: "brand",
  in_progress: "sky",
  completed: "leaf",
  cancelled: "neutral",
};

/** The linear happy path, shown as a stepper. Revision / cancelled branch off it. */
export const PIPELINE: ProjectStatus[] = [
  "requested",
  "in_review",
  "mockup_in_progress",
  "mockup_ready",
  "awaiting_payment",
  "in_progress",
  "completed",
];

export const isStatus = (v: unknown): v is ProjectStatus =>
  typeof v === "string" && (STATUSES as readonly string[]).includes(v);

/** Index of a status in the happy path (revision counts as "mockup_ready"). */
export function pipelineIndex(s: ProjectStatus): number {
  if (s === "revision_requested") return PIPELINE.indexOf("mockup_ready");
  return PIPELINE.indexOf(s);
}

/**
 * Allowed admin transitions (phase 7 enforces these). A request can always be
 * cancelled; finished or cancelled projects are final.
 */
export const TRANSITIONS: Record<ProjectStatus, ProjectStatus[]> = {
  draft: [],
  requested: ["in_review", "cancelled"],
  in_review: ["mockup_in_progress", "cancelled"],
  mockup_in_progress: ["mockup_ready", "cancelled"],
  mockup_ready: ["revision_requested", "awaiting_payment", "cancelled"],
  revision_requested: ["mockup_in_progress", "mockup_ready", "cancelled"],
  awaiting_payment: ["in_progress", "cancelled"],
  in_progress: ["completed", "cancelled"],
  completed: [],
  cancelled: [],
};

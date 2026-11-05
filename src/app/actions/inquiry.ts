"use server";

import { z } from "zod";
import { db } from "@/db";
import { inquiries } from "@/db/schema";
import { isTopic, topicLabel } from "@/content/topics";
import { emailLayout, sendMail } from "@/lib/mail";
import { normalizePhoneId } from "@/lib/phone";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { siteUrl } from "@/lib/site";

export type InquiryState = {
  status: "idle" | "ok" | "error";
  message?: string;
  errors?: Partial<Record<"name" | "email" | "phone" | "message" | "consent", string>>;
};

const schema = z.object({
  name: z.string().trim().min(2, "Nama minimal 2 karakter").max(120),
  email: z.string().trim().toLowerCase().email("Format email belum benar").max(190),
  company: z.string().trim().max(160).optional(),
  phone: z.string().trim().max(32).optional(),
  topic: z.string().trim().max(80).optional(),
  message: z
    .string()
    .trim()
    .min(10, "Ceritakan kebutuhan Anda minimal 10 karakter")
    .max(4000, "Pesan terlalu panjang (maks 4000 karakter)"),
  consent: z.literal("on", "Centang persetujuan untuk melanjutkan"),
});

const MIN_FILL_MS = 2500; // humans need a few seconds, scripts do not
const MAX_FILL_MS = 1000 * 60 * 60 * 6;

/** Consultation request: validate, rate limit, store first, then notify by email. */
export async function submitInquiry(
  _prev: InquiryState,
  formData: FormData,
): Promise<InquiryState> {
  // Honeypot: bots fill the hidden field. Pretend success, store nothing.
  if (String(formData.get("website") ?? "").length > 0) {
    return { status: "ok", message: "Terima kasih." };
  }
  const elapsed = Date.now() - Number(formData.get("t") ?? 0);
  if (!(elapsed >= MIN_FILL_MS && elapsed <= MAX_FILL_MS)) {
    return {
      status: "error",
      message: "Form terkirim terlalu cepat atau sudah kedaluwarsa. Muat ulang halaman lalu coba lagi.",
    };
  }

  const ip = await clientIp();
  const limit = await rateLimit(`inquiry:${ip}`, 5, 60 * 60);
  if (!limit.ok) {
    return {
      status: "error",
      message: `Terlalu banyak pengiriman. Coba lagi dalam ${Math.ceil(limit.retryAfter / 60)} menit.`,
    };
  }

  const parsed = schema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    company: formData.get("company") || undefined,
    phone: formData.get("phone") || undefined,
    topic: formData.get("topic") || undefined,
    message: formData.get("message"),
    consent: formData.get("consent") ?? undefined,
  });
  if (!parsed.success) {
    const errors: NonNullable<InquiryState["errors"]> = {};
    for (const issue of parsed.error.issues) {
      const k = issue.path[0] as keyof NonNullable<InquiryState["errors"]>;
      if (k && !errors[k]) errors[k] = issue.message;
    }
    return { status: "error", message: "Periksa kembali isian yang ditandai.", errors };
  }
  const v = parsed.data;

  let phone: string | null = null;
  if (v.phone) {
    phone = normalizePhoneId(v.phone);
    if (!phone) {
      return {
        status: "error",
        message: "Periksa kembali isian yang ditandai.",
        errors: { phone: "Nomor ponsel Indonesia, mis. 0812xxxxxxxx" },
      };
    }
  }

  const topic = isTopic(v.topic) ? v.topic : "umum";
  const source = String(formData.get("source") ?? "").slice(0, 160) || null;

  // The record comes first: a mail failure must never lose a lead.
  try {
    await db().insert(inquiries).values({
      name: v.name,
      email: v.email,
      company: v.company ?? null,
      phone,
      topic,
      message: v.message,
      source,
      ip,
    });
  } catch (err) {
    console.error("[inquiry] insert failed", err);
    return {
      status: "error",
      message: "Maaf, permintaan Anda belum tersimpan. Coba lagi sebentar lagi.",
    };
  }

  const rows: [string, string][] = [
    ["Nama", v.name],
    ["Email", v.email],
    ["Perusahaan", v.company ?? "-"],
    ["Ponsel", phone ?? "-"],
    ["Topik", topicLabel(topic)],
    ["Halaman", source ?? "-"],
    ["Pesan", v.message],
  ];
  const admin = emailLayout({
    title: `Permintaan konsultasi baru: ${topicLabel(topic)}`,
    intro: `${v.name} mengirim permintaan lewat website.`,
    rows,
    cta: { label: "Balas lewat email", href: `mailto:${v.email}` },
  });
  const user = emailLayout({
    title: "Permintaan Anda sudah kami terima",
    intro: `Halo ${v.name}, terima kasih sudah menghubungi Omnity. Tim kami akan membalas secepatnya lewat email ini.`,
    rows: [
      ["Topik", topicLabel(topic)],
      ["Pesan Anda", v.message],
    ],
    cta: { label: "Lihat layanan kami", href: `${siteUrl}/layanan` },
  });
  const adminTo = process.env.MAIL_ADMIN_TO ?? "corporate@omnity.co.id";
  await Promise.all([
    sendMail({ to: adminTo, subject: admin.text.split("\n")[0], ...admin, replyTo: v.email }),
    sendMail({ to: v.email, subject: "Permintaan Anda sudah kami terima | Omnity", ...user }),
  ]);

  return {
    status: "ok",
    message: "Terima kasih. Permintaan Anda sudah kami terima dan tim kami akan membalas lewat email.",
  };
}

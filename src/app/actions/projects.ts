"use server";

import { and, eq, gt, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/db";
import { projects, uploads } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { emailLayout, sendMail } from "@/lib/mail";
import { addEvent, getOwnedProject, newProjectId } from "@/lib/projects";
import { rateLimit } from "@/lib/rate-limit";
import { siteUrl } from "@/lib/site";
import { removeStored } from "@/lib/storage";
import { emptySurvey, missingForSubmit, parseSurvey, surveySchema, type Survey } from "@/lib/survey";
import { templates } from "@/content/templates";

const looksLikeUrl = (s: string) => /^(https?:\/\/)?[\w-]+(\.[\w-]+)+(\/\S*)?$/i.test(s.trim());

/**
 * Creates a draft for the signed-in user, or reuses a blank one made in the last
 * 10 minutes (so a double click or a reload never produces duplicates).
 */
export async function startProject(input: { prompt?: string; template?: string | null }) {
  const user = await requireUser("/mulai");
  const prompt = (input.prompt ?? "").trim().slice(0, 1200);
  const template = templates.some((t) => t.id === input.template) ? input.template! : null;

  const limit = await rateLimit(`project-start:${user.id}`, 20, 60 * 60);
  if (!limit.ok) return { ok: false as const, error: "Terlalu banyak permintaan. Coba lagi nanti." };

  const [blank] = await db()
    .select({ id: projects.id })
    .from(projects)
    .where(
      and(
        eq(projects.userId, user.id),
        eq(projects.status, "draft"),
        eq(projects.title, ""),
        gt(projects.createdAt, sql`NOW() - INTERVAL 10 MINUTE`),
      ),
    )
    .limit(1);

  const survey: Survey = emptySurvey();
  if (prompt) {
    if (looksLikeUrl(prompt)) survey.business.oldSite = prompt;
    else survey.business.description = prompt;
  }
  if (user.company && user.company.toLowerCase() !== "perorangan") survey.business.name = user.company;
  const tpl = templates.find((t) => t.id === template);
  if (tpl) {
    survey.design.template = tpl.id;
    survey.business.industry = tpl.industry;
    survey.pages = [...tpl.menu];
  }

  if (blank) {
    await db()
      .update(projects)
      .set({ prompt: prompt || null, templateId: template, survey: JSON.stringify(survey) })
      .where(eq(projects.id, blank.id));
    return { ok: true as const, id: blank.id };
  }

  const id = newProjectId();
  await db().insert(projects).values({
    id,
    userId: user.id,
    prompt: prompt || null,
    templateId: template,
    title: survey.business.name,
    survey: JSON.stringify(survey),
  });
  return { ok: true as const, id };
}

const saveSchema = z.object({ id: z.string().regex(/^[a-f0-9]{16}$/), step: z.number().int().min(1).max(8) });

/** Autosave of the wizard. Called often (debounced), so it only does a single UPDATE. */
export async function saveSurvey(id: string, step: number, survey: unknown) {
  const user = await requireUser("/proyek");
  const head = saveSchema.safeParse({ id, step });
  const body = surveySchema.safeParse(survey);
  if (!head.success || !body.success) return { ok: false as const, error: "Data survei tidak valid." };

  const limit = await rateLimit(`survey-save:${user.id}`, 400, 60 * 60);
  if (!limit.ok) return { ok: false as const, error: "Terlalu sering menyimpan." };

  const project = await getOwnedProject(id, user.id);
  if (!project || project.status !== "draft") return { ok: false as const, error: "Proyek tidak ditemukan atau sudah dikirim." };

  // Only keep upload ids that really belong to this project (a client cannot attach someone else's file).
  const ownIds = new Set(
    (await db().select({ id: uploads.id }).from(uploads).where(eq(uploads.projectId, id))).map((r) => r.id),
  );
  const data = body.data;
  data.design.refFiles = data.design.refFiles.filter((f) => ownIds.has(f));
  if (data.brand.logo && !ownIds.has(data.brand.logo)) data.brand.logo = null;

  await db()
    .update(projects)
    .set({
      title: data.business.name,
      templateId: data.design.template || null,
      survey: JSON.stringify(data),
      surveyStep: head.data.step,
    })
    .where(eq(projects.id, id));
  return { ok: true as const };
}

/** Sends the survey to the team: draft -> requested, with history and emails. */
export async function submitProject(id: string) {
  const user = await requireUser("/proyek");
  const project = await getOwnedProject(id, user.id);
  if (!project || project.status !== "draft") return { ok: false as const, error: "Proyek tidak ditemukan atau sudah dikirim." };

  const survey = parseSurvey(project.survey);
  const missing = missingForSubmit(survey);
  const firstStep = Number(Object.keys(missing)[0]);
  if (firstStep) return { ok: false as const, error: missing[firstStep], step: firstStep };

  // Compare-and-set so a double click cannot submit twice.
  const [res] = await db()
    .update(projects)
    .set({ status: "requested", submittedAt: sql`NOW()`, title: survey.business.name })
    .where(and(eq(projects.id, id), eq(projects.status, "draft")));
  if (res.affectedRows !== 1) return { ok: false as const, error: "Proyek sudah dikirim." };
  await addEvent({ projectId: id, from: "draft", to: "requested", note: "Survei dikirim oleh pengguna.", byUserId: user.id });

  const detailUrl = `${siteUrl}/proyek/${id}`;
  const toUser = emailLayout({
    title: "Permintaan proyek Anda sudah kami terima",
    intro: `Halo ${user.name}, terima kasih. Tim Omnity akan meninjau survei Anda dan menyiapkan mockup. Estimasi 2 sampai 3 hari kerja. Anda mendapat email lagi saat mockup dan penawaran siap.`,
    rows: [
      ["Bisnis", survey.business.name],
      ["Halaman", survey.pages.join(", ")],
    ],
    cta: { label: "Lihat status proyek", href: detailUrl },
  });
  const toAdmin = emailLayout({
    title: `Permintaan proyek baru: ${survey.business.name}`,
    intro: `${user.name} (${user.company ?? "-"}) mengirim survei Design Anything.`,
    rows: [
      ["Kontak", `${user.email} · ${user.phone ?? "-"}`],
      ["Industri", survey.business.industry],
      ["Template", survey.design.template || "-"],
      ["Halaman", survey.pages.join(", ")],
      ["Deskripsi", survey.business.description],
    ],
    cta: { label: "Buka di admin", href: `${siteUrl}/admin/proyek/${id}` },
  });
  await Promise.all([
    sendMail({ to: user.email, subject: "Permintaan proyek Anda sudah kami terima | Omnity", ...toUser }),
    sendMail({
      to: process.env.MAIL_ADMIN_TO ?? "corporate@omnity.co.id",
      subject: `Permintaan proyek baru: ${survey.business.name}`,
      replyTo: user.email,
      ...toAdmin,
    }),
  ]);

  revalidatePath("/proyek");
  return { ok: true as const };
}

/** Deletes an unsent draft and its files. Used by a confirmed <form action>. */
export async function deleteDraft(formData: FormData) {
  const user = await requireUser("/proyek");
  const id = String(formData.get("id") ?? "");
  const project = await getOwnedProject(id, user.id);
  if (project && project.status === "draft") {
    const files = await db().select({ path: uploads.path }).from(uploads).where(eq(uploads.projectId, id));
    await db().delete(uploads).where(eq(uploads.projectId, id));
    await db().delete(projects).where(eq(projects.id, id));
    await Promise.all(files.map((f) => removeStored(f.path)));
  }
  revalidatePath("/proyek");
  redirect("/proyek");
}

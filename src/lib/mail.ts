import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import nodemailer, { type Transporter } from "nodemailer";
import { site, siteUrl } from "@/lib/site";

export type MailInput = {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
};

export function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

let transport: Transporter | null = null;
function getTransport() {
  if (transport) return transport;
  const host = process.env.SMTP_HOST;
  if (!host) return null;
  const port = Number(process.env.SMTP_PORT ?? 465);
  transport = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS ?? "" }
      : undefined,
  });
  return transport;
}

/**
 * Sends through SMTP when SMTP_HOST is set. Otherwise (dev) the message is
 * logged and written to storage/outbox so flows can be tested without a mailbox.
 * Never throws: callers treat email as best effort and keep their own record.
 */
export async function sendMail(input: MailInput): Promise<{ ok: boolean; error?: string }> {
  const from = process.env.MAIL_FROM ?? "Omnity <no-reply@omnity.co.id>";
  const t = getTransport();
  try {
    if (!t) {
      const dir = path.resolve(process.env.OUTBOX_DIR ?? "storage/outbox");
      await mkdir(dir, { recursive: true });
      const file = `${Date.now()}-${input.to.replace(/[^a-z0-9@.]/gi, "_")}.json`;
      await writeFile(path.join(dir, file), JSON.stringify({ from, ...input }, null, 2));
      console.info(`[mail:dev] to=${input.to} subject="${input.subject}" -> ${file}`);
      return { ok: true };
    }
    await t.sendMail({
      from,
      to: input.to,
      subject: input.subject,
      html: input.html,
      text: input.text,
      replyTo: input.replyTo,
    });
    return { ok: true };
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    console.error(`[mail] failed to send "${input.subject}" to ${input.to}: ${error}`);
    return { ok: false, error };
  }
}

/** Plain, client-safe HTML shell shared by every transactional email. */
export function emailLayout({
  title,
  intro,
  rows,
  cta,
  footer,
}: {
  title: string;
  intro: string;
  rows?: [string, string][];
  cta?: { label: string; href: string };
  footer?: string;
}) {
  const rowsHtml = (rows ?? [])
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 16px 6px 0;color:#6b7280;font-size:13px;vertical-align:top;white-space:nowrap">${escapeHtml(k)}</td><td style="padding:6px 0;font-size:14px;color:#0e1220;white-space:pre-wrap">${escapeHtml(v)}</td></tr>`,
    )
    .join("");
  const ctaHtml = cta
    ? `<p style="margin:24px 0 0"><a href="${escapeHtml(cta.href)}" style="display:inline-block;background:#0e1220;color:#fff;text-decoration:none;padding:12px 20px;border-radius:10px;font-size:14px;font-weight:600">${escapeHtml(cta.label)}</a></p>`
    : "";
  const html = `<!doctype html><html lang="id"><body style="margin:0;background:#fafaf7;padding:24px;font-family:Inter,Arial,sans-serif;color:#0e1220">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
<table role="presentation" width="560" style="max-width:560px;background:#fff;border:1px solid #e5e7eb;border-radius:16px;padding:32px">
<tr><td>
<p style="margin:0 0 20px;font-size:13px;letter-spacing:.2em;font-weight:700">OMNITY</p>
<h1 style="margin:0 0 12px;font-size:22px;line-height:1.3;font-weight:600">${escapeHtml(title)}</h1>
<p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#374151">${escapeHtml(intro)}</p>
${rowsHtml ? `<table role="presentation" cellpadding="0" cellspacing="0" style="border-top:1px solid #e5e7eb;padding-top:12px;width:100%">${rowsHtml}</table>` : ""}
${ctaHtml}
</td></tr></table>
<p style="max-width:560px;margin:16px 0 0;font-size:12px;color:#6b7280;line-height:1.6">${escapeHtml(footer ?? `${site.legalName} · ${site.address.line1}, ${site.address.line2}, ${site.address.city}`)}<br><a href="${siteUrl}" style="color:#6b7280">${siteUrl.replace(/^https?:\/\//, "")}</a></p>
</td></tr></table></body></html>`;
  const text = [title, "", intro, "", ...(rows ?? []).map(([k, v]) => `${k}: ${v}`), cta ? `\n${cta.label}: ${cta.href}` : ""]
    .join("\n")
    .trim();
  return { html, text };
}

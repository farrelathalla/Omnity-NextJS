import "server-only";
import type { User } from "@/db/schema";
import { emailLayout, sendMail } from "@/lib/mail";
import { siteUrl } from "@/lib/site";
import { issueToken } from "@/lib/tokens";

const enc = encodeURIComponent;

export async function sendVerificationEmail(user: Pick<User, "id" | "email" | "name">, next?: string | null) {
  const token = await issueToken(user.id, "verify", 60 * 24);
  const href = `${siteUrl}/api/auth/verify?token=${enc(token)}${next ? `&next=${enc(next)}` : ""}`;
  const m = emailLayout({
    title: "Verifikasi email Anda",
    intro: `Halo ${user.name}, terima kasih sudah mendaftar di Omnity. Klik tombol di bawah untuk memverifikasi email dan langsung masuk. Tautan berlaku 24 jam.`,
    cta: { label: "Verifikasi email", href },
    footer: "Jika Anda tidak merasa mendaftar, abaikan email ini.",
  });
  return sendMail({ to: user.email, subject: "Verifikasi email Anda | Omnity", ...m });
}

export async function sendWelcomeEmail(user: Pick<User, "email" | "name">) {
  const m = emailLayout({
    title: "Selamat datang di Omnity",
    intro: `Halo ${user.name}, email Anda sudah terverifikasi. Anda bisa memulai proyek website lewat Design Anything: isi survei singkat, terima mockup, lalu putuskan.`,
    cta: { label: "Mulai proyek", href: `${siteUrl}/mulai` },
  });
  return sendMail({ to: user.email, subject: "Selamat datang di Omnity", ...m });
}

export async function sendResetEmail(user: Pick<User, "id" | "email" | "name">) {
  const token = await issueToken(user.id, "reset", 60);
  const m = emailLayout({
    title: "Atur ulang kata sandi",
    intro: `Halo ${user.name}, kami menerima permintaan untuk mengatur ulang kata sandi akun Omnity Anda. Tautan berlaku 1 jam dan hanya bisa dipakai sekali.`,
    cta: { label: "Atur kata sandi baru", href: `${siteUrl}/reset-password?token=${enc(token)}` },
    footer: "Jika Anda tidak memintanya, abaikan email ini; kata sandi Anda tidak berubah.",
  });
  return sendMail({ to: user.email, subject: "Atur ulang kata sandi | Omnity", ...m });
}

/** Sent instead of a verification mail when someone registers an email that already has an account. */
export async function sendAlreadyRegisteredEmail(user: Pick<User, "email" | "name">) {
  const m = emailLayout({
    title: "Anda sudah punya akun",
    intro: `Halo ${user.name}, seseorang (mungkin Anda) mencoba mendaftar dengan email ini, tetapi akun Omnity sudah ada. Silakan masuk, atau atur ulang kata sandi bila lupa.`,
    cta: { label: "Masuk", href: `${siteUrl}/masuk` },
  });
  return sendMail({ to: user.email, subject: "Anda sudah punya akun Omnity", ...m });
}

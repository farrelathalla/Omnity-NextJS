"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/db";
import { users, type User } from "@/db/schema";
import {
  sendAlreadyRegisteredEmail,
  sendResetEmail,
  sendVerificationEmail,
} from "@/lib/account-mail";
import { createSession, destroySession, requireUser, safeNext } from "@/lib/auth";
import { hashPassword, verifyPassword } from "@/lib/password";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { consumeToken } from "@/lib/tokens";
import {
  companyField,
  emailField,
  fieldErrors,
  nameField,
  passwordField,
  phoneField,
  type FieldErrors,
} from "@/lib/validation";

export type AuthState = {
  status: "idle" | "ok" | "error";
  message?: string;
  errors?: FieldErrors;
  /** where the client should navigate after success */
  redirectTo?: string;
  /** set when the credentials were right but the email is not verified yet */
  unverifiedEmail?: string;
  /** echoed back for the "check your email" panel */
  email?: string;
};

const MIN_FILL_MS = 2500;
const MAX_FILL_MS = 1000 * 60 * 60 * 6;

/** Honeypot + fill-time check shared by the public forms. Returns an error message or null. */
function botCheck(fd: FormData): "bot" | "fast" | null {
  if (String(fd.get("website") ?? "").length > 0) return "bot";
  const elapsed = Date.now() - Number(fd.get("t") ?? 0);
  return elapsed >= MIN_FILL_MS && elapsed <= MAX_FILL_MS ? null : "fast";
}

const needsProfile = (u: Pick<User, "company" | "phone">) => !u.company || !u.phone;

/** Where to send a user right after they authenticate. */
function landingFor(user: User, next: string | null) {
  if (needsProfile(user)) {
    return `/profil/lengkapi${next ? `?next=${encodeURIComponent(next)}` : ""}`;
  }
  return next ?? (user.role === "admin" ? "/admin" : "/");
}

// ---------------------------------------------------------------- login

const loginSchema = z.object({ email: emailField, password: z.string().min(1).max(200) });

export async function login(_prev: AuthState, fd: FormData): Promise<AuthState> {
  const parsed = loginSchema.safeParse({ email: fd.get("email"), password: fd.get("password") });
  if (!parsed.success) return { status: "error", message: "Email atau kata sandi belum benar." };
  const { email, password } = parsed.data;

  // Limit by IP and by account so neither one client nor a distributed guess can hammer a login.
  const ip = await clientIp();
  const [byIp, byEmail] = await Promise.all([
    rateLimit(`login-ip:${ip}`, 30, 15 * 60),
    rateLimit(`login-email:${email}`, 8, 15 * 60),
  ]);
  if (!byIp.ok || !byEmail.ok) {
    return { status: "error", message: "Terlalu banyak percobaan masuk. Coba lagi beberapa menit lagi." };
  }

  const [user] = await db().select().from(users).where(eq(users.email, email)).limit(1);
  const ok = await verifyPassword(password, user?.passwordHash);
  if (!user || !ok) return { status: "error", message: "Email atau kata sandi belum benar." };

  // Only revealed after the password was right, so this cannot be used to probe for accounts.
  if (!user.emailVerifiedAt) {
    return {
      status: "error",
      message: "Email Anda belum diverifikasi. Cek kotak masuk, atau kirim ulang tautannya.",
      unverifiedEmail: user.email,
    };
  }

  await createSession(user);
  return { status: "ok", redirectTo: landingFor(user, safeNext(String(fd.get("next") ?? ""))) };
}

/** Clears the session and redirects (used by plain <form action> buttons, e.g. the admin shell). */
export async function logout() {
  await destroySession();
  redirect("/");
}

/** Clears the session without redirecting, so client state can be refreshed deterministically. */
export async function signOut() {
  await destroySession();
}

// ------------------------------------------------------------- register

const registerSchema = z.object({
  name: nameField,
  company: companyField,
  phone: phoneField,
  email: emailField,
  password: passwordField,
  consent: z.literal("on", "Centang persetujuan Syarat & Privasi untuk melanjutkan"),
});

export async function register(_prev: AuthState, fd: FormData): Promise<AuthState> {
  const bot = botCheck(fd);
  if (bot === "bot") return { status: "ok", email: "", message: "Cek email Anda." }; // silently drop
  if (bot === "fast") {
    return { status: "error", message: "Form terkirim terlalu cepat. Muat ulang halaman lalu coba lagi." };
  }

  const ip = await clientIp();
  const limit = await rateLimit(`register:${ip}`, 6, 60 * 60);
  if (!limit.ok) {
    return { status: "error", message: "Terlalu banyak pendaftaran dari jaringan ini. Coba lagi nanti." };
  }

  const parsed = registerSchema.safeParse({
    name: fd.get("name"),
    company: fd.get("company"),
    phone: fd.get("phone"),
    email: fd.get("email"),
    password: fd.get("password"),
    consent: fd.get("consent") ?? undefined,
  });
  if (!parsed.success) {
    return { status: "error", message: "Periksa kembali isian yang ditandai.", errors: fieldErrors(parsed.error) };
  }
  const v = parsed.data;
  const next = safeNext(String(fd.get("next") ?? ""));

  const [existing] = await db().select().from(users).where(eq(users.email, v.email)).limit(1);
  if (existing) {
    // Same response as a fresh signup, so the form cannot be used to discover who has an account.
    if (existing.emailVerifiedAt) await sendAlreadyRegisteredEmail(existing);
    else await sendVerificationEmail(existing, next);
  } else {
    const passwordHash = await hashPassword(v.password);
    const [res] = await db().insert(users).values({
      email: v.email,
      name: v.name,
      company: v.company,
      phone: v.phone,
      passwordHash,
    });
    await sendVerificationEmail({ id: res.insertId, email: v.email, name: v.name }, next);
  }
  return { status: "ok", email: v.email };
}

export async function resendVerification(_prev: AuthState, fd: FormData): Promise<AuthState> {
  const parsed = emailField.safeParse(fd.get("email"));
  const generic: AuthState = {
    status: "ok",
    message: "Jika email itu terdaftar dan belum terverifikasi, tautan baru sudah dikirim.",
  };
  if (!parsed.success) return generic;
  const ip = await clientIp();
  const [a, b] = await Promise.all([
    rateLimit(`resend-ip:${ip}`, 6, 60 * 60),
    rateLimit(`resend-email:${parsed.data}`, 3, 60 * 60),
  ]);
  if (!a.ok || !b.ok) return { status: "error", message: "Terlalu sering. Coba lagi dalam beberapa menit." };
  const [user] = await db().select().from(users).where(eq(users.email, parsed.data)).limit(1);
  if (user && !user.emailVerifiedAt) {
    await sendVerificationEmail(user, safeNext(String(fd.get("next") ?? "")));
  }
  return generic;
}

// ------------------------------------------------------- password reset

export async function requestPasswordReset(_prev: AuthState, fd: FormData): Promise<AuthState> {
  const generic: AuthState = {
    status: "ok",
    message: "Jika email itu terdaftar, tautan untuk mengatur ulang kata sandi sudah dikirim.",
  };
  const parsed = emailField.safeParse(fd.get("email"));
  if (!parsed.success) {
    return { status: "error", message: "Periksa kembali isian yang ditandai.", errors: { email: "Format email belum benar" } };
  }
  const ip = await clientIp();
  const [a, b] = await Promise.all([
    rateLimit(`reset-ip:${ip}`, 6, 60 * 60),
    rateLimit(`reset-email:${parsed.data}`, 3, 60 * 60),
  ]);
  if (!a.ok || !b.ok) return { status: "error", message: "Terlalu sering. Coba lagi dalam beberapa menit." };

  const [user] = await db().select().from(users).where(eq(users.email, parsed.data)).limit(1);
  if (user) await sendResetEmail(user);
  return generic;
}

const resetSchema = z
  .object({ token: z.string().min(10).max(100), password: passwordField, confirm: z.string() })
  .refine((v) => v.password === v.confirm, { path: ["confirm"], message: "Kata sandi tidak sama" });

export async function resetPassword(_prev: AuthState, fd: FormData): Promise<AuthState> {
  const parsed = resetSchema.safeParse({
    token: fd.get("token"),
    password: fd.get("password"),
    confirm: fd.get("confirm"),
  });
  if (!parsed.success) {
    return { status: "error", message: "Periksa kembali isian yang ditandai.", errors: fieldErrors(parsed.error) };
  }
  const userId = await consumeToken(parsed.data.token, "reset");
  if (!userId) {
    return { status: "error", message: "Tautan sudah kedaluwarsa atau pernah dipakai. Minta tautan baru." };
  }
  const passwordHash = await hashPassword(parsed.data.password);
  const [user] = await db().select().from(users).where(eq(users.id, userId)).limit(1);
  if (!user) return { status: "error", message: "Akun tidak ditemukan." };

  // Bumping token_version signs the account out everywhere (including whoever knew the old password).
  await db()
    .update(users)
    .set({
      passwordHash,
      tokenVersion: user.tokenVersion + 1,
      emailVerifiedAt: user.emailVerifiedAt ?? new Date(), // they proved ownership of the inbox
    })
    .where(eq(users.id, userId));
  const fresh = { ...user, tokenVersion: user.tokenVersion + 1 };
  await createSession(fresh);
  // Server-side redirect: setting the cookie makes Next re-render this page, where the spent token
  // would show "link invalid" before any client-side navigation could run.
  redirect(landingFor(fresh, null));
}

// -------------------------------------------------------------- profile

const profileSchema = z.object({ name: nameField, company: companyField, phone: phoneField });

export async function updateProfile(_prev: AuthState, fd: FormData): Promise<AuthState> {
  const user = await requireUser("/profil");
  const parsed = profileSchema.safeParse({
    name: fd.get("name"),
    company: fd.get("company"),
    phone: fd.get("phone"),
  });
  if (!parsed.success) {
    return { status: "error", message: "Periksa kembali isian yang ditandai.", errors: fieldErrors(parsed.error) };
  }
  await db().update(users).set(parsed.data).where(eq(users.id, user.id));
  return { status: "ok", message: "Profil tersimpan." };
}

export async function completeProfile(_prev: AuthState, fd: FormData): Promise<AuthState> {
  const user = await requireUser("/profil/lengkapi");
  const parsed = z.object({ company: companyField, phone: phoneField }).safeParse({
    company: fd.get("company"),
    phone: fd.get("phone"),
  });
  if (!parsed.success) {
    return { status: "error", message: "Periksa kembali isian yang ditandai.", errors: fieldErrors(parsed.error) };
  }
  await db().update(users).set(parsed.data).where(eq(users.id, user.id));
  redirect(safeNext(String(fd.get("next") ?? "")) ?? "/");
}

const passwordChangeSchema = z
  .object({ current: z.string().max(200), password: passwordField, confirm: z.string() })
  .refine((v) => v.password === v.confirm, { path: ["confirm"], message: "Kata sandi tidak sama" });

export async function changePassword(_prev: AuthState, fd: FormData): Promise<AuthState> {
  const user = await requireUser("/profil");
  const parsed = passwordChangeSchema.safeParse({
    current: fd.get("current") ?? "",
    password: fd.get("password"),
    confirm: fd.get("confirm"),
  });
  if (!parsed.success) {
    return { status: "error", message: "Periksa kembali isian yang ditandai.", errors: fieldErrors(parsed.error) };
  }
  const limit = await rateLimit(`pwchange:${user.id}`, 8, 15 * 60);
  if (!limit.ok) return { status: "error", message: "Terlalu banyak percobaan. Coba lagi nanti." };

  // Accounts created through Google have no password yet, so there is nothing to confirm.
  if (user.passwordHash && !(await verifyPassword(parsed.data.current, user.passwordHash))) {
    return { status: "error", message: "Periksa kembali isian yang ditandai.", errors: { current: "Kata sandi saat ini salah" } };
  }
  const passwordHash = await hashPassword(parsed.data.password);
  const tokenVersion = user.tokenVersion + 1;
  await db().update(users).set({ passwordHash, tokenVersion }).where(eq(users.id, user.id));
  await createSession({ ...user, tokenVersion }); // keep THIS browser signed in, drop every other session
  return { status: "ok", message: "Kata sandi diperbarui. Sesi di perangkat lain telah dikeluarkan." };
}

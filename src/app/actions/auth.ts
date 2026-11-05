"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/db";
import { users } from "@/db/schema";
import { createSession, destroySession, safeNext } from "@/lib/auth";
import { verifyPassword } from "@/lib/password";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export type LoginState = { error?: string };

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1).max(200),
});

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { error: "Email atau kata sandi belum benar." };
  const { email, password } = parsed.data;

  // Limit by IP and by account so neither a single client nor a distributed guess can hammer one login.
  const ip = await clientIp();
  const [byIp, byEmail] = await Promise.all([
    rateLimit(`login-ip:${ip}`, 30, 15 * 60),
    rateLimit(`login-email:${email}`, 8, 15 * 60),
  ]);
  if (!byIp.ok || !byEmail.ok) {
    return { error: "Terlalu banyak percobaan masuk. Coba lagi beberapa menit lagi." };
  }

  const [user] = await db().select().from(users).where(eq(users.email, email)).limit(1);
  const ok = await verifyPassword(password, user?.passwordHash);
  if (!user || !ok) return { error: "Email atau kata sandi belum benar." };

  await createSession(user);
  const next = safeNext(String(formData.get("next") ?? ""));
  redirect(next ?? (user.role === "admin" ? "/admin" : "/"));
}

export async function logout() {
  await destroySession();
  redirect("/");
}

import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthPage } from "@/components/auth/auth-page";
import { LoginForm } from "@/components/forms/auth-forms";
import { Em } from "@/components/ui/section";
import { getCurrentUser, safeNext } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Masuk",
  robots: { index: false, follow: false },
};

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

const notices: Record<string, string> = {
  "verifikasi:gagal": "Tautan verifikasi sudah kedaluwarsa atau pernah dipakai. Masuk lalu kirim ulang tautan verifikasi.",
  "google:gagal": "Masuk dengan Google gagal. Coba lagi atau pakai email.",
  "google:email": "Akun Google Anda belum memiliki email yang terverifikasi.",
  "google:nonaktif": "Masuk dengan Google belum diaktifkan.",
};

export default async function LoginPage({ searchParams }: PageProps<"/masuk">) {
  const sp = await searchParams;
  const next = safeNext(first(sp.next)) ?? undefined;
  const user = await getCurrentUser();
  if (user) redirect(next ?? (user.role === "admin" ? "/admin" : "/"));

  const notice =
    notices[`verifikasi:${first(sp.verifikasi)}`] ?? notices[`google:${first(sp.google)}`] ?? null;

  return (
    <AuthPage
      title={
        <>
          Selamat <Em tone="ink">datang.</Em>
        </>
      }
      lead="Masuk untuk melanjutkan."
    >
      {notice ? (
        <p role="alert" className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {notice}
        </p>
      ) : null}
      <LoginForm next={next} />
    </AuthPage>
  );
}

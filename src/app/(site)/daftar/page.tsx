import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthPage } from "@/components/auth/auth-page";
import { RegisterForm } from "@/components/forms/auth-forms";
import { Em } from "@/components/ui/section";
import { getCurrentUser, safeNext } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Daftar",
  robots: { index: false, follow: false },
};

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export default async function RegisterPage({ searchParams }: PageProps<"/daftar">) {
  const next = safeNext(first((await searchParams).next)) ?? undefined;
  if (await getCurrentUser()) redirect(next ?? "/");

  return (
    <AuthPage
      wide
      title={
        <>
          Buat <Em tone="ink">akun.</Em>
        </>
      }
      lead="Diperlukan untuk memakai Design Anything, bertanya di forum, dan berkomentar."
    >
      <RegisterForm next={next} />
    </AuthPage>
  );
}

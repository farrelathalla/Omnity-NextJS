import type { Metadata } from "next";
import { AuthPage } from "@/components/auth/auth-page";
import { ResetForm } from "@/components/forms/auth-forms";
import { ButtonLink } from "@/components/ui/button";
import { Em } from "@/components/ui/section";
import { peekToken } from "@/lib/tokens";

export const metadata: Metadata = {
  title: "Atur ulang kata sandi",
  robots: { index: false, follow: false },
};

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export default async function ResetPasswordPage({ searchParams }: PageProps<"/reset-password">) {
  const token = first((await searchParams).token) ?? "";
  const valid = token ? await peekToken(token, "reset") : null;

  if (!valid) {
    return (
      <AuthPage title={<>Tautan <Em tone="ink">tidak berlaku.</Em></>}>
        <p className="text-center text-muted">
          Tautan ini sudah kedaluwarsa atau pernah dipakai. Minta tautan yang baru.
        </p>
        <div className="mt-6 flex justify-center">
          <ButtonLink href="/lupa-password" shape="pill">
            Minta tautan baru
          </ButtonLink>
        </div>
      </AuthPage>
    );
  }

  return (
    <AuthPage title={<>Kata sandi <Em tone="ink">baru.</Em></>} lead="Pilih kata sandi baru untuk akun Anda.">
      <ResetForm token={token} />
    </AuthPage>
  );
}

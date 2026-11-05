import type { Metadata } from "next";
import Link from "next/link";
import { AuthPage } from "@/components/auth/auth-page";
import { ForgotForm } from "@/components/forms/auth-forms";
import { Em } from "@/components/ui/section";

export const metadata: Metadata = {
  title: "Lupa kata sandi",
  robots: { index: false, follow: false },
};

export default function ForgotPasswordPage() {
  return (
    <AuthPage
      title={
        <>
          Lupa <Em tone="ink">kata sandi?</Em>
        </>
      }
      lead="Masukkan email akun Anda. Kami kirim tautan untuk mengatur ulang."
    >
      <ForgotForm />
      <p className="mt-6 text-center text-sm text-muted">
        Ingat kata sandinya?{" "}
        <Link href="/masuk" className="font-semibold text-accent hover:underline">
          Masuk
        </Link>
      </p>
    </AuthPage>
  );
}

import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/button";
import { ComingSoon, Em } from "@/components/coming-soon";

export const metadata: Metadata = {
  title: "Masuk",
  robots: { index: false, follow: false },
};

// Replaced by the real login / registration in phases 4-5.
export default function LoginPage() {
  return (
    <ComingSoon
      kicker="Akun"
      title={
        <>
          Login segera <Em tone="ink">tersedia.</Em>
        </>
      }
      lead="Masuk dan daftar akan dibuka bersama fitur Design Anything. Sementara ini, hubungi kami lewat form kontak."
      actions={
        <ButtonLink href="/kontak" shape="pill">
          Hubungi kami
        </ButtonLink>
      }
    />
  );
}

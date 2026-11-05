"use client";

import { useEffect } from "react";
import { PageHero } from "@/components/page-hero";
import { Button, ButtonLink } from "@/components/ui/button";
import { Em } from "@/components/ui/section";

export default function ErrorPage({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <PageHero
      kicker="Terjadi kesalahan"
      title={
        <>
          Ada yang <Em tone="ink">tidak beres.</Em>
        </>
      }
      lead="Maaf, halaman ini gagal dimuat. Coba lagi, atau kembali ke beranda."
      actions={
        <>
          <Button shape="pill" onClick={() => unstable_retry()}>
            Coba lagi
          </Button>
          <ButtonLink href="/" variant="secondary" shape="pill">
            Ke beranda
          </ButtonLink>
        </>
      }
    />
  );
}

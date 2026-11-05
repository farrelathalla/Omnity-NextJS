import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { ButtonLink } from "@/components/ui/button";
import { Em } from "@/components/ui/section";
import { requireUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Proyek Saya",
  robots: { index: false, follow: false },
};

// Replaced by the real project list and detail in phase 6.
export default async function MyProjectsPage() {
  const user = await requireUser("/proyek");
  return (
    <PageHero
      kicker="Proyek Saya"
      title={
        <>
          Belum ada <Em tone="ink">proyek.</Em>
        </>
      }
      lead={`Halo ${user.name.split(" ")[0]}. Proyek yang Anda ajukan lewat Design Anything akan muncul di sini, lengkap dengan status, mockup, dan penawaran.`}
      actions={
        <ButtonLink href="/mulai" shape="pill">
          Mulai proyek
        </ButtonLink>
      }
    />
  );
}

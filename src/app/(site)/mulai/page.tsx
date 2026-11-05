import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/button";
import { ComingSoon, Em } from "@/components/coming-soon";

export const metadata: Metadata = {
  title: "Design Anything",
  description: "Isi survei singkat, terima mockup website dari tim Omnity, lalu putuskan.",
  alternates: { canonical: "/mulai" },
};

// Replaced by the template picker and survey wizard in phase 6.
export default function StartPage() {
  return (
    <ComingSoon
      kicker="Design Anything"
      title={
        <>
          Mockup website, <Em tone="ink">sebelum Anda bayar.</Em>
        </>
      }
      lead="Survei singkat dan pembuatan mockup sedang kami siapkan. Sementara itu, ceritakan kebutuhan website Anda dan tim kami akan menghubungi."
      actions={
        <ButtonLink href="/kontak?topik=pembuatan-website" shape="pill">
          Ceritakan kebutuhan website
        </ButtonLink>
      }
    />
  );
}

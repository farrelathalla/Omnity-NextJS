import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/button";
import { ComingSoon, Em } from "@/components/coming-soon";

export const metadata: Metadata = {
  title: "Forum",
  description: "Forum tanya-jawab Omnity akan segera dibuka.",
  alternates: { canonical: "/forum" },
};

export default function ForumPage() {
  return (
    <ComingSoon
      kicker="Forum"
      title={
        <>
          Forum segera <Em tone="ink">dibuka.</Em>
        </>
      }
      lead="Tempat bertanya seputar produk, layanan, dan teknologi, dengan jawaban dari tim Omnity dan sesama pengguna. Sementara itu, pertanyaan Anda tetap bisa kami jawab lewat form kontak."
      actions={
        <>
          <ButtonLink href="/kontak" shape="pill">
            Tanya lewat form kontak
          </ButtonLink>
          <ButtonLink href="/blog" variant="secondary" shape="pill">
            Baca blog
          </ButtonLink>
        </>
      }
    />
  );
}

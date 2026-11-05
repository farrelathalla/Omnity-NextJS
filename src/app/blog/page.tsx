import type { Metadata } from "next";
import { ComingSoon, Em } from "@/components/coming-soon";

export const metadata: Metadata = {
  title: "Blog",
  description: "Tulisan dari tim Omnity tentang teknologi, pembayaran digital, dan bisnis.",
  alternates: { canonical: "/blog" },
};

// Replaced by the real blog (list + posts) in phase 4.
export default function BlogPage() {
  return (
    <ComingSoon
      kicker="Blog"
      title={
        <>
          Artikel pertama <Em tone="ink">segera terbit.</Em>
        </>
      }
      lead="Tim Omnity sedang menyiapkan tulisan tentang teknologi, pembayaran digital, dan cara membangun bisnis yang efisien."
    />
  );
}

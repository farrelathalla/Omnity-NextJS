import { PageHero } from "@/components/page-hero";
import { ButtonLink } from "@/components/ui/button";
import { Em } from "@/components/ui/section";

export default function NotFound() {
  return (
    <PageHero
      kicker="404"
      title={
        <>
          Halaman tidak <Em tone="ink">ditemukan.</Em>
        </>
      }
      lead="Alamat yang Anda tuju mungkin salah ketik, atau halamannya sudah dipindahkan."
      actions={
        <>
          <ButtonLink href="/" shape="pill">
            Ke beranda
          </ButtonLink>
          <ButtonLink href="/kontak" variant="secondary" shape="pill">
            Hubungi kami
          </ButtonLink>
        </>
      }
    />
  );
}

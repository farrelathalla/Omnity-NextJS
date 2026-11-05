import type { ReactNode } from "react";
import { PageHero } from "@/components/page-hero";
import { ButtonLink } from "@/components/ui/button";
import { Em } from "@/components/ui/section";

/** Honest placeholder for features that ship in a later phase. */
export function ComingSoon({
  kicker,
  title,
  lead,
  actions,
}: {
  kicker: string;
  title: ReactNode;
  lead: string;
  actions?: ReactNode;
}) {
  return (
    <PageHero
      kicker={kicker}
      title={title}
      lead={lead}
      actions={
        actions ?? (
          <>
            <ButtonLink href="/kontak" shape="pill">
              Hubungi kami
            </ButtonLink>
            <ButtonLink href="/" variant="secondary" shape="pill">
              Kembali ke beranda
            </ButtonLink>
          </>
        )
      }
    />
  );
}

export { Em };

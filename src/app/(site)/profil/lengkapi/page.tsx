import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthPage } from "@/components/auth/auth-page";
import { CompleteProfileForm } from "@/components/forms/auth-forms";
import { Em } from "@/components/ui/section";
import { requireUser, safeNext } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Lengkapi profil",
  robots: { index: false, follow: false },
};

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

/** After a first Google sign-in we still need company and phone (brief chapter 09). */
export default async function CompleteProfilePage({ searchParams }: PageProps<"/profil/lengkapi">) {
  const next = safeNext(first((await searchParams).next)) ?? undefined;
  const user = await requireUser("/profil/lengkapi");
  if (user.company && user.phone) redirect(next ?? "/");

  return (
    <AuthPage
      title={
        <>
          Satu langkah <Em tone="ink">lagi.</Em>
        </>
      }
      lead={`Halo ${user.name.split(" ")[0]}, lengkapi data ini supaya survei dan penawaran bisa terisi otomatis.`}
    >
      <CompleteProfileForm next={next} defaults={{ company: user.company ?? "", phone: user.phone ?? "" }} />
    </AuthPage>
  );
}

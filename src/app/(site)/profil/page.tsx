import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Container, Em } from "@/components/ui/section";
import { PasswordForm, ProfileForm } from "@/components/forms/auth-forms";
import { PageHero } from "@/components/page-hero";
import { requireUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Profil",
  robots: { index: false, follow: false },
};

export default async function ProfilePage() {
  const user = await requireUser("/profil");
  return (
    <>
      <PageHero
        kicker="Akun"
        title={
          <>
            Profil <Em tone="ink">Anda.</Em>
          </>
        }
        lead="Data ini dipakai untuk mengisi survei otomatis dan menghubungi Anda. Email dan nomor ponsel tidak pernah tampil di profil publik."
      />
      <section className="pb-24">
        <Container>
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="rounded-card border border-line bg-surface p-6 shadow-card sm:p-8">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="font-serif text-3xl tracking-tight">Data diri</h2>
                {user.emailVerifiedAt ? <Badge tone="leaf">Email terverifikasi</Badge> : <Badge>Belum diverifikasi</Badge>}
              </div>
              <ProfileForm
                user={{
                  name: user.name,
                  company: user.company ?? "",
                  phone: user.phone ?? "",
                  email: user.email,
                }}
              />
            </div>
            <div className="rounded-card border border-line bg-surface p-6 shadow-card sm:p-8">
              <h2 className="mb-6 font-serif text-3xl tracking-tight">Kata sandi</h2>
              <PasswordForm hasPassword={!!user.passwordHash} />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

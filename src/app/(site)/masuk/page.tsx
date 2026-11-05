import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/forms/login-form";
import { Backdrop } from "@/components/layout/backdrop";
import { Container, Em } from "@/components/ui/section";
import { getCurrentUser, safeNext } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Masuk",
  robots: { index: false, follow: false },
};

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export default async function LoginPage({ searchParams }: PageProps<"/masuk">) {
  const next = safeNext(first((await searchParams).next)) ?? undefined;
  const user = await getCurrentUser();
  if (user) redirect(next ?? (user.role === "admin" ? "/admin" : "/"));

  return (
    <section className="relative isolate overflow-hidden pb-24 pt-14 sm:pt-20">
      <Backdrop />
      <Container>
        <div className="mx-auto max-w-md">
          <h1 className="animate-hero-enter text-center font-serif text-5xl leading-none tracking-tight sm:text-6xl">
            Selamat <Em tone="ink">datang.</Em>
          </h1>
          <p className="mt-4 text-center text-muted">Masuk untuk melanjutkan.</p>
          <div className="mt-8 rounded-card border border-line bg-surface p-6 shadow-prompt sm:p-8">
            <LoginForm next={next} />
          </div>
        </div>
      </Container>
    </section>
  );
}

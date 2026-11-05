import type { ReactNode } from "react";
import { Backdrop } from "@/components/layout/backdrop";
import { Container } from "@/components/ui/section";

/** Centered card layout shared by the account pages. */
export function AuthPage({
  title,
  lead,
  children,
  wide,
}: {
  title: ReactNode;
  lead?: ReactNode;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <section className="relative isolate overflow-hidden pb-24 pt-12 sm:pt-20">
      <Backdrop />
      <Container>
        <div className={wide ? "mx-auto max-w-xl" : "mx-auto max-w-md"}>
          <h1 className="animate-hero-enter text-center font-serif text-5xl leading-none tracking-tight sm:text-6xl">
            {title}
          </h1>
          {lead ? <p className="mt-4 text-center text-muted">{lead}</p> : null}
          <div className="mt-8 rounded-card border border-line bg-surface p-6 shadow-prompt sm:p-8">{children}</div>
        </div>
      </Container>
    </section>
  );
}

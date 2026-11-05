import Link from "next/link";
import type { ReactNode } from "react";
import { logout } from "@/app/actions/auth";
import { OmnityLogo } from "@/components/brand/logo";
import { Icon, type IconName } from "@/components/icon";

const nav: { href: string; label: string; icon: IconName }[] = [
  { href: "/admin", label: "Ringkasan", icon: "layers" },
  { href: "/admin/blog", label: "Blog", icon: "file-text" },
];

/** Plain admin chrome: no marketing navbar or footer. */
export function AdminShell({
  user,
  children,
}: {
  user: { name: string; email: string };
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-canvas lg:grid lg:grid-cols-[15rem_1fr]">
      <aside className="border-b border-line bg-surface lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r">
        <div className="flex h-16 items-center justify-between px-5 lg:h-auto lg:flex-col lg:items-start lg:gap-8 lg:px-6 lg:pt-7">
          <Link href="/admin" aria-label="Admin Omnity">
            <OmnityLogo />
          </Link>
          <nav aria-label="Admin" className="flex gap-1 lg:w-full lg:flex-col">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="inline-flex h-10 items-center gap-2.5 rounded-lg px-3 text-sm font-medium text-ink/75 transition-colors hover:bg-ink/5 hover:text-ink"
              >
                <Icon name={n.icon} className="size-[18px]" />
                {n.label}
              </Link>
            ))}
            <Link
              href="/"
              target="_blank"
              className="inline-flex h-10 items-center gap-2.5 rounded-lg px-3 text-sm font-medium text-ink/75 transition-colors hover:bg-ink/5 hover:text-ink"
            >
              <Icon name="arrow-up-right" className="size-[18px]" />
              Lihat situs
            </Link>
          </nav>
        </div>
        <div className="hidden px-6 pb-6 lg:absolute lg:inset-x-0 lg:bottom-0 lg:block">
          <p className="truncate text-sm font-medium">{user.name}</p>
          <p className="truncate text-xs text-muted">{user.email}</p>
          <form action={logout} className="mt-3">
            <button type="submit" className="text-sm font-medium text-accent hover:underline">
              Keluar
            </button>
          </form>
        </div>
      </aside>
      <main id="main" className="min-w-0 px-5 py-8 sm:px-8 lg:px-12 lg:py-10">
        {children}
        <form action={logout} className="mt-10 lg:hidden">
          <button type="submit" className="text-sm font-medium text-accent hover:underline">
            Keluar ({user.name})
          </button>
        </form>
      </main>
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { OmnityLogo } from "@/components/brand/logo";
import { Icon } from "@/components/icon";
import { Badge } from "@/components/ui/badge";
import { ButtonLink, buttonVariants } from "@/components/ui/button";
import { products } from "@/content/products";
import { services } from "@/content/services";
import { cn } from "@/lib/utils";

export type NavUser = {
  name: string;
  /** unread mockups / quotes, shown as a badge on "Proyek Saya" */
  badge?: number;
} | null;

type MenuKey = "produk" | "layanan";

const plainLinks = [
  { href: "/karya", label: "Karya" },
  { href: "/blog", label: "Blog" },
  { href: "/forum", label: "Forum" },
];

const mainProducts = products.filter((p) => p.slug !== "solusi-ai");
const aiProduct = products.find((p) => p.slug === "solusi-ai")!;

export function Navbar({ user = null }: { user?: NavUser }) {
  const pathname = usePathname();
  const [menu, setMenu] = useState<MenuKey | null>(null);
  const [drawer, setDrawer] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close everything on navigation (reset state while rendering, per React docs).
  const [prevPath, setPrevPath] = useState(pathname);
  if (pathname !== prevPath) {
    setPrevPath(pathname);
    setMenu(null);
    setDrawer(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Escape closes menus; lock page scroll while the drawer is open.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenu(null);
        setDrawer(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = drawer ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawer]);

  const openMenu = useCallback((key: MenuKey) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setMenu(key);
  }, []);
  // Mouse: hover already opened it, so a click keeps it open. Keyboard (detail 0): toggle.
  const onTriggerClick = (key: MenuKey, fromKeyboard: boolean) =>
    setMenu(fromKeyboard && menu === key ? null : key);
  const scheduleClose = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setMenu(null), 140);
  }, []);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  const triggerClass = (key: MenuKey, active: boolean) =>
    cn(
      "inline-flex h-10 items-center gap-1 rounded-lg px-3 text-[0.92rem] font-medium transition-colors",
      menu === key || active
        ? "bg-ink/5 text-ink"
        : "text-ink/75 hover:bg-ink/5 hover:text-ink",
    );

  return (
    <header
      ref={headerRef}
      onMouseLeave={scheduleClose}
      onMouseEnter={() => closeTimer.current && clearTimeout(closeTimer.current)}
      onBlur={(e) => {
        if (!headerRef.current?.contains(e.relatedTarget as Node)) setMenu(null);
      }}
      className={cn(
        "sticky top-0 z-40 transition-[background-color,border-color,box-shadow] duration-300",
        scrolled || menu
          ? "border-b border-line bg-canvas/85 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between gap-6 px-5 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" aria-label="Omnity, ke beranda" className="rounded-lg">
            <OmnityLogo />
          </Link>

          <nav aria-label="Utama" className="hidden items-center gap-0.5 lg:flex">
            <button
              type="button"
              aria-expanded={menu === "produk"}
              aria-haspopup="true"
              aria-controls="menu-produk"
              onMouseEnter={() => openMenu("produk")}
              onClick={(e) => onTriggerClick("produk", e.detail === 0)}
              className={triggerClass("produk", isActive("/produk"))}
            >
              Produk
              <Icon
                name="chevron-down"
                className={cn("size-4 transition-transform", menu === "produk" && "rotate-180")}
              />
            </button>
            <button
              type="button"
              aria-expanded={menu === "layanan"}
              aria-haspopup="true"
              aria-controls="menu-layanan"
              onMouseEnter={() => openMenu("layanan")}
              onClick={(e) => onTriggerClick("layanan", e.detail === 0)}
              className={triggerClass("layanan", isActive("/layanan"))}
            >
              Layanan
              <Icon
                name="chevron-down"
                className={cn("size-4 transition-transform", menu === "layanan" && "rotate-180")}
              />
            </button>
        {/* Mega menus (desktop) */}
        <AnimatePresence>
          {menu ? (
            <motion.div
              key={menu}
              id={`menu-${menu}`}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-x-0 top-full px-5 pt-2 sm:px-6 lg:px-8"
            >
              <div className="mx-auto max-w-[1200px] overflow-hidden rounded-2xl border border-line bg-surface shadow-pop">
                {menu === "produk" ? <ProductMenu /> : <ServiceMenu />}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
            {plainLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onMouseEnter={() => setMenu(null)}
                aria-current={isActive(l.href) ? "page" : undefined}
                className={cn(
                  "inline-flex h-10 items-center rounded-lg px-3 text-[0.92rem] font-medium transition-colors",
                  isActive(l.href)
                    ? "bg-ink/5 text-ink"
                    : "text-ink/75 hover:bg-ink/5 hover:text-ink",
                )}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          {user ? (
            <Link
              href="/proyek"
              className="relative mr-1 inline-flex h-10 items-center gap-2 rounded-lg px-3 text-[0.92rem] font-medium text-ink/75 transition-colors hover:bg-ink/5 hover:text-ink"
            >
              Proyek Saya
              {user.badge ? (
                <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-brand px-1.5 text-[0.7rem] font-semibold leading-5 text-white">
                  {user.badge}
                </span>
              ) : null}
            </Link>
          ) : null}
          <ButtonLink href="/mulai" shape="pill" size="sm" className="h-10 px-5">
            Mulai Proyek
          </ButtonLink>
          {user ? (
            <Link
              href="/profil"
              aria-label={`Akun ${user.name}`}
              className="inline-flex size-10 items-center justify-center rounded-full border border-line bg-surface text-sm font-semibold text-ink transition-colors hover:border-ink/30"
            >
              {user.name.trim().charAt(0).toUpperCase()}
            </Link>
          ) : (
            <ButtonLink
              href="/masuk"
              variant="secondary"
              shape="pill"
              size="sm"
              className="h-10 px-5"
            >
              Masuk
            </ButtonLink>
          )}
        </div>

        <button
          type="button"
          onClick={() => setDrawer(true)}
          aria-label="Buka menu"
          aria-expanded={drawer}
          className="inline-flex size-10 items-center justify-center rounded-lg text-ink transition-colors hover:bg-ink/5 lg:hidden"
        >
          <Icon name="menu" className="size-6" />
        </button>
      </div>

      <MobileDrawer open={drawer} onClose={() => setDrawer(false)} user={user} />
    </header>
  );
}

function MenuItem({
  href,
  icon,
  title,
  desc,
  badge,
}: {
  href: string;
  icon: Parameters<typeof Icon>[0]["name"];
  title: string;
  desc: string;
  badge?: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-sand"
    >
      <span className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-lg border border-line bg-surface text-ink transition-colors group-hover:border-brand/30 group-hover:text-brand">
        <Icon name={icon} className="size-[18px]" />
      </span>
      <span className="min-w-0">
        <span className="flex items-center gap-2 text-sm font-semibold text-ink">
          {title}
          {badge ? <Badge tone="leaf">{badge}</Badge> : null}
        </span>
        <span className="block text-[0.82rem] leading-snug text-muted">{desc}</span>
      </span>
    </Link>
  );
}

function ProductMenu() {
  return (
    <div className="grid grid-cols-[1fr_320px]">
      <div className="p-3">
        <p className="px-3 pb-1 pt-2 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-muted">
          Produk Omnity
        </p>
        <div className="grid grid-cols-2 gap-x-1">
          {mainProducts.map((p) => (
            <MenuItem key={p.slug} href={`/produk/${p.slug}`} icon={p.icon} title={p.name} desc={p.short} />
          ))}
        </div>
      </div>
      <div className="flex flex-col justify-between gap-6 border-l border-line bg-sand p-6">
        <div>
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-muted">
            Solusi AI
          </p>
          <div className="mt-3 flex items-center gap-2">
            <h3 className="font-serif text-2xl text-ink">{aiProduct.name}</h3>
            <Badge tone="leaf">{aiProduct.badge}</Badge>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-muted">{aiProduct.tagline}</p>
          <Link
            href={`/produk/${aiProduct.slug}`}
            className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand hover:underline"
          >
            Lihat use case <Icon name="arrow-right" className="size-4" />
          </Link>
        </div>
        <Link
          href="/produk"
          className={cn(buttonVariants({ variant: "secondary", size: "sm" }), "w-full justify-between")}
        >
          Lihat semua produk <Icon name="arrow-right" className="size-4" />
        </Link>
      </div>
    </div>
  );
}

function ServiceMenu() {
  return (
    <div className="grid grid-cols-[1fr_320px]">
      <div className="p-3">
        <p className="px-3 pb-1 pt-2 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-muted">
          Layanan
        </p>
        <div className="grid grid-cols-2 gap-x-1">
          {services.map((s) => (
            <MenuItem key={s.slug} href={`/layanan/${s.slug}`} icon={s.icon} title={s.name} desc={s.short} />
          ))}
        </div>
      </div>
      <div className="flex flex-col justify-between gap-6 border-l border-line bg-sand p-6">
        <div>
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-muted">
            Belum yakin mulai dari mana?
          </p>
          <h3 className="mt-3 font-serif text-2xl leading-tight text-ink">
            Ngobrol dulu dengan tim kami.
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Konsultasi awal untuk memetakan kebutuhan, risiko, dan langkah berikutnya.
          </p>
        </div>
        <ButtonLink href="/kontak" size="sm" className="w-full justify-between">
          Jadwalkan konsultasi <Icon name="arrow-right" className="size-4" />
        </ButtonLink>
      </div>
    </div>
  );
}

function MobileDrawer({
  open,
  onClose,
  user,
}: {
  open: boolean;
  onClose: () => void;
  user: NavUser;
}) {
  const [section, setSection] = useState<MenuKey | null>(null);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-50 flex flex-col bg-canvas lg:hidden"
        >
          <div className="flex h-16 shrink-0 items-center justify-between border-b border-line px-5">
            <Link href="/" onClick={onClose} aria-label="Omnity, ke beranda">
              <OmnityLogo />
            </Link>
            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup menu"
              className="inline-flex size-10 items-center justify-center rounded-lg hover:bg-ink/5"
            >
              <Icon name="x" className="size-6" />
            </button>
          </div>

          <nav aria-label="Menu seluler" className="flex-1 overflow-y-auto px-5 py-4">
            <Accordion
              label="Produk"
              open={section === "produk"}
              onToggle={() => setSection(section === "produk" ? null : "produk")}
            >
              {products.map((p) => (
                <DrawerLink key={p.slug} href={`/produk/${p.slug}`} onClick={onClose}>
                  {p.name}
                  {p.badge ? <Badge tone="leaf" className="ml-2">{p.badge}</Badge> : null}
                </DrawerLink>
              ))}
              <DrawerLink href="/produk" onClick={onClose} muted>
                Lihat semua produk
              </DrawerLink>
            </Accordion>
            <Accordion
              label="Layanan"
              open={section === "layanan"}
              onToggle={() => setSection(section === "layanan" ? null : "layanan")}
            >
              {services.map((s) => (
                <DrawerLink key={s.slug} href={`/layanan/${s.slug}`} onClick={onClose}>
                  {s.name}
                </DrawerLink>
              ))}
              <DrawerLink href="/layanan" onClick={onClose} muted>
                Semua layanan
              </DrawerLink>
            </Accordion>
            {plainLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={onClose}
                className="flex h-14 items-center border-b border-line font-serif text-2xl text-ink"
              >
                {l.label}
              </Link>
            ))}
            {user ? (
              <Link
                href="/proyek"
                onClick={onClose}
                className="flex h-14 items-center gap-2 border-b border-line font-serif text-2xl text-ink"
              >
                Proyek Saya
                {user.badge ? (
                  <span className="rounded-full bg-brand px-2 text-sm font-semibold text-white">
                    {user.badge}
                  </span>
                ) : null}
              </Link>
            ) : null}
          </nav>

          <div className="shrink-0 space-y-2.5 border-t border-line bg-canvas px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4">
            <ButtonLink href="/mulai" onClick={onClose} size="lg" className="w-full">
              Mulai Proyek
            </ButtonLink>
            {user ? (
              <ButtonLink href="/profil" onClick={onClose} variant="secondary" size="lg" className="w-full">
                Akun saya
              </ButtonLink>
            ) : (
              <ButtonLink href="/masuk" onClick={onClose} variant="secondary" size="lg" className="w-full">
                Masuk
              </ButtonLink>
            )}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function Accordion({
  label,
  open,
  onToggle,
  children,
}: {
  label: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-line">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex h-14 w-full items-center justify-between font-serif text-2xl text-ink"
      >
        {label}
        <Icon
          name="chevron-down"
          className={cn("size-5 text-muted transition-transform", open && "rotate-180")}
        />
      </button>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="flex flex-col pb-3">{children}</div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function DrawerLink({
  href,
  onClick,
  muted,
  children,
}: {
  href: string;
  onClick: () => void;
  muted?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex h-11 items-center rounded-lg px-2 text-[0.98rem]",
        muted ? "font-medium text-brand" : "text-ink/80 hover:bg-ink/5",
      )}
    >
      {children}
    </Link>
  );
}

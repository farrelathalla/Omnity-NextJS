"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Icon } from "@/components/icon";

/** Small confirmation after the email-verification link brings the user back with ?verifikasi=ok. */
export function VerifiedToast() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);
  const show = params.get("verifikasi") === "ok" && !hidden;

  useEffect(() => {
    if (!show) return;
    const t = setTimeout(() => {
      setHidden(true);
      router.replace(pathname, { scroll: false }); // drop the query so a refresh does not repeat it
    }, 6000);
    return () => clearTimeout(t);
  }, [show, router, pathname]);

  if (!show) return null;
  return (
    <div
      role="status"
      className="fixed inset-x-4 top-4 z-[80] mx-auto flex max-w-md items-center gap-3 rounded-xl border border-leaf/25 bg-surface px-4 py-3 text-sm shadow-pop"
    >
      <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-leaf-50 text-leaf">
        <Icon name="check" className="size-4" />
      </span>
      <span>Email Anda terverifikasi. Selamat datang di Omnity!</span>
      <button
        type="button"
        onClick={() => setHidden(true)}
        aria-label="Tutup"
        className="ml-auto text-muted hover:text-ink"
      >
        <Icon name="x" className="size-4" />
      </button>
    </div>
  );
}

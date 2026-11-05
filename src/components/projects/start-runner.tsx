"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { startProject } from "@/app/actions/projects";
import { Container } from "@/components/ui/section";
import { clearStart, readStart } from "@/lib/start-storage";

/** Creates the draft from the stored prompt/template exactly once, then opens the survey. */
export function StartRunner() {
  const router = useRouter();
  const ran = useRef(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (ran.current) return; // React Strict Mode runs effects twice in dev
    ran.current = true;
    const s = readStart();
    startProject({ prompt: s.prompt, template: s.template ?? null })
      .then((res) => {
        if (!res.ok) {
          setError(res.error);
          return;
        }
        clearStart();
        router.replace(`/mulai/survei/${res.id}`);
      })
      .catch(() => setError("Gagal memulai proyek. Coba lagi."));
  }, [router]);

  return (
    <Container className="flex min-h-[50vh] flex-col items-center justify-center gap-4 py-24 text-center">
      {error ? (
        <>
          <p role="alert" className="text-red-700">
            {error}
          </p>
          <Link href="/mulai" className="text-sm font-semibold text-accent hover:underline">
            Kembali
          </Link>
        </>
      ) : (
        <>
          <span className="size-8 animate-spin rounded-full border-2 border-ink/15 border-t-ink" aria-hidden="true" />
          <p className="text-muted" role="status">
            Menyiapkan survei Anda...
          </p>
        </>
      )}
    </Container>
  );
}

"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";

const loading = () => (
  <div className="flex h-full items-center justify-center bg-sand text-sm text-muted">Memuat pratinjau…</div>
);

/** One lazily loaded bundle per demo, so a work page only ships its own demo. */
const demos: Record<string, ComponentType> = {
  "omnipay-console": dynamic(() => import("@/components/work-demos/omnipay-console"), { loading }),
  "c-access": dynamic(() => import("@/components/work-demos/c-access"), { loading }),
  "resort-academy": dynamic(() => import("@/components/work-demos/resort-academy"), { loading }),
  "cleanvy-asalta": dynamic(() => import("@/components/work-demos/cleanvy-asalta"), { loading }),
  cipma: dynamic(() => import("@/components/work-demos/cipma"), { loading }),
  "linggar-audio": dynamic(() => import("@/components/work-demos/linggar-audio"), { loading }),
  lumei: dynamic(() => import("@/components/work-demos/lumei"), { loading }),
  codelearn: dynamic(() => import("@/components/work-demos/codelearn"), { loading }),
  "fun-bpk-2020": dynamic(() => import("@/components/work-demos/fun-bpk-2020"), { loading }),
};

export function WorkDemo({ slug }: { slug: string }) {
  const Demo = demos[slug];
  return Demo ? <Demo /> : null;
}

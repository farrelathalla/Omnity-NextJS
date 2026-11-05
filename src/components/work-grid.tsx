"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/icon";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { Work } from "@/content/works";
import { cn } from "@/lib/utils";

/** Portfolio cards with a category filter. */
export function WorkGrid({ works, categories }: { works: Work[]; categories: string[] }) {
  const [active, setActive] = useState<string>("Semua");
  const shown = active === "Semua" ? works : works.filter((w) => w.category === active);

  return (
    <div>
      <div role="group" aria-label="Filter kategori" className="mb-8 flex flex-wrap gap-2">
        {["Semua", ...categories].map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={active === c}
            onClick={() => setActive(c)}
            className={cn(
              "h-9 rounded-full border px-4 text-sm font-medium transition-colors",
              active === c
                ? "border-ink bg-ink text-white"
                : "border-line bg-surface text-ink/75 hover:border-ink/30 hover:text-ink",
            )}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {shown.map((w, i) => {
          const cover = w.shots[0];
          return (
            <Link key={w.slug} href={`/karya/${w.slug}`} className="group block">
              <Card interactive className="overflow-hidden">
                <div className="relative aspect-[16/10] overflow-hidden border-b border-line bg-sand">
                  <Image
                    src={cover.src}
                    alt={`${w.name}: ${cover.caption}`}
                    width={cover.width}
                    height={cover.height}
                    sizes="(min-width: 768px) 560px, 92vw"
                    quality={75}
                    loading={i < 1 ? "eager" : undefined}
                    fetchPriority={i < 1 ? "high" : undefined}
                    className="h-full w-full object-cover object-top transition-transform duration-700 ease-out-soft group-hover:scale-[1.03]"
                  />
                </div>
                <div className="p-6">
                  <Badge>{w.category}</Badge>
                  <h2 className="mt-3 font-serif text-3xl tracking-tight">{w.name}</h2>
                  <p className="mt-2 line-clamp-3 text-[0.97rem] leading-relaxed text-muted">{w.summary}</p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
                    Lihat sorotan
                    <Icon name="arrow-right" className="size-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

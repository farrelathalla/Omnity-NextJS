"use client";

import Image from "next/image";
import Link from "next/link";
import { useId, useState, type CSSProperties } from "react";
import { Icon } from "@/components/icon";
import { Reveal } from "@/components/motion/reveal";
import { Container, Em, Section, SectionHeader } from "@/components/ui/section";
import { cn } from "@/lib/utils";

/*
 * Client review, quoted verbatim (English original). Staggered entrance is driven by
 * the parent <Reveal>: it sets data-shown="false" only while the card is below the
 * fold, so without JS or with reduced motion everything is simply visible.
 */
const review = {
  client: "Saiga Conservation Alliance",
  short: "SCA",
  project: "Website organisasi konservasi internasional",
  href: "/karya/saiga-conservation",
  photo: "/testimonials/saiga-conservation.webp",
  rating: 5,
  pull: "We have greatly appreciated their collaborative approach and would be happy to work with them again on future projects.",
  paragraphs: [
    "At the Saiga Conservation Alliance (SCA), we have had a very positive experience working with the team to design and build a new website to replace our decade-old site. From the outset, they asked us to share examples of websites we liked and disliked to develop a clear understanding of our preferences and requirements. They held check-in calls and maintained close contact throughout the project, ensuring we had opportunities to discuss progress and any additional needs.",
    "Throughout the project, they have been highly responsive, efficient, and cooperative. We particularly appreciate their willingness to incorporate our ideas and feedback and make adjustments throughout the development process. Their flexibility, quick turnaround times, and commitment to accommodating our requests have been especially valuable.",
    "Our team has limited technical website expertise, and we appreciated their guidance throughout the process. They also built an intuitive, easy-to-use backend tailored to our needs, enabling us to update and manage the site with confidence.",
    "The new website is more user-friendly, visually appealing, and better aligned with our organisation’s identity, objectives, and needs. Overall, we have greatly appreciated their collaborative approach and would be happy to work with them again on future projects.",
  ],
  highlights: [
    "Responsif & cepat",
    "Terbuka pada masukan",
    "Pendampingan non-teknis",
    "Backend mudah dikelola",
  ],
  facts: [
    { value: "5/5", label: "Penilaian keseluruhan" },
    { value: "10+ th", label: "Usia situs lama yang digantikan" },
    { value: "CMS", label: "Backend khusus untuk tim SCA" },
  ],
};

/** Hidden-state classes for children of the <Reveal className="group/t"> wrapper. */
const enter =
  "transition-[opacity,transform,filter] duration-700 ease-out-soft motion-reduce:transition-none group-data-[shown=false]/t:opacity-0 group-data-[shown=false]/t:translate-y-3";
const delay = (ms: number): CSSProperties => ({ transitionDelay: `${ms}ms` });

function Star({ i }: { i: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      style={delay(350 + i * 110)}
      className="size-5 fill-brand transition-[opacity,transform] duration-500 ease-out-soft motion-reduce:transition-none group-data-[shown=false]/t:-rotate-45 group-data-[shown=false]/t:scale-0 group-data-[shown=false]/t:opacity-0"
    >
      <path d="M12 2.6l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.4l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z" />
    </svg>
  );
}

/** H6b: client testimonial (Saiga Conservation Alliance). */
export function TestimonialSection() {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const words = review.pull.split(" ");

  return (
    <Section id="testimoni" className="relative overflow-hidden border-t border-line">
      <div aria-hidden="true" className="bg-dots bg-dots-fade absolute inset-x-0 top-0 -z-10 h-80 opacity-60" />
      <Container>
        <Reveal>
          <SectionHeader
            align="center"
            kicker="Kata klien"
            title={
              <>
                Dikerjakan bersama, <Em>dinilai 5 dari 5.</Em>
              </>
            }
            lead="Ulasan langsung dari Saiga Conservation Alliance, aliansi konservasi internasional yang website-nya kami rancang dan bangun ulang."
          />
        </Reveal>

        <Reveal y={36} className="group/t mt-14">
          <figure className="relative isolate grid overflow-hidden rounded-[1.75rem] bg-ink text-white shadow-card lg:grid-cols-[0.9fr_1.1fr]">
            {/* Ambient glows */}
            <div
              aria-hidden="true"
              className="animate-float absolute -right-24 -top-28 -z-10 size-[28rem] rounded-full bg-[radial-gradient(closest-side,rgb(232_80_30/0.38),transparent)]"
            />
            <div
              aria-hidden="true"
              className="absolute -bottom-40 left-1/3 -z-10 size-[30rem] rounded-full bg-[radial-gradient(closest-side,rgb(59_91_219/0.28),transparent)]"
            />
            <div aria-hidden="true" className="bg-dots absolute inset-0 -z-10 opacity-[0.06] invert" />

            {/* Photo */}
            <div className="relative min-h-[22rem] overflow-hidden sm:min-h-[28rem] lg:min-h-full">
              <Image
                src={review.photo}
                alt="Perwakilan Saiga Conservation Alliance di lapangan saat matahari terbenam"
                fill
                sizes="(min-width: 1024px) 520px, 100vw"
                quality={85}
                className="object-cover object-[72%_40%] transition-transform duration-[1800ms] ease-out-soft motion-reduce:transition-none group-data-[shown=false]/t:scale-110"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-ink/70"
              />

              {/* Floating rating chip */}
              <div
                style={delay(500)}
                className={cn(enter, "absolute left-5 top-5 sm:left-6 sm:top-6")}
              >
                <div className="animate-float flex items-center gap-3 rounded-2xl border border-white/15 bg-ink/55 px-4 py-3 backdrop-blur-md">
                  <span className="font-serif text-3xl leading-none">5.0</span>
                  <span className="flex flex-col gap-1">
                    <span className="flex gap-0.5" aria-hidden="true">
                      {Array.from({ length: 5 }, (_, i) => (
                        <svg key={i} viewBox="0 0 24 24" className="size-3.5 fill-brand">
                          <path d="M12 2.6l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.4l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z" />
                        </svg>
                      ))}
                    </span>
                    <span className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-white/60">
                      Rating klien
                    </span>
                  </span>
                </div>
              </div>

              {/* Client tag */}
              <div style={delay(650)} className={cn(enter, "absolute bottom-5 left-5 right-5 sm:bottom-6 sm:left-6")}>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 py-1.5 pl-1.5 pr-3.5 text-xs font-semibold backdrop-blur-md">
                  <span className="inline-flex size-6 items-center justify-center rounded-full bg-brand text-[0.6rem] tracking-wider">
                    {review.short}
                  </span>
                  saiga-conservation.org
                </span>
              </div>
            </div>

            {/* Quote */}
            <div className="relative flex flex-col px-6 py-10 sm:px-10 sm:py-12 lg:px-14 lg:py-14">
              <span
                aria-hidden="true"
                style={delay(150)}
                className="pointer-events-none absolute right-6 top-2 select-none font-serif text-[10rem] leading-none text-brand/25 transition-[opacity,transform] duration-1000 ease-out-soft motion-reduce:transition-none group-data-[shown=false]/t:-translate-y-6 group-data-[shown=false]/t:opacity-0 sm:right-10 sm:text-[13rem]"
              >
                &ldquo;
              </span>

              <div className="flex items-center gap-1" role="img" aria-label={`Rating ${review.rating} dari 5`}>
                {Array.from({ length: review.rating }, (_, i) => (
                  <Star key={i} i={i} />
                ))}
              </div>

              <blockquote lang="en" className="relative mt-6">
                <p className="font-serif text-[1.7rem] leading-[1.2] tracking-tight sm:text-[2.15rem]">
                  {words.map((w, i) => (
                    <span
                      key={i}
                      style={delay(550 + i * 45)}
                      className="inline-block transition-[opacity,transform,filter] duration-700 ease-out-soft motion-reduce:transition-none group-data-[shown=false]/t:translate-y-2 group-data-[shown=false]/t:opacity-0 group-data-[shown=false]/t:blur-[6px]"
                    >
                      {w}
                      {i < words.length - 1 ? " " : ""}
                    </span>
                  ))}
                </p>

                <div
                  id={panelId}
                  className={cn(
                    "grid transition-[grid-template-rows,opacity] duration-500 ease-out-soft motion-reduce:transition-none",
                    open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                  )}
                  aria-hidden={!open}
                  inert={!open}
                >
                  <div className="overflow-hidden">
                    <div className="mt-7 space-y-4 border-l-2 border-brand/60 pl-5 text-[0.95rem] leading-relaxed text-white/75">
                      {review.paragraphs.map((p) => (
                        <p key={p.slice(0, 24)}>{p}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </blockquote>

              <div style={delay(1100)} className={cn(enter, "mt-6")}>
                <button
                  type="button"
                  onClick={() => setOpen((v) => !v)}
                  aria-expanded={open}
                  aria-controls={panelId}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition-colors hover:text-white"
                >
                  {open ? "Tutup ulasan" : "Baca ulasan lengkap"}
                  <Icon
                    name="chevron-down"
                    className={cn("size-4 transition-transform duration-300", open && "rotate-180")}
                  />
                </button>
                <span className="mt-1 block text-xs text-white/40 sm:ml-3 sm:mt-0 sm:inline">Ulasan asli dalam bahasa Inggris</span>
              </div>

              <ul className="mb-10 mt-7 flex flex-wrap gap-2">
                {review.highlights.map((h, i) => (
                  <li
                    key={h}
                    style={delay(1150 + i * 90)}
                    className="rounded-full border border-white/15 bg-white/[0.06] px-3.5 py-1.5 text-xs font-medium text-white/85 transition-[opacity,transform,background-color] duration-500 ease-out-soft hover:bg-white/[0.12] motion-reduce:transition-none group-data-[shown=false]/t:scale-90 group-data-[shown=false]/t:opacity-0"
                  >
                    {h}
                  </li>
                ))}
              </ul>

              <figcaption
                style={delay(1300)}
                className={cn(
                  enter,
                  "mt-auto flex flex-col gap-4 border-t border-white/10 pt-7 sm:flex-row sm:items-center sm:justify-between",
                )}
              >
                <div>
                  <p className="font-semibold">{review.client} ({review.short})</p>
                  <p className="mt-0.5 text-sm text-white/55">{review.project}</p>
                </div>
                <Link
                  href={review.href}
                  className="group/link inline-flex items-center gap-1.5 self-start rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-brand hover:text-white sm:self-auto"
                >
                  Lihat proyeknya
                  <Icon
                    name="arrow-right"
                    className="size-4 transition-transform duration-300 group-hover/link:translate-x-0.5"
                  />
                </Link>
              </figcaption>
            </div>
          </figure>
        </Reveal>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {review.facts.map((f, i) => (
            <Reveal key={f.label} delay={i * 100}>
              <div className="flex items-baseline gap-3 rounded-card border border-line bg-surface px-5 py-4 shadow-card">
                <p className="font-serif text-3xl tracking-tight text-brand">{f.value}</p>
                <p className="text-sm leading-snug text-muted">{f.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}

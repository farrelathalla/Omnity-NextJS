import { Icon } from "@/components/icon";
import { JsonLd } from "@/components/json-ld";

/** Accessible accordion (native <details>) plus FAQPage structured data. */
export function FaqList({ items }: { items: { q: string; a: string }[] }) {
  return (
    <>
      <div className="divide-y divide-line border-y border-line">
        {items.map((f) => (
          <details key={f.q} className="group py-1">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-4 text-left text-[1.05rem] font-medium text-ink [&::-webkit-details-marker]:hidden">
              {f.q}
              <Icon
                name="chevron-down"
                className="size-5 shrink-0 text-muted transition-transform duration-300 group-open:rotate-180"
              />
            </summary>
            <p className="max-w-2xl pb-5 leading-relaxed text-muted">{f.a}</p>
          </details>
        ))}
      </div>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: items.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }}
      />
    </>
  );
}

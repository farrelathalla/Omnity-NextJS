import { products } from "./products";
import { services } from "./services";

export type Topic = { value: string; label: string };

/** Options for the consultation form. Query `?topik=` pre-selects one. */
export const topics: Topic[] = [
  { value: "umum", label: "Pertanyaan umum" },
  ...services.map((s) => ({ value: s.slug, label: s.name })),
  { value: "mobile", label: "Aplikasi mobile" },
  { value: "solusi", label: "Solusi IT" },
  ...products.map((p) => ({ value: `produk-${p.slug}`, label: `Demo ${p.name}` })),
];

export function topicLabel(value: string) {
  return topics.find((t) => t.value === value)?.label ?? "Pertanyaan umum";
}

export function isTopic(value: string | undefined | null): value is string {
  return !!value && topics.some((t) => t.value === value);
}

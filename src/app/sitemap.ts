import type { MetadataRoute } from "next";
import { products } from "@/content/products";
import { services } from "@/content/services";
import { works } from "@/content/works";
import { siteUrl } from "@/lib/site";

// Phase 4 adds published blog posts here.
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entry = (path: string, priority: number): MetadataRoute.Sitemap[number] => ({
    url: `${siteUrl}${path}`,
    lastModified: now,
    priority,
  });

  return [
    entry("/", 1),
    entry("/produk", 0.9),
    ...products.map((p) => entry(`/produk/${p.slug}`, 0.8)),
    entry("/layanan", 0.9),
    ...services.map((s) => entry(`/layanan/${s.slug}`, 0.8)),
    entry("/karya", 0.8),
    ...works.map((w) => entry(`/karya/${w.slug}`, 0.7)),
    entry("/blog", 0.6),
    entry("/forum", 0.4),
    entry("/mulai", 0.7),
    entry("/tentang", 0.6),
    entry("/journey", 0.5),
    entry("/karier", 0.4),
    entry("/kontak", 0.7),
    entry("/privasi", 0.2),
    entry("/syarat", 0.2),
  ];
}

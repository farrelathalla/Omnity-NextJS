import type { MetadataRoute } from "next";
import { isStaging, siteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  // Staging must stay out of search engines while the legacy site is the live one.
  if (isStaging) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/proyek", "/profil", "/api", "/masuk", "/styleguide"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}

import type { NextConfig } from "next";

// Caching: we deliberately use the classic model (no Cache Components). The app
// is mostly dynamic (sessions, dashboards, DB) and marketing pages are static
// by default. See PLAN.md section 3.

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
];

const isStaging = process.env.SITE_ENV === "staging";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  experimental: {
    // Shared hosting exposes dozens of cores but little memory: Next's default (one
    // prerender worker per core, 55 on Hostinger) is killed with SIGABRT. Keep it small.
    cpus: Number(process.env.BUILD_CPUS) || 2,
  },
  images: {
    // WebP only: AVIF encoding on first request is slow and CPU-heavy on shared hosting.
    formats: ["image/webp"],
    // Next 16 only serves qualities listed here (anything else is HTTP 400).
    qualities: [60, 75, 85],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          ...securityHeaders,
          // Staging must never be indexed while the legacy site is the live one.
          ...(isStaging
            ? [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" }]
            : []),
        ],
      },
      {
        source: "/work/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;

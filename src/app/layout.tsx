import type { Metadata, Viewport } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import { JsonLd } from "@/components/json-ld";
import { StagingBadge } from "@/components/layout/staging-badge";
import { MotionProvider } from "@/components/motion/provider";
import { isStaging, site, siteUrl } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Omnity | Solusi digital, produk, dan website untuk bisnis Anda",
    template: "%s | Omnity",
  },
  description: site.tagline,
  applicationName: "Omnity",
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "Omnity",
  },
  robots: isStaging ? { index: false, follow: false } : undefined,
};

export const viewport: Viewport = {
  themeColor: "#fafaf7",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className={`${inter.variable} ${instrument.variable}`}>
      <body>
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[70] focus:rounded-lg focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
        >
          Lewati ke konten
        </a>
        <MotionProvider>
          {children}
        </MotionProvider>
        <StagingBadge />
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Organization",
            name: site.legalName,
            alternateName: "Omnity",
            url: siteUrl,
            logo: `${siteUrl}/brand/omnity-mark.svg`,
            email: site.email,
            address: {
              "@type": "PostalAddress",
              streetAddress: `${site.address.line1}, ${site.address.line2}`,
              addressLocality: "Jakarta",
              postalCode: "12190",
              addressCountry: "ID",
            },
          }}
        />
      </body>
    </html>
  );
}

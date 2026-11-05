import type { ReactNode } from "react";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";

/**
 * Public-site chrome: announcement bar, navbar, page "sheet", and the sticky
 * footer that the sheet slides away from. The night background shows through
 * the sheet's rounded bottom corners.
 */
export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="bg-night">
      <div className="relative z-10 rounded-b-[1.75rem] bg-canvas shadow-[0_30px_60px_-30px_rgb(0_0_0/0.35)] reveal:rounded-b-[2.5rem]">
        <AnnouncementBar />
        <Navbar />
        <main id="main">{children}</main>
      </div>
      <Footer />
    </div>
  );
}

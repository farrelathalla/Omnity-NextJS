import { isStaging } from "@/lib/site";

/** Shown only when SITE_ENV=staging, so nobody mistakes the preview for the live site. */
export function StagingBadge() {
  if (!isStaging) return null;
  return (
    <div className="pointer-events-none fixed bottom-3 left-3 z-[60] rounded-full bg-ink px-3 py-1.5 text-[0.7rem] font-semibold uppercase tracking-wider text-white shadow-pop">
      Pratinjau staging
    </div>
  );
}

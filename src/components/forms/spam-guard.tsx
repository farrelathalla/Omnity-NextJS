"use client";

import { useEffect, useState } from "react";

/**
 * Invisible anti-bot fields: a honeypot (humans never see or fill it) and a
 * fill-time stamp set in the browser. The stamp is controlled state because React
 * resets uncontrolled hidden inputs after a server round trip.
 */
export function SpamGuard() {
  const [t, setT] = useState(0);
  useEffect(() => {
    const id = requestAnimationFrame(() => setT(Date.now()));
    return () => cancelAnimationFrame(id);
  }, []);
  return (
    <>
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <input type="hidden" name="t" value={t} readOnly />
    </>
  );
}

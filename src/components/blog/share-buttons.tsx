"use client";

import { useState } from "react";
import { Icon } from "@/components/icon";

const btn =
  "inline-flex h-9 items-center gap-1.5 rounded-full border border-line bg-surface px-3.5 text-sm font-medium text-ink/80 transition-colors hover:border-ink/30 hover:text-ink";

/** Copy link + share intents (no third-party scripts). */
export function ShareButtons({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Salin tautan ini:", url);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2" aria-label="Bagikan artikel" role="group">
      <span className="mr-1 text-sm text-muted">Bagikan</span>
      <button type="button" onClick={copy} className={btn}>
        <Icon name={copied ? "check" : "link"} className="size-4" />
        {copied ? "Tersalin" : "Salin tautan"}
      </button>
      <a className={btn} target="_blank" rel="noopener noreferrer" href={`https://wa.me/?text=${t}%20${u}`}>
        WhatsApp
      </a>
      <a
        className={btn}
        target="_blank"
        rel="noopener noreferrer"
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${u}`}
      >
        LinkedIn
      </a>
      <a
        className={btn}
        target="_blank"
        rel="noopener noreferrer"
        href={`https://twitter.com/intent/tweet?url=${u}&text=${t}`}
      >
        X
      </a>
    </div>
  );
}

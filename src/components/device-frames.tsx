import Image from "next/image";
import { cn } from "@/lib/utils";

/** Desktop screenshot inside a minimal browser window. */
export function BrowserFrame({
  src,
  alt,
  host,
  width,
  height,
  sizes = "(min-width: 1024px) 1100px, 100vw",
  priority,
  className,
}: {
  src: string;
  alt: string;
  host: string;
  width: number;
  height: number;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-line bg-surface shadow-pop",
        className,
      )}
    >
      <div className="flex h-9 items-center gap-3 border-b border-line bg-sand px-3.5">
        <span aria-hidden="true" className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-ink/15" />
          <span className="size-2.5 rounded-full bg-ink/15" />
          <span className="size-2.5 rounded-full bg-ink/15" />
        </span>
        <span className="mx-auto max-w-[60%] truncate rounded-md bg-surface px-3 py-0.5 text-[0.7rem] text-muted">
          {host}
        </span>
        <span className="w-10" aria-hidden="true" />
      </div>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        loading={priority ? "eager" : undefined}
        fetchPriority={priority ? "high" : undefined}
        quality={85}
        className="block h-auto w-full"
      />
    </div>
  );
}

/** Mobile screenshot inside a phone bezel. */
export function PhoneFrame({
  src,
  alt,
  width,
  height,
  className,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[2rem] border-[6px] border-ink bg-ink shadow-pop",
        className,
      )}
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes="260px"
        quality={85}
        className="block h-auto w-full rounded-[1.5rem]"
      />
    </div>
  );
}

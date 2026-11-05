import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/** Readable long-form text (legal pages, articles). ~680px measure. */
export function Prose({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "mx-auto max-w-[680px] text-[1.02rem] leading-[1.8] text-ink/85",
        "[&_h2]:mb-3 [&_h2]:mt-12 [&_h2]:font-serif [&_h2]:text-3xl [&_h2]:leading-tight [&_h2]:tracking-tight [&_h2]:text-ink",
        "[&_h3]:mb-2 [&_h3]:mt-8 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-ink",
        "[&_p]:my-4 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-6 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:space-y-1.5 [&_ol]:pl-6",
        "[&_a]:font-medium [&_a]:text-accent [&_a]:underline [&_a]:underline-offset-2",
        "[&_blockquote]:my-6 [&_blockquote]:border-l-2 [&_blockquote]:border-brand [&_blockquote]:pl-5 [&_blockquote]:font-serif [&_blockquote]:text-2xl [&_blockquote]:italic [&_blockquote]:text-ink",
        "[&_img]:my-8 [&_img]:h-auto [&_img]:w-full [&_img]:rounded-xl",
        className,
      )}
      {...props}
    />
  );
}

import { cn } from "@/lib/utils";

/**
 * Miniature wireframe of a template's layout (decorative; marked aria-hidden).
 * Honest on purpose: these are structure sketches, not finished designs.
 */
export function TemplatePreview({ id, className }: { id: string; className?: string }) {
  const bar = "rounded-full bg-ink/15";
  const block = "rounded-md bg-ink/[0.07]";
  const accent = "rounded-md bg-brand/80";

  return (
    <div
      aria-hidden="true"
      className={cn(
        "flex aspect-[4/3] flex-col overflow-hidden rounded-lg border border-line bg-surface",
        className,
      )}
    >
      {/* browser bar + nav */}
      <div className="flex h-5 shrink-0 items-center gap-1 border-b border-line bg-sand px-2">
        <span className="size-1.5 rounded-full bg-ink/15" />
        <span className="size-1.5 rounded-full bg-ink/15" />
        <span className="size-1.5 rounded-full bg-ink/15" />
        <span className={cn(bar, "ml-auto h-1 w-10")} />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-2.5">
        <div className="flex items-center gap-1.5">
          <span className={cn(accent, "h-2 w-5")} />
          <span className={cn(bar, "ml-auto h-1 w-4")} />
          <span className={cn(bar, "h-1 w-4")} />
          <span className={cn(bar, "h-1 w-4")} />
        </div>

        {id === "retail-fnb" ? (
          <>
            <div className={cn(block, "h-9 w-full")} />
            <div className="grid flex-1 grid-cols-3 gap-1.5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-1">
                  <span className={cn(block, "flex-1")} />
                  <span className={cn(bar, "h-1 w-3/4")} />
                </div>
              ))}
            </div>
          </>
        ) : id === "jasa-profesional" ? (
          <>
            <div className="flex gap-2">
              <div className="flex flex-1 flex-col justify-center gap-1.5">
                <span className={cn(bar, "h-2 w-4/5")} />
                <span className={cn(bar, "h-1 w-3/5")} />
                <span className={cn(accent, "mt-1 h-3 w-8")} />
              </div>
              <span className={cn(block, "h-12 w-14")} />
            </div>
            <div className="flex flex-1 items-end justify-around">
              {Array.from({ length: 4 }).map((_, i) => (
                <span key={i} className="flex flex-col items-center gap-1">
                  <span className="size-5 rounded-full bg-ink/10" />
                  <span className={cn(bar, "h-1 w-6")} />
                </span>
              ))}
            </div>
          </>
        ) : id === "manufaktur-b2b" ? (
          <>
            <div className={cn(block, "h-8 w-full")} />
            <div className="grid flex-1 grid-cols-2 gap-1.5">
              {Array.from({ length: 4 }).map((_, i) => (
                <span key={i} className="flex items-center gap-1.5 rounded-md border border-line p-1.5">
                  <span className={cn(accent, "size-3")} />
                  <span className={cn(bar, "h-1 flex-1")} />
                </span>
              ))}
            </div>
            <div className="flex justify-between">
              {Array.from({ length: 4 }).map((_, i) => (
                <span key={i} className={cn(bar, "h-1.5 w-7")} />
              ))}
            </div>
          </>
        ) : id === "pendidikan" ? (
          <>
            <div className="flex gap-2">
              <span className={cn(block, "h-10 flex-1")} />
              <span className={cn(accent, "h-10 w-10")} />
            </div>
            <div className="grid flex-1 grid-cols-3 gap-1.5">
              {Array.from({ length: 3 }).map((_, i) => (
                <span key={i} className="flex flex-col gap-1 rounded-md border border-line p-1.5">
                  <span className={cn(bar, "h-1 w-2/3")} />
                  <span className={cn(bar, "h-1 w-full")} />
                  <span className={cn(bar, "h-1 w-4/5")} />
                </span>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col items-center gap-1.5 py-2">
              <span className={cn(bar, "h-2 w-2/3")} />
              <span className={cn(bar, "h-1 w-1/2")} />
              <span className={cn(accent, "mt-1 h-3 w-9")} />
            </div>
            <div className="grid flex-1 grid-cols-3 gap-1.5">
              {Array.from({ length: 3 }).map((_, i) => (
                <span key={i} className={cn(block, "h-full")} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

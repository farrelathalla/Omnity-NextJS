import { Icon } from "@/components/icon";
import { WorkDemo } from "@/components/work/work-demo";
import type { Work } from "@/content/works";

/**
 * Browser window (or wide stage for phone apps) holding an interactive demo.
 * The inner box is a CSS container with a fixed size: 16:10 on large screens
 * so captures match the 1600x1000 screenshots, a fixed height on phones.
 */
export function DemoStage({ work }: { work: Work & { demo: NonNullable<Work["demo"]> } }) {
  const { demo } = work;
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-surface shadow-pop">
      <div className="flex h-9 items-center gap-3 border-b border-line bg-sand px-3.5">
        <span aria-hidden="true" className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-ink/15" />
          <span className="size-2.5 rounded-full bg-ink/15" />
          <span className="size-2.5 rounded-full bg-ink/15" />
        </span>
        <span className="mx-auto flex max-w-[60%] items-center gap-1.5 truncate rounded-md bg-surface px-3 py-0.5 text-[0.7rem] text-muted">
          <Icon name={demo.frame === "phone" ? "smartphone" : "globe"} className="size-3 shrink-0" />
          <span className="truncate">{demo.host}</span>
        </span>
        <span className="hidden items-center gap-1 rounded-full bg-brand-50 px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wider text-accent sm:inline-flex">
          <Icon name="sparkles" className="size-3" />
          Interaktif
        </span>
      </div>
      <div
        data-demo-viewport
        className="@container relative h-[640px] w-full overflow-hidden lg:aspect-[16/10] lg:h-auto"
      >
        <WorkDemo slug={work.slug} />
      </div>
    </div>
  );
}

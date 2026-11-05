import { Icon } from "@/components/icon";
import { Badge } from "@/components/ui/badge";
import {
  PIPELINE,
  STATUS_LABEL,
  STATUS_TONE,
  pipelineIndex,
  type ProjectStatus,
} from "@/lib/project-status";
import { cn } from "@/lib/utils";

export function StatusBadge({ status }: { status: ProjectStatus }) {
  return <Badge tone={STATUS_TONE[status]}>{STATUS_LABEL[status]}</Badge>;
}

/** Horizontal stepper for the happy path; revision and cancelled are shown as a note. */
export function StatusStepper({ status }: { status: ProjectStatus }) {
  if (status === "draft") return null;
  const current = status === "cancelled" ? -1 : pipelineIndex(status);

  return (
    <div>
      <ol className="flex gap-1 overflow-x-auto pb-1 scrollbar-none" aria-label="Tahapan proyek">
        {PIPELINE.map((s, i) => {
          const done = i < current || (status === "completed" && i === current);
          const active = i === current && status !== "completed";
          return (
            <li
              key={s}
              aria-current={active ? "step" : undefined}
              className={cn(
                "flex min-w-[8.2rem] flex-1 flex-col gap-2 rounded-xl border p-3 text-sm",
                done && "border-leaf/30 bg-leaf-50",
                active && "border-ink bg-surface shadow-card",
                !done && !active && "border-line bg-surface/60 text-muted",
              )}
            >
              <span
                className={cn(
                  "inline-flex size-6 items-center justify-center rounded-full text-xs font-semibold",
                  done ? "bg-leaf text-white" : active ? "bg-ink text-white" : "bg-ink/10 text-ink/60",
                )}
              >
                {done ? <Icon name="check" className="size-3.5" strokeWidth={2.5} /> : i + 1}
              </span>
              <span className={cn("leading-snug", active && "font-semibold text-ink")}>{STATUS_LABEL[s]}</span>
            </li>
          );
        })}
      </ol>
      {status === "revision_requested" ? (
        <p className="mt-3 text-sm text-muted">Revisi sedang dikerjakan; mockup baru akan diunggah ke tab Mockup.</p>
      ) : null}
      {status === "cancelled" ? <p className="mt-3 text-sm text-muted">Proyek ini dibatalkan.</p> : null}
    </div>
  );
}

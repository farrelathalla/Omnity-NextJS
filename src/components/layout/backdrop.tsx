import { cn } from "@/lib/utils";

/**
 * Hero backdrop: faint dot grid fading out downward, plus soft orange and blue
 * radial glows in the corners. Purely decorative, sits behind content.
 */
export function Backdrop({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 overflow-hidden [mask-image:linear-gradient(to_bottom,#000_62%,transparent)]",
        className,
      )}
    >
      <div className="bg-dots bg-dots-fade absolute inset-0" />
      <div className="absolute -right-24 -top-32 size-[34rem] rounded-full bg-[radial-gradient(closest-side,rgb(232_80_30/0.22),transparent)] blur-2xl sm:size-[44rem]" />
      <div className="absolute -left-32 top-[28rem] size-[30rem] rounded-full bg-[radial-gradient(closest-side,rgb(59_91_219/0.14),transparent)] blur-2xl sm:size-[40rem]" />
    </div>
  );
}

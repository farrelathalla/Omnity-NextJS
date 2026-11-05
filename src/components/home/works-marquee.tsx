import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/icon";
import { Marquee } from "@/components/motion/marquee";
import { Container } from "@/components/ui/section";
import { marqueeRows } from "@/content/works";
import { cn } from "@/lib/utils";

type Tile = ReturnType<typeof marqueeRows>[number][number];

function WorkTile({ tile }: { tile: Tile }) {
  const mobile = tile.kind === "mobile";
  return (
    <Link
      href={`/karya/${tile.workSlug}`}
      aria-label={`${tile.workName}: ${tile.caption}`}
      className={cn(
        "group relative block h-40 shrink-0 overflow-hidden rounded-xl border border-line bg-surface shadow-card transition-[transform,box-shadow] duration-300 ease-out-soft hover:-translate-y-0.5 hover:shadow-card-hover sm:h-48 lg:h-56",
        mobile ? "aspect-[390/844]" : "aspect-[16/10]",
      )}
    >
      <Image
        src={tile.src}
        alt=""
        width={tile.width}
        height={tile.height}
        sizes={mobile ? "160px" : "480px"}
        quality={85}
        className="h-full w-full object-cover object-top"
      />
      <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/70 to-transparent px-3 pb-2.5 pt-8 text-xs font-medium text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        {tile.workName}
      </span>
    </Link>
  );
}

/** H2: two rows of work screenshots drifting in opposite directions. */
export function WorksMarquee() {
  const [row1, row2] = marqueeRows();
  const mask = "[mask-image:linear-gradient(to_right,transparent,#000_6%,#000_94%,transparent)]";

  return (
    <section aria-label="Galeri karya" className="pb-6 sm:pb-10">
      <Container className="mb-6 flex items-end justify-between gap-4">
        <p className="text-sm text-muted">Ini beberapa karya yang pernah kami buat.</p>
        <Link
          href="/karya"
          className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-accent hover:underline"
        >
          Lihat semua karya <Icon name="arrow-right" className="size-4" />
        </Link>
      </Container>
      <div className="space-y-4">
        <Marquee direction="left" duration={130} className={mask}>
          {row1.map((t) => (
            <WorkTile key={t.src} tile={t} />
          ))}
        </Marquee>
        <Marquee direction="right" duration={140} className={mask}>
          {row2.map((t) => (
            <WorkTile key={t.src} tile={t} />
          ))}
        </Marquee>
      </div>
    </section>
  );
}

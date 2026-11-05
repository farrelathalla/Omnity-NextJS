import { readStored } from "@/lib/storage";

const TYPES: Record<string, string> = {
  webp: "image/webp",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
};

/** Serves public uploads (blog images). File names are random, so they are cached for a year. */
export async function GET(_req: Request, ctx: RouteContext<"/uploads/[...path]">) {
  const { path } = await ctx.params;
  const rel = path.join("/");
  const ext = rel.split(".").pop()?.toLowerCase() ?? "";
  if (!TYPES[ext] || rel.includes("..")) return new Response("Not found", { status: 404 });

  const file = await readStored(rel);
  if (!file) return new Response("Not found", { status: 404 });

  return new Response(new Uint8Array(file), {
    headers: {
      "Content-Type": TYPES[ext],
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

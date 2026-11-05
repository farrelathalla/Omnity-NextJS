import sanitizeHtml from "sanitize-html";

/**
 * Allowlist for blog HTML (the editor's output). Admins write it, but it is
 * still sanitised on save: stored content is rendered to every visitor.
 */
export function sanitizePostHtml(html: string) {
  return sanitizeHtml(html, {
    allowedTags: [
      "p", "h2", "h3", "h4", "strong", "em", "u", "s", "ul", "ol", "li", "blockquote",
      "a", "img", "br", "hr", "code", "pre", "figure", "figcaption",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
      img: ["src", "alt", "width", "height", "loading"],
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowedSchemesByTag: { img: ["https"] },
    // Relative images are only accepted from our own upload route.
    exclusiveFilter: (frame) =>
      frame.tag === "img" &&
      !(frame.attribs.src?.startsWith("/uploads/") || frame.attribs.src?.startsWith("https://")),
    transformTags: {
      a: (tagName, attribs) => {
        const external = /^https?:\/\//.test(attribs.href ?? "");
        return {
          tagName,
          attribs: {
            ...attribs,
            ...(external ? { target: "_blank", rel: "noopener noreferrer" } : {}),
          },
        };
      },
      img: (tagName, attribs) => ({ tagName, attribs: { ...attribs, loading: "lazy" } }),
    },
    allowProtocolRelative: false,
  });
}

export function plainText(html: string) {
  // Put a space where block elements end, otherwise "</p><h2>" would glue words together.
  const spaced = html.replace(/<\/(p|h[1-6]|li|blockquote|div|figure)>|<br\s*\/?>/gi, " ");
  return sanitizeHtml(spaced, { allowedTags: [], allowedAttributes: {} })
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

/** Excerpt from the first real paragraph (brief: "otomatis dari paragraf pertama"), cut at a word boundary. */
export function makeExcerpt(html: string, max = 180) {
  const firstP = /<p[^>]*>([\s\S]*?)<\/p>/i.exec(html)?.[1];
  const fromP = firstP ? plainText(firstP) : "";
  const text = fromP.length >= 40 ? fromP : plainText(html);
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return `${cut.slice(0, cut.lastIndexOf(" ") > 80 ? cut.lastIndexOf(" ") : max).trim()}...`;
}

export function readingMinutes(html: string) {
  const words = plainText(html).split(" ").filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export { slugify } from "./slug";

import "server-only";
import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import type { Project, Quote, User } from "@/db/schema";
import { computeTotals, formatRupiah, parseItems } from "@/lib/quote";
import { site } from "@/lib/site";
import { formatDateId } from "@/lib/utils";

const INK = rgb(0.055, 0.071, 0.125);
const MUTED = rgb(0.42, 0.45, 0.5);
const LINE = rgb(0.9, 0.91, 0.92);
const BRAND = rgb(0.91, 0.31, 0.12);

/** Standard PDF fonts only cover WinAnsi: map common punctuation, drop what cannot be drawn. */
const safe = (s: string) =>
  s
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—]/g, "-")
    .replace(/…/g, "...")
    .replace(/ /g, " ")
    .replace(/[^\u0009\u000a -ÿ]/g, "?");

function wrap(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const lines: string[] = [];
  for (const para of safe(text).split("\n")) {
    let line = "";
    for (const word of para.split(/\s+/).filter(Boolean)) {
      const test = line ? `${line} ${word}` : word;
      if (font.widthOfTextAtSize(test, size) <= maxWidth) line = test;
      else {
        if (line) lines.push(line);
        line = word;
      }
    }
    lines.push(line);
  }
  return lines;
}

/** A4 quotation PDF, generated on demand (nothing is stored). */
export async function buildQuotePdf(args: { quote: Quote; project: Project; customer: User }) {
  const { quote, project, customer } = args;
  const items = parseItems(quote.items);
  const t = computeTotals(items, quote.discount, quote.dpPercent);

  const pdf = await PDFDocument.create();
  pdf.setTitle(`Penawaran ${project.title}`);
  pdf.setAuthor(site.legalName);
  const reg = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

  const W = 595.28;
  const H = 841.89;
  const M = 48;
  let page: PDFPage = pdf.addPage([W, H]);
  let y = H - M;

  const ensure = (need: number) => {
    if (y - need < M + 24) {
      page = pdf.addPage([W, H]);
      y = H - M;
    }
  };
  const text = (s: string, x: number, size = 10, font = reg, color = INK) =>
    page.drawText(safe(s), { x, y, size, font, color });
  const right = (s: string, xRight: number, size = 10, font = reg, color = INK) => {
    const str = safe(s);
    page.drawText(str, { x: xRight - font.widthOfTextAtSize(str, size), y, size, font, color });
  };
  const rule = () => page.drawLine({ start: { x: M, y }, end: { x: W - M, y }, thickness: 0.6, color: LINE });
  const paragraph = (s: string, size = 10, color = INK, gap = 14) => {
    for (const ln of wrap(s, reg, size, W - 2 * M)) {
      ensure(gap);
      text(ln, M, size, reg, color);
      y -= gap;
    }
  };

  // header
  text("OMNITY", M, 13, bold);
  right("PENAWARAN", W - M, 13, bold, BRAND);
  y -= 16;
  text(site.legalName, M, 9, reg, MUTED);
  right(`No. ${project.id.slice(0, 8).toUpperCase()}-v${quote.version}`, W - M, 9, reg, MUTED);
  y -= 12;
  text(`${site.address.line1}, ${site.address.line2}, ${site.address.city}`, M, 9, reg, MUTED);
  right(`Tanggal ${formatDateId(quote.sentAt ?? quote.createdAt)}`, W - M, 9, reg, MUTED);
  y -= 12;
  text(site.email, M, 9, reg, MUTED);
  if (quote.validUntil) right(`Berlaku sampai ${formatDateId(quote.validUntil)}`, W - M, 9, reg, MUTED);
  y -= 22;
  rule();
  y -= 24;

  // parties
  text("UNTUK", M, 8, bold, MUTED);
  text("PROYEK", M + 280, 8, bold, MUTED);
  y -= 14;
  text(customer.name, M, 11, bold);
  text(project.title || "Proyek website", M + 280, 11, bold);
  y -= 14;
  text(customer.company ?? "-", M, 10, reg, MUTED);
  text("Pembuatan website (Design Anything)", M + 280, 10, reg, MUTED);
  y -= 13;
  text(customer.email, M, 10, reg, MUTED);
  y -= 30;

  // items table
  const col = { no: M, desc: M + 26, qty: W - M - 190, price: W - M - 100, amount: W - M };
  const header = () => {
    text("No", col.no, 8, bold, MUTED);
    text("DESKRIPSI", col.desc, 8, bold, MUTED);
    right("JML", col.qty + 24, 8, bold, MUTED);
    right("HARGA", col.price + 12, 8, bold, MUTED);
    right("TOTAL", col.amount, 8, bold, MUTED);
    y -= 8;
    rule();
    y -= 16;
  };
  header();
  items.forEach((it, i) => {
    const detail = it.detail ? wrap(it.detail, reg, 9, col.qty - col.desc - 20) : [];
    const label = wrap(it.label, bold, 10, col.qty - col.desc - 20);
    ensure(14 * (label.length + detail.length) + 16);
    text(String(i + 1), col.no, 10, reg, MUTED);
    right(String(it.qty), col.qty + 24, 10);
    right(formatRupiah(it.unitPrice), col.price + 12, 10);
    right(formatRupiah(it.qty * it.unitPrice), col.amount, 10);
    for (const ln of label) {
      text(ln, col.desc, 10, bold);
      y -= 13;
    }
    for (const ln of detail) {
      text(ln, col.desc, 9, reg, MUTED);
      y -= 12;
    }
    y -= 4;
    rule();
    y -= 14;
  });

  // totals
  const totalRow = (label: string, value: string, strong = false) => {
    ensure(18);
    text(label, W - M - 230, strong ? 11 : 10, strong ? bold : reg, strong ? INK : MUTED);
    right(value, W - M, strong ? 11 : 10, strong ? bold : reg);
    y -= strong ? 18 : 15;
  };
  y -= 4;
  totalRow("Subtotal", formatRupiah(t.subtotal));
  if (t.discount > 0) totalRow("Diskon", `- ${formatRupiah(t.discount)}`);
  totalRow("Total", formatRupiah(t.total), true);
  totalRow(`DP ${quote.dpPercent}% (saat setuju)`, formatRupiah(t.dpAmount));
  totalRow("Pelunasan (sebelum website live)", formatRupiah(t.remaining));
  y -= 14;

  // scope and conditions
  const block = (title: string, body: string) => {
    if (!body.trim()) return;
    ensure(40);
    text(title.toUpperCase(), M, 8, bold, MUTED);
    y -= 14;
    paragraph(body);
    y -= 8;
  };
  block("Cakupan", quote.scope ?? "");
  block("Revisi", `${quote.revisions} kali revisi sudah termasuk.`);
  block("Domain & hosting", quote.domainHosting || "Tidak termasuk, tersedia sebagai tambahan opsional.");
  block("Estimasi waktu", quote.timeline);
  block("Syarat & ketentuan", quote.terms ?? "");

  // footer on every page
  const pages = pdf.getPages();
  pages.forEach((p, i) => {
    p.drawText(safe(`${site.legalName} | ${site.email}`), { x: M, y: 28, size: 8, font: reg, color: MUTED });
    const label = `${i + 1} / ${pages.length}`;
    p.drawText(label, { x: W - M - reg.widthOfTextAtSize(label, 8), y: 28, size: 8, font: reg, color: MUTED });
  });

  return pdf.save();
}

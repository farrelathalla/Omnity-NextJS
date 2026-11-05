/**
 * CSV helpers. Cells that start with = + - @ (or tab/CR) are prefixed with an apostrophe so a
 * spreadsheet never evaluates user-supplied text as a formula ("CSV injection").
 */
export function csvCell(v: unknown): string {
  let s = v == null ? "" : v instanceof Date ? v.toISOString() : String(v);
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
}

export function toCsv(header: string[], rows: unknown[][]): string {
  // BOM so Excel opens UTF-8 (Indonesian names) correctly.
  return "﻿" + [header, ...rows].map((r) => r.map(csvCell).join(",")).join("\r\n") + "\r\n";
}

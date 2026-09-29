import { WEDDING_TIME_ZONE } from "@/config/defaults";
import type { Locale } from "@/types";

/** Long wedding date in the venue's time zone, e.g. "October 8, 2026". */
export function formatWeddingDate(iso: string, locale: Locale): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-EG" : "en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: WEDDING_TIME_ZONE,
  }).format(date);
}

/** Compact dotted date for ornaments, e.g. "08 · 10 · 2026". */
export function formatShortDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const parts = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: WEDDING_TIME_ZONE,
  }).formatToParts(date);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return `${get("day")} · ${get("month")} · ${get("year")}`;
}

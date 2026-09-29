import { DEFAULT_SETTINGS } from "@/config/defaults";
import type { ModerationStatus, SectionToggles, Settings } from "@/types";

const STATUSES: readonly ModerationStatus[] = [
  "pending",
  "approved",
  "rejected",
];
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const LIMITS = { name: 80, message: 1000, link: 500, setting: 2000 };

export class BadRequest extends Error {}

export function isUuid(id: string): boolean {
  return UUID_RE.test(id);
}

export function parseStatus(value: unknown): ModerationStatus {
  if (STATUSES.includes(value as ModerationStatus)) {
    return value as ModerationStatus;
  }
  throw new BadRequest("Invalid status");
}

/** Trimmed string, required unless `optional`, capped at `max` characters. */
export function text(
  value: unknown,
  max: number,
  { optional = false } = {}
): string {
  const s = typeof value === "string" ? value.trim() : "";
  if (!s && !optional) throw new BadRequest("Missing field");
  if (s.length > max) throw new BadRequest("Field too long");
  return s;
}

/** Keeps only known settings keys with the right types. */
export function sanitizeSettings(input: unknown): Settings {
  const src = (input && typeof input === "object" ? input : {}) as Record<
    string,
    unknown
  >;
  const out: Settings = {
    ...DEFAULT_SETTINGS,
    sections: { ...DEFAULT_SETTINGS.sections },
  };
  for (const key of Object.keys(DEFAULT_SETTINGS) as (keyof Settings)[]) {
    if (key === "sections") continue;
    const v = src[key];
    if (typeof v === "string") {
      (out as unknown as Record<string, string>)[key] = v.slice(
        0,
        LIMITS.setting
      );
    }
  }
  const sections = src.sections as Partial<SectionToggles> | undefined;
  if (sections && typeof sections === "object") {
    for (const key of Object.keys(out.sections) as (keyof SectionToggles)[]) {
      if (typeof sections[key] === "boolean") out.sections[key] = sections[key];
    }
  }
  return out;
}

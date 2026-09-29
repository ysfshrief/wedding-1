import { DEFAULT_SETTINGS } from "@/config/defaults";
import type {
  GalleryItem,
  GuestMessage,
  ModerationStatus,
  Settings,
  VideoLink,
} from "@/types";
import { getDb } from "./db";
import { sanitizeSettings } from "./validate";

export class DbUnavailable extends Error {}

async function requireDb() {
  const sql = await getDb();
  if (!sql) throw new DbUnavailable("Database is not configured");
  return sql;
}

type Row = Record<string, unknown>;

const toMessage = (r: Row): GuestMessage => ({
  id: String(r.id),
  name: String(r.name),
  message: String(r.message),
  status: r.status as ModerationStatus,
  createdAt: Number(r.created_at),
});

const toGallery = (r: Row): GalleryItem => ({
  id: String(r.id),
  driveLink: String(r.drive_link),
  createdAt: Number(r.created_at),
});

const toVideo = (r: Row): VideoLink => ({
  id: String(r.id),
  name: String(r.name),
  driveLink: String(r.drive_link),
  status: r.status as ModerationStatus,
  createdAt: Number(r.created_at),
});

/* ----------------------------- Settings ----------------------------- */

export async function readSettings(): Promise<Settings> {
  const sql = await getDb();
  if (!sql) return DEFAULT_SETTINGS;
  const rows = await sql`SELECT data FROM settings WHERE id = 'main'`;
  // Stored values override the defaults; unknown keys are dropped.
  return rows[0] ? sanitizeSettings(rows[0].data) : DEFAULT_SETTINGS;
}

export async function writeSettings(settings: Settings): Promise<void> {
  const sql = await requireDb();
  const data = JSON.stringify(settings);
  await sql`
    INSERT INTO settings (id, data, updated_at)
    VALUES ('main', ${data}::jsonb, now())
    ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = now()`;
}

/* --------------------------- Guest Messages -------------------------- */

export async function listMessages(
  status?: ModerationStatus
): Promise<GuestMessage[]> {
  const sql = await getDb();
  if (!sql) return [];
  const rows = status
    ? await sql`SELECT * FROM messages WHERE status = ${status} ORDER BY created_at DESC`
    : await sql`SELECT * FROM messages ORDER BY created_at DESC`;
  return rows.map(toMessage);
}

export async function createMessage(name: string, message: string) {
  const sql = await requireDb();
  await sql`
    INSERT INTO messages (name, message, status, created_at)
    VALUES (${name}, ${message}, 'pending', ${Date.now()})`;
}

export async function updateMessageStatus(
  id: string,
  status: ModerationStatus
) {
  const sql = await requireDb();
  await sql`UPDATE messages SET status = ${status} WHERE id = ${id}`;
}

export async function removeMessage(id: string) {
  const sql = await requireDb();
  await sql`DELETE FROM messages WHERE id = ${id}`;
}

/* ------------------------------ Gallery ------------------------------ */

export async function listGallery(): Promise<GalleryItem[]> {
  const sql = await getDb();
  if (!sql) return [];
  const rows = await sql`SELECT * FROM gallery ORDER BY created_at ASC`;
  return rows.map(toGallery);
}

export async function createGalleryItem(driveLink: string) {
  const sql = await requireDb();
  await sql`
    INSERT INTO gallery (drive_link, created_at)
    VALUES (${driveLink}, ${Date.now()})`;
}

export async function removeGalleryItem(id: string) {
  const sql = await requireDb();
  await sql`DELETE FROM gallery WHERE id = ${id}`;
}

/* ------------------------------ Videos ------------------------------- */

export async function listVideos(
  status?: ModerationStatus
): Promise<VideoLink[]> {
  const sql = await getDb();
  if (!sql) return [];
  // Approved links feed the public album (oldest first, like the gallery);
  // the admin list shows newest first.
  const rows = status
    ? await sql`SELECT * FROM videos WHERE status = ${status} ORDER BY created_at ASC`
    : await sql`SELECT * FROM videos ORDER BY created_at DESC`;
  return rows.map(toVideo);
}

export async function createVideo(name: string, driveLink: string) {
  const sql = await requireDb();
  await sql`
    INSERT INTO videos (name, drive_link, status, created_at)
    VALUES (${name}, ${driveLink}, 'pending', ${Date.now()})`;
}

export async function updateVideoStatus(id: string, status: ModerationStatus) {
  const sql = await requireDb();
  await sql`UPDATE videos SET status = ${status} WHERE id = ${id}`;
}

export async function removeVideo(id: string) {
  const sql = await requireDb();
  await sql`DELETE FROM videos WHERE id = ${id}`;
}

/* ------------------------------ Visits ------------------------------- */

export async function incrementVisits() {
  const sql = await getDb();
  if (!sql) return;
  await sql`
    INSERT INTO visits (id, count, updated_at) VALUES ('counter', 1, ${Date.now()})
    ON CONFLICT (id) DO UPDATE
      SET count = visits.count + 1, updated_at = EXCLUDED.updated_at`;
}

export async function readVisits(): Promise<number> {
  const sql = await getDb();
  if (!sql) return 0;
  const rows = await sql`SELECT count FROM visits WHERE id = 'counter'`;
  return rows[0] ? Number(rows[0].count) : 0;
}

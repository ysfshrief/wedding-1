import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

type Sql = NeonQueryFunction<false, false>;

/** Neon's Vercel integration sets DATABASE_URL (and POSTGRES_URL). */
const connectionString =
  process.env.DATABASE_URL || process.env.POSTGRES_URL || "";

export const isDbConfigured = Boolean(connectionString);

let client: Sql | null = null;
let ready: Promise<void> | null = null;

/** Creates the tables on first use (idempotent, see db/schema.sql). */
async function migrate(sql: Sql) {
  await sql.transaction([
    // Serialises concurrent cold starts running the same DDL.
    sql`SELECT pg_advisory_xact_lock(820261008)`,
    sql`CREATE TABLE IF NOT EXISTS settings (
      id TEXT PRIMARY KEY,
      data JSONB NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )`,
    sql`CREATE TABLE IF NOT EXISTS messages (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      message TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'approved', 'rejected')),
      created_at BIGINT NOT NULL
    )`,
    sql`CREATE INDEX IF NOT EXISTS messages_status_idx ON messages (status)`,
    sql`CREATE TABLE IF NOT EXISTS gallery (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      drive_link TEXT NOT NULL,
      created_at BIGINT NOT NULL
    )`,
    sql`CREATE TABLE IF NOT EXISTS videos (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      drive_link TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'approved', 'rejected')),
      created_at BIGINT NOT NULL
    )`,
    sql`CREATE INDEX IF NOT EXISTS videos_status_idx ON videos (status)`,
    sql`CREATE TABLE IF NOT EXISTS visits (
      id TEXT PRIMARY KEY,
      count BIGINT NOT NULL DEFAULT 0,
      updated_at BIGINT
    )`,
  ]);
}

/** The ready-to-use SQL client, or null when no database is configured. */
export async function getDb(): Promise<Sql | null> {
  if (!connectionString) return null;
  client ??= neon(connectionString);
  const sql = client;
  ready ??= migrate(sql).catch((err) => {
    ready = null; // retry on the next request
    throw err;
  });
  await ready;
  return sql;
}

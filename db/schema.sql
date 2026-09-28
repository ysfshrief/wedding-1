-- Neon (Postgres) schema for the wedding invitation.
-- The app creates these automatically on first use; this file is for
-- reference or for running manually in the Neon SQL editor.

CREATE TABLE IF NOT EXISTS settings (
  id         TEXT PRIMARY KEY,
  data       JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS messages (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  message    TEXT NOT NULL,
  status     TEXT NOT NULL DEFAULT 'pending'
             CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at BIGINT NOT NULL
);
CREATE INDEX IF NOT EXISTS messages_status_idx ON messages (status);

CREATE TABLE IF NOT EXISTS gallery (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  drive_link TEXT NOT NULL,
  created_at BIGINT NOT NULL
);

CREATE TABLE IF NOT EXISTS videos (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  drive_link TEXT NOT NULL,
  status     TEXT NOT NULL DEFAULT 'pending'
             CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at BIGINT NOT NULL
);
CREATE INDEX IF NOT EXISTS videos_status_idx ON videos (status);

CREATE TABLE IF NOT EXISTS visits (
  id         TEXT PRIMARY KEY,
  count      BIGINT NOT NULL DEFAULT 0,
  updated_at BIGINT
);

import { DEFAULT_SETTINGS } from "@/config/defaults";
import type {
  Settings,
  GuestMessage,
  GalleryItem,
  VideoLink,
  ModerationStatus,
} from "@/types";

/**
 * Browser-side data access. Everything goes through the app's API routes,
 * which talk to Neon (Postgres) on the server — no credentials in the client.
 */

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
  }
}

async function api<T>(
  path: string,
  init?: Omit<RequestInit, "body"> & { json?: unknown }
): Promise<T> {
  const { json, ...rest } = init ?? {};
  const res = await fetch(path, {
    ...rest,
    cache: "no-store",
    headers:
      json === undefined
        ? rest.headers
        : { "Content-Type": "application/json" },
    body: json === undefined ? undefined : JSON.stringify(json),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new ApiError(res.status, (data as { error?: string }).error ?? "");
  }
  return data as T;
}

/* ----------------------------- Settings ----------------------------- */

export async function getSettings(): Promise<Settings> {
  return { ...DEFAULT_SETTINGS, ...(await api<Settings>("/api/settings")) };
}

export async function saveSettings(settings: Settings): Promise<void> {
  await api("/api/settings", { method: "PUT", json: settings });
}

/** Loads the settings once; returns an unsubscribe function. */
export function subscribeSettings(cb: (s: Settings) => void): () => void {
  let active = true;
  getSettings()
    .then((s) => active && cb(s))
    .catch(() => active && cb(DEFAULT_SETTINGS));
  return () => {
    active = false;
  };
}

/* --------------------------- Guest Messages -------------------------- */

export async function addGuestMessage(
  name: string,
  message: string
): Promise<void> {
  await api("/api/messages", { method: "POST", json: { name, message } });
}

export function getApprovedMessages(): Promise<GuestMessage[]> {
  return api("/api/messages");
}

export function getAllMessages(): Promise<GuestMessage[]> {
  return api("/api/messages?all=1");
}

export async function setMessageStatus(
  id: string,
  status: ModerationStatus
): Promise<void> {
  await api(`/api/messages/${id}`, { method: "PATCH", json: { status } });
}

export async function deleteMessage(id: string): Promise<void> {
  await api(`/api/messages/${id}`, { method: "DELETE" });
}

/* ------------------------------ Gallery ------------------------------ */

export function getGallery(): Promise<GalleryItem[]> {
  return api("/api/gallery");
}

export async function addGalleryItem(driveLink: string): Promise<void> {
  await api("/api/gallery", { method: "POST", json: { driveLink } });
}

export async function deleteGalleryItem(id: string): Promise<void> {
  await api(`/api/gallery/${id}`, { method: "DELETE" });
}

/* ------------------------------ Videos ------------------------------- */

export async function addVideoLink(
  name: string,
  driveLink: string
): Promise<void> {
  await api("/api/videos", { method: "POST", json: { name, driveLink } });
}

export function getAllVideos(): Promise<VideoLink[]> {
  return api("/api/videos?all=1");
}

export function getApprovedVideos(): Promise<VideoLink[]> {
  return api("/api/videos");
}

export async function setVideoStatus(
  id: string,
  status: ModerationStatus
): Promise<void> {
  await api(`/api/videos/${id}`, { method: "PATCH", json: { status } });
}

export async function deleteVideo(id: string): Promise<void> {
  await api(`/api/videos/${id}`, { method: "DELETE" });
}

/* ------------------------------ Visits ------------------------------- */

export async function trackVisit(): Promise<void> {
  try {
    await api("/api/visits", { method: "POST" });
  } catch {
    /* ignore */
  }
}

export async function getVisits(): Promise<number> {
  return (await api<{ count: number }>("/api/visits")).count;
}

/* ------------------------------- Admin ------------------------------- */

/** True when the password was accepted (sets an httpOnly session cookie). */
export async function adminLogin(password: string): Promise<boolean> {
  const res = await api<{ admin: boolean }>("/api/admin/session", {
    method: "POST",
    json: { password },
  });
  return res.admin;
}

export async function adminLogout(): Promise<void> {
  await api("/api/admin/session", { method: "DELETE" }).catch(() => undefined);
}

export async function hasAdminSession(): Promise<boolean> {
  try {
    return (await api<{ admin: boolean }>("/api/admin/session")).admin;
  } catch {
    return false;
  }
}

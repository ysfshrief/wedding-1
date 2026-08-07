import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  increment,
  serverTimestamp,
  onSnapshot,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { DEFAULT_SETTINGS } from "@/config/defaults";
import type {
  Settings,
  GuestMessage,
  GalleryItem,
  VideoLink,
  ModerationStatus,
} from "@/types";

const SETTINGS_DOC = "settings/main";

/* ----------------------------- Settings ----------------------------- */

export async function getSettings(): Promise<Settings> {
  if (!db) return DEFAULT_SETTINGS;
  const ref = doc(db, "settings", "main");
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, DEFAULT_SETTINGS);
    return DEFAULT_SETTINGS;
  }
  return { ...DEFAULT_SETTINGS, ...(snap.data() as Partial<Settings>) };
}

export async function saveSettings(settings: Settings): Promise<void> {
  if (!db) return;
  await setDoc(doc(db, "settings", "main"), settings, { merge: true });
}

export function subscribeSettings(
  cb: (s: Settings) => void
): Unsubscribe | null {
  if (!db) {
    cb(DEFAULT_SETTINGS);
    return null;
  }
  return onSnapshot(doc(db, "settings", "main"), (snap) => {
    if (snap.exists()) {
      cb({ ...DEFAULT_SETTINGS, ...(snap.data() as Partial<Settings>) });
    } else {
      cb(DEFAULT_SETTINGS);
    }
  });
}

/* --------------------------- Guest Messages -------------------------- */

export async function addGuestMessage(
  name: string,
  message: string
): Promise<void> {
  if (!db) return;
  await addDoc(collection(db, "messages"), {
    name,
    message,
    status: "pending" as ModerationStatus,
    createdAt: Date.now(),
    _server: serverTimestamp(),
  });
}

export async function getApprovedMessages(): Promise<GuestMessage[]> {
  if (!db) return [];
  const q = query(
    collection(db, "messages"),
    where("status", "==", "approved")
  );
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => ({ id: d.id, ...(d.data() as Omit<GuestMessage, "id">) }))
    .sort((a, b) => b.createdAt - a.createdAt);
}

export async function getAllMessages(): Promise<GuestMessage[]> {
  if (!db) return [];
  const snap = await getDocs(collection(db, "messages"));
  return snap.docs
    .map((d) => ({ id: d.id, ...(d.data() as Omit<GuestMessage, "id">) }))
    .sort((a, b) => b.createdAt - a.createdAt);
}

export async function setMessageStatus(
  id: string,
  status: ModerationStatus
): Promise<void> {
  if (!db) return;
  await updateDoc(doc(db, "messages", id), { status });
}

export async function deleteMessage(id: string): Promise<void> {
  if (!db) return;
  await deleteDoc(doc(db, "messages", id));
}

/* ------------------------------ Gallery ------------------------------ */

export async function getGallery(): Promise<GalleryItem[]> {
  if (!db) return [];
  const snap = await getDocs(collection(db, "gallery"));
  return snap.docs
    .map((d) => ({ id: d.id, ...(d.data() as Omit<GalleryItem, "id">) }))
    .sort((a, b) => a.createdAt - b.createdAt);
}

export async function addGalleryItem(driveLink: string): Promise<void> {
  if (!db) return;
  await addDoc(collection(db, "gallery"), {
    driveLink,
    createdAt: Date.now(),
  });
}

export async function deleteGalleryItem(id: string): Promise<void> {
  if (!db) return;
  await deleteDoc(doc(db, "gallery", id));
}

/* ------------------------------ Videos ------------------------------- */

export async function addVideoLink(
  name: string,
  driveLink: string
): Promise<void> {
  if (!db) return;
  await addDoc(collection(db, "videos"), {
    name,
    driveLink,
    status: "pending" as ModerationStatus,
    createdAt: Date.now(),
  });
}

export async function getAllVideos(): Promise<VideoLink[]> {
  if (!db) return [];
  const snap = await getDocs(collection(db, "videos"));
  return snap.docs
    .map((d) => ({ id: d.id, ...(d.data() as Omit<VideoLink, "id">) }))
    .sort((a, b) => b.createdAt - a.createdAt);
}

export async function getApprovedVideos(): Promise<VideoLink[]> {
  if (!db) return [];
  const q = query(collection(db, "videos"), where("status", "==", "approved"));
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => ({ id: d.id, ...(d.data() as Omit<VideoLink, "id">) }))
    .sort((a, b) => a.createdAt - b.createdAt);
}

export async function setVideoStatus(
  id: string,
  status: ModerationStatus
): Promise<void> {
  if (!db) return;
  await updateDoc(doc(db, "videos", id), { status });
}

export async function deleteVideo(id: string): Promise<void> {
  if (!db) return;
  await deleteDoc(doc(db, "videos", id));
}

/* ------------------------------ Visits ------------------------------- */

export async function trackVisit(): Promise<void> {
  if (!db) return;
  try {
    await setDoc(
      doc(db, "visits", "counter"),
      { count: increment(1), updatedAt: Date.now() },
      { merge: true }
    );
  } catch {
    /* ignore */
  }
}

export async function getVisits(): Promise<number> {
  if (!db) return 0;
  const snap = await getDoc(doc(db, "visits", "counter"));
  return snap.exists() ? (snap.data().count as number) || 0 : 0;
}

export { SETTINGS_DOC, orderBy };

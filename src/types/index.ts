export type Locale = "ar" | "en";

export type ModerationStatus = "pending" | "approved" | "rejected";

export interface SectionToggles {
  hero: boolean;
  countdown: boolean;
  gallery: boolean;
  guestbook: boolean;
  sharePhotos: boolean;
}

export interface Settings {
  brideName: string;
  brideNameEn: string;
  groomName: string;
  groomNameEn: string;
  bibleVerse: string;
  bibleVerseRef: string;
  /** ISO string for the wedding date & time */
  weddingDate: string;
  timeLabel: string;
  timeLabelEn: string;
  location: string;
  locationEn: string;
  mapsLink: string;
  heroImage: string;
  musicLink: string;
  sections: SectionToggles;
}

export interface GuestMessage {
  id: string;
  name: string;
  message: string;
  status: ModerationStatus;
  createdAt: number;
}

export interface GalleryItem {
  id: string;
  driveLink: string;
  createdAt: number;
}

export interface VideoLink {
  id: string;
  name: string;
  driveLink: string;
  status: ModerationStatus;
  createdAt: number;
}

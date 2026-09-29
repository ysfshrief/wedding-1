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
  /** Optional English rendering of the verse (falls back to Arabic). */
  bibleVerseEn?: string;
  bibleVerseRefEn?: string;
  /** ISO string for the wedding date & time */
  weddingDate: string;
  timeLabel: string;
  timeLabelEn: string;
  location: string;
  locationEn: string;
  mapsLink: string;
  /** Optional Drive image shown softly behind the hero. */
  heroImage: string;
  /** Optional Drive audio link; overrides the bundled invitation music. */
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

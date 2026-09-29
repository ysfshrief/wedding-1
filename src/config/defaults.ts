import type { Settings } from "@/types";

export const DEFAULT_SETTINGS: Settings = {
  brideName: "دميانة",
  brideNameEn: "Demiana",
  groomName: "فؤاد",
  groomNameEn: "Fouad",
  bibleVerse: "«فَالَّذِي جَمَعَهُ اللهُ لاَ يُفَرِّقْهُ إِنْسَانٌ»",
  bibleVerseRef: "( مر 10: 9 )",
  bibleVerseEn:
    "“What therefore God has joined together, let no one separate.”",
  bibleVerseRefEn: "( Mark 10:9 )",
  // Egypt observes DST until late October, so 6:30 PM local is UTC+3.
  weddingDate: "2026-10-08T18:30:00+03:00",
  timeLabel: "٦:٣٠ مساءً",
  timeLabelEn: "6:30 PM",
  location: "كنيسة مارمرقس الكرمة (المزرعة) دمنهور",
  locationEn: "St. Mark Church, El-Karma (El-Mazraa), Damanhour",
  mapsLink: "https://maps.google.com/?q=كنيسة+مارمرقس+الكرمة+دمنهور",
  heroImage: "",
  musicLink: "",
  sections: {
    hero: true,
    countdown: true,
    gallery: true,
    guestbook: true,
    sharePhotos: true,
  },
};

/** Bundled invitation assets (served from /public). */
export const DEFAULT_MUSIC_SRC = "/audio/fouad-demiana.m4a";

/** IANA zone used to display the wedding date/time. */
export const WEDDING_TIME_ZONE = "Africa/Cairo";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://your-domain.vercel.app";

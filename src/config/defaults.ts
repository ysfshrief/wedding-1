import type { Settings } from "@/types";

export const DEFAULT_SETTINGS: Settings = {
  brideName: "دميانة",
  brideNameEn: "Demiana",
  groomName: "فؤاد",
  groomNameEn: "Fouad",
  bibleVerse: "«فَالَّذِي جَمَعَهُ اللهُ لاَ يُفَرِّقْهُ إِنْسَانٌ»",
  bibleVerseRef: "( مر 9:10 )",
  weddingDate: "2026-10-08T19:00:00+02:00",
  timeLabel: "٧:٠٠ مساءً",
  timeLabelEn: "7:00 PM",
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

export const ADMIN_PASSWORD =
  process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "00000";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://your-domain.vercel.app";

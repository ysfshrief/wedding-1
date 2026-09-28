"use client";

import { motion } from "framer-motion";
import type { Settings, Locale } from "@/types";
import { getDict } from "@/messages";
import { formatShortDate } from "@/lib/date";
import { EASE_CURTAIN, EASE_LUXE } from "@/lib/motion";
import { Ornament } from "./Ornament";
import { Particles } from "./Particles";

interface Props {
  settings: Settings;
  locale: Locale;
  /** True once the guest tapped "Open Invitation". */
  opening: boolean;
  onOpen: () => void;
}

const CURTAIN_BG =
  "linear-gradient(180deg, #F8F2E8 0%, #EFE5D6 50%, #E2D3BE 100%)";

const enter = (delay: number) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 1, ease: EASE_LUXE },
});

export function WelcomeScreen({ settings, locale, opening, onOpen }: Props) {
  const t = getDict(locale);
  const isAr = locale === "ar";

  const bride = isAr ? settings.brideName : settings.brideNameEn;
  const groom = isAr ? settings.groomName : settings.groomNameEn;
  const verse = isAr
    ? settings.bibleVerse
    : settings.bibleVerseEn || settings.bibleVerse;
  const verseRef = isAr
    ? settings.bibleVerseRef
    : settings.bibleVerseRefEn || settings.bibleVerseRef;

  const curtain = (side: "left" | "right") => (
    <motion.div
      className={`absolute inset-y-0 ${side === "left" ? "left-0" : "right-0"} w-1/2`}
      style={{ background: CURTAIN_BG }}
      initial={false}
      animate={{ x: opening ? (side === "left" ? "-100%" : "100%") : 0 }}
      transition={{ duration: 1.6, ease: EASE_CURTAIN, delay: 0.5 }}
    >
      {/* seam: a champagne edge with depth, visible as the doors part */}
      <motion.div
        className={`absolute inset-y-0 ${side === "left" ? "right-0" : "left-0"} w-10`}
        style={{
          background:
            side === "left"
              ? "linear-gradient(90deg, transparent, rgba(59,45,36,0.12))"
              : "linear-gradient(270deg, transparent, rgba(59,45,36,0.12))",
        }}
        initial={false}
        animate={{ opacity: opening ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      />
      <motion.div
        className={`absolute inset-y-0 ${side === "left" ? "right-0" : "left-0"} w-px bg-champagne/50`}
        initial={false}
        animate={{ opacity: opening ? 1 : 0 }}
        transition={{ duration: 0.4 }}
      />
    </motion.div>
  );

  return (
    <motion.div
      className={`fixed inset-0 z-50 flex items-center justify-center overflow-hidden ${
        opening ? "pointer-events-none" : ""
      }`}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {curtain("left")}
      {curtain("right")}

      {/* Ambient layer: glow, framing lines, light motes */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: opening ? 0 : 1 }}
        transition={{ duration: opening ? 0.6 : 1.6, ease: EASE_LUXE }}
      >
        <div className="absolute left-1/2 top-1/2 h-[80vmax] w-[80vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,251,243,0.9),rgba(255,251,243,0)_60%)]" />
        <div className="absolute inset-3 rounded-[1.75rem] border border-champagne/40 sm:inset-6" />
        <div className="absolute inset-[1.15rem] rounded-[1.4rem] border border-champagne/20 sm:inset-[2.1rem]" />
        <Particles count={14} seed={11} />
      </motion.div>

      <motion.div
        className="relative z-20 flex max-w-xl flex-col items-center px-8 text-center"
        initial={false}
        animate={
          opening
            ? { opacity: 0, scale: 0.97, y: -12 }
            : { opacity: 1, scale: 1, y: 0 }
        }
        transition={{ duration: 0.7, ease: EASE_LUXE }}
      >
        <motion.p
          {...enter(0.3)}
          className="font-ar text-lg tracking-[0.25em] text-champagne-dark sm:text-xl"
        >
          {isAr ? t.invitationTitle : t.invitationTitle.toUpperCase()}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scaleX: 0.4 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.55, duration: 1.2, ease: EASE_LUXE }}
        >
          <Ornament className="mx-auto my-6 w-40 text-champagne" />
        </motion.div>

        <motion.h1
          {...enter(0.75)}
          className={`text-champagne-shine pb-1 text-5xl font-semibold leading-[1.15] sm:text-7xl ${
            isAr ? "font-ar" : "font-en"
          }`}
        >
          <span className="block sm:inline">{groom}</span>{" "}
          <span className="my-1 block text-3xl sm:my-0 sm:inline sm:text-6xl">
            &amp;
          </span>{" "}
          <span className="block sm:inline">{bride}</span>
        </motion.h1>

        <motion.p
          {...enter(1)}
          dir="ltr"
          className="font-numeric mt-5 font-en text-lg tracking-[0.3em] text-espresso-light"
        >
          {formatShortDate(settings.weddingDate)}
        </motion.p>

        <motion.div {...enter(1.2)} className="mt-7 max-w-md">
          <p
            className={`leading-loose text-espresso ${
              isAr
                ? "font-ar text-lg sm:text-xl"
                : "font-en text-xl italic sm:text-2xl"
            }`}
          >
            {verse}
          </p>
          <p className="font-numeric mt-1 font-ar text-sm text-champagne-dark">
            {verseRef}
          </p>
        </motion.div>

        <motion.div {...enter(1.5)} className="mt-10">
          <button
            type="button"
            onClick={onOpen}
            className="btn-luxe font-arSans text-lg"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M9 18V6l11-2v12M9 18a3 3 0 11-6 0 3 3 0 016 0zm11-2a3 3 0 11-6 0 3 3 0 016 0z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {t.openInvitation}
          </button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

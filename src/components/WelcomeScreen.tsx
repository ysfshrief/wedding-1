"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import type { Settings, Locale } from "@/types";
import { getDict } from "@/messages";
import { useAudio } from "./AudioProvider";
import { Ornament } from "./Ornament";

interface Props {
  settings: Settings;
  locale: Locale;
  onOpen: () => void;
}

export function WelcomeScreen({ settings, locale, onOpen }: Props) {
  const t = getDict(locale);
  const audio = useAudio();
  const [opening, setOpening] = useState(false);
  const isAr = locale === "ar";

  const bride = isAr ? settings.brideName : settings.brideNameEn;
  const groom = isAr ? settings.groomName : settings.groomNameEn;

  const handleOpen = () => {
    if (opening) return;
    setOpening(true);
    if (settings.musicLink) {
      audio.setSource(settings.musicLink);
      setTimeout(() => audio.start(), 300);
    }
    setTimeout(onOpen, 2100);
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-burgundy-gradient"
      exit={{ opacity: 0 }}
    >
      {/* Soft golden glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[70vmax] w-[70vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(228,201,126,0.18),transparent_60%)]" />
      </div>

      {/* Curtain doors opening */}
      <AnimatePresence>
        {opening && (
          <>
            <motion.div
              className="absolute inset-y-0 left-0 z-30 w-1/2 bg-burgundy-gradient shadow-2xl"
              initial={{ x: 0 }}
              animate={{ x: "-100%" }}
              transition={{ duration: 1.6, ease: [0.76, 0, 0.24, 1] }}
            >
              <div className="absolute right-0 top-0 h-full w-px bg-gold/60" />
            </motion.div>
            <motion.div
              className="absolute inset-y-0 right-0 z-30 w-1/2 bg-burgundy-gradient shadow-2xl"
              initial={{ x: 0 }}
              animate={{ x: "100%" }}
              transition={{ duration: 1.6, ease: [0.76, 0, 0.24, 1] }}
            >
              <div className="absolute left-0 top-0 h-full w-px bg-gold/60" />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <motion.div
        className="relative z-20 flex flex-col items-center px-6 text-center"
        animate={opening ? { scale: 1.08, opacity: 0 } : {}}
        transition={{ duration: 1.2, ease: "easeInOut" }}
      >
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.9 }}
          className="font-ar text-xl tracking-widest text-gold-light sm:text-2xl"
        >
          {t.invitationTitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 1 }}
        >
          <Ornament className="mx-auto my-6 w-40 text-gold-light/80" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="text-gold-shine font-en text-5xl font-semibold leading-tight sm:text-7xl"
        >
          {isAr ? (
            <span className="font-ar">
              {groom} <span className="text-gold-light/70">&</span> {bride}
            </span>
          ) : (
            <>
              {groom} <span className="text-gold-light/70">&</span> {bride}
            </>
          )}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 1 }}
          className="mt-8 max-w-md"
        >
          <p className="font-ar text-lg leading-loose text-ivory/90 sm:text-xl">
            {settings.bibleVerse}
          </p>
          <p className="mt-2 font-ar text-sm text-gold-light/80">
            {settings.bibleVerseRef}
          </p>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleOpen}
          className="btn-luxe mt-12 font-arSans text-lg"
        >
          {t.openInvitation}
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

"use client";

import { motion } from "framer-motion";
import { getDict } from "@/messages";
import type { Locale } from "@/types";
import { useAudio } from "./AudioProvider";

export function MusicButton({ locale }: { locale: Locale }) {
  const t = getDict(locale);
  const { playing, ready, toggle } = useAudio();
  if (!ready) return null;

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 2.4, duration: 0.6 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      onClick={toggle}
      aria-label={playing ? t.pauseMusic : t.playMusic}
      aria-pressed={playing}
      className="glass-dark fixed bottom-5 left-5 z-40 flex h-12 w-12 items-center justify-center rounded-full text-champagne-light shadow-champagne sm:bottom-6 sm:left-6 sm:h-14 sm:w-14"
    >
      {playing ? (
        <span className="flex h-4 items-end gap-1" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="h-4 w-1 origin-bottom rounded-full bg-champagne-light"
              animate={{ scaleY: [0.35, 1, 0.35] }}
              transition={{
                repeat: Infinity,
                duration: 0.9,
                delay: i * 0.15,
                ease: "easeInOut",
              }}
            />
          ))}
        </span>
      ) : (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M8 5v14l11-7z"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </motion.button>
  );
}

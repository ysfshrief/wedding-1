"use client";

import { motion } from "framer-motion";
import { useAudio } from "./AudioProvider";

export function MusicButton() {
  const { playing, ready, toggle } = useAudio();
  if (!ready) return null;

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      onClick={toggle}
      aria-label={playing ? "Pause music" : "Play music"}
      className="glass-dark fixed bottom-6 left-6 z-40 flex h-14 w-14 items-center justify-center rounded-full shadow-gold"
    >
      {playing ? (
        <span className="flex items-end gap-1">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="w-1 rounded-full bg-gold-light"
              animate={{ height: [6, 16, 6] }}
              transition={{
                repeat: Infinity,
                duration: 0.8,
                delay: i * 0.15,
              }}
            />
          ))}
        </span>
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M8 5v14l11-7z"
            fill="#E4C97E"
            stroke="#E4C97E"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </motion.button>
  );
}

"use client";

import { motion } from "framer-motion";
import { getDict } from "@/messages";
import type { Locale } from "@/types";

interface Props {
  locale: Locale;
  onToggle: () => void;
}

export function LangToggle({ locale, onToggle }: Props) {
  const t = getDict(locale);
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      onClick={onToggle}
      className="glass-dark fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full font-en text-lg font-semibold text-gold-light shadow-gold"
      aria-label="Toggle language"
    >
      {t.lang}
    </motion.button>
  );
}

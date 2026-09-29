"use client";

import { motion } from "framer-motion";
import { getDict } from "@/messages";
import type { Locale } from "@/types";

interface Props {
  locale: Locale;
  onToggle: () => void;
}

/** Stays available on the welcome screen too, above the curtains. */
export function LangToggle({ locale, onToggle }: Props) {
  const t = getDict(locale);
  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.2, duration: 0.6 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      onClick={onToggle}
      className={`glass-dark fixed bottom-5 right-5 z-[55] flex h-12 w-12 items-center justify-center rounded-full text-lg font-semibold text-champagne-light shadow-champagne sm:bottom-6 sm:right-6 sm:h-14 sm:w-14 ${
        locale === "ar" ? "font-en" : "font-ar"
      }`}
      aria-label={t.toggleLanguage}
      lang={locale === "ar" ? "en" : "ar"}
    >
      {t.lang}
    </motion.button>
  );
}

"use client";

import { motion } from "framer-motion";
import type { Locale, Settings } from "@/types";
import { getDict } from "@/messages";

interface Props {
  settings: Settings;
  locale: Locale;
}

const fade = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
};

export function Details({ settings, locale }: Props) {
  const t = getDict(locale);
  const isAr = locale === "ar";

  return (
    <section className="px-6 py-20">
      <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-2">
        <motion.div
          variants={fade}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="glass flex flex-col items-center gap-3 rounded-3xl px-8 py-12 text-center shadow-soft"
        >
          <CalendarIcon />
          <h3 className="font-ar text-xl font-bold text-burgundy">
            {t.weddingDate}
          </h3>
          <p className="font-en text-2xl text-charcoal">
            {isAr ? "٨ أكتوبر ٢٠٢٦" : "October 8, 2026"}
          </p>
          <p className="font-arSans text-gold-dark">
            {isAr ? settings.timeLabel : settings.timeLabelEn}
          </p>
        </motion.div>

        <motion.div
          variants={fade}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="glass flex flex-col items-center gap-3 rounded-3xl px-8 py-12 text-center shadow-soft"
        >
          <PinIcon />
          <h3 className="font-ar text-xl font-bold text-burgundy">
            {t.location}
          </h3>
          <p className="font-arSans leading-relaxed text-charcoal">
            {isAr ? settings.location : settings.locationEn}
          </p>
          {settings.mapsLink && (
            <a
              href={settings.mapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline mt-2 font-arSans text-sm"
            >
              {t.openMaps}
            </a>
          )}
        </motion.div>
      </div>
    </section>
  );
}

function CalendarIcon() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 24 24"
      fill="none"
      className="text-gold"
    >
      <rect
        x="3"
        y="5"
        width="18"
        height="16"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path
        d="M3 9h18M8 3v4M16 3v4"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 24 24"
      fill="none"
      className="text-gold"
    >
      <path
        d="M12 21s7-5.5 7-11a7 7 0 10-14 0c0 5.5 7 11 7 11z"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

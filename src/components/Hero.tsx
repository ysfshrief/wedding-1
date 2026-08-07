"use client";

import { motion } from "framer-motion";
import type { Settings, Locale } from "@/types";
import { getDict } from "@/messages";
import { driveImageUrl } from "@/lib/drive";
import { Ornament } from "./Ornament";

interface Props {
  settings: Settings;
  locale: Locale;
}

export function Hero({ settings, locale }: Props) {
  const t = getDict(locale);
  const isAr = locale === "ar";
  const bride = isAr ? settings.brideName : settings.brideNameEn;
  const groom = isAr ? settings.groomName : settings.groomNameEn;
  const bg = settings.heroImage ? driveImageUrl(settings.heroImage, 1600) : "";

  return (
    <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        {bg ? (
          <img
            src={bg}
            alt=""
            className="h-full w-full object-cover"
            loading="eager"
          />
        ) : (
          <div className="h-full w-full bg-burgundy-gradient" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-burgundy-dark/70 via-burgundy/40 to-burgundy-dark/80" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center px-6 text-center text-ivory"
      >
        <p className="font-ar text-lg tracking-[0.3em] text-gold-light sm:text-xl">
          {t.invitationTitle}
        </p>

        <Ornament className="my-6 w-44 text-gold-light/80" />

        <h1 className="text-gold-shine font-en text-6xl font-semibold leading-none sm:text-8xl">
          {isAr ? (
            <span className="font-ar block">
              <span className="block">{groom}</span>
              <span className="my-2 block text-4xl text-gold-light/70 sm:text-5xl">
                &
              </span>
              <span className="block">{bride}</span>
            </span>
          ) : (
            <span className="block leading-tight">
              <span className="block">{groom}</span>
              <span className="my-2 block text-4xl text-gold-light/70 sm:text-5xl">
                &
              </span>
              <span className="block">{bride}</span>
            </span>
          )}
        </h1>

        <Ornament className="mt-6 w-44 rotate-180 text-gold-light/80" />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="mt-10 flex flex-col items-center gap-1"
        >
          <p className="font-en text-2xl tracking-wider sm:text-3xl">
            {isAr ? "٨ أكتوبر ٢٠٢٦" : "October 8, 2026"}
          </p>
          <p className="font-arSans text-base text-gold-light">
            {isAr ? settings.timeLabel : settings.timeLabelEn}
          </p>
        </motion.div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2.4 }}
          className="absolute -bottom-24 left-1/2 -translate-x-1/2"
        >
          <svg
            width="24"
            height="40"
            viewBox="0 0 24 40"
            fill="none"
            className="text-gold-light/70"
          >
            <rect
              x="1"
              y="1"
              width="22"
              height="38"
              rx="11"
              stroke="currentColor"
            />
            <circle cx="12" cy="12" r="3" fill="currentColor" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}

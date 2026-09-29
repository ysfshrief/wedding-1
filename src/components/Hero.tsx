"use client";

import { motion } from "framer-motion";
import type { Settings, Locale } from "@/types";
import { getDict } from "@/messages";
import { driveImageUrl } from "@/lib/drive";
import { formatWeddingDate } from "@/lib/date";
import { EASE_LUXE } from "@/lib/motion";
import { Ornament } from "./Ornament";
import { Particles } from "./Particles";
import { CouplePortrait } from "./CouplePortrait";

interface Props {
  settings: Settings;
  locale: Locale;
}

/** The hero mounts under the curtains; start once they have begun to part. */
const D = 0.9;

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: D + delay, duration: 1.1, ease: EASE_LUXE },
});

export function Hero({ settings, locale }: Props) {
  const t = getDict(locale);
  const isAr = locale === "ar";
  const bride = isAr ? settings.brideName : settings.brideNameEn;
  const groom = isAr ? settings.groomName : settings.groomNameEn;
  const bg = settings.heroImage ? driveImageUrl(settings.heroImage, 1600) : "";

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#FAF6EF_0%,#F5EDE1_60%,#F1E7D9_100%)]">
      {/* Optional admin backdrop, kept very soft behind the content */}
      {bg && (
        <div aria-hidden="true" className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={bg}
            alt=""
            className="h-full w-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ivory/80 via-ivory/60 to-cream/90" />
        </div>
      )}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(255,252,246,0.95),rgba(255,252,246,0))]"
      />
      <Particles count={12} seed={3} />

      <div className="relative mx-auto grid min-h-[100svh] max-w-6xl content-center items-center gap-x-16 gap-y-10 px-6 pb-28 pt-14 sm:gap-y-12 sm:pt-20 lg:grid-cols-2 lg:py-24">
        {/* Names */}
        <div className="flex flex-col items-center text-center lg:col-start-2 lg:self-end">
          <motion.p
            {...rise(0)}
            className="font-ar text-base tracking-[0.3em] text-champagne-dark sm:text-lg"
          >
            {isAr ? t.invitationTitle : t.invitationTitle.toUpperCase()}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scaleX: 0.3 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: D + 0.15, duration: 1.3, ease: EASE_LUXE }}
          >
            <Ornament className="my-6 w-44 text-champagne" />
          </motion.div>

          <h1
            className={`text-6xl font-semibold leading-none text-espresso sm:text-7xl lg:text-8xl ${
              isAr ? "font-ar" : "font-en"
            }`}
          >
            <motion.span
              {...rise(0.3)}
              className="text-champagne-shine block pb-2"
            >
              {groom}
            </motion.span>
            <motion.span
              {...rise(0.45)}
              className="my-1 block font-en text-4xl font-normal italic text-champagne-dark/80 sm:text-5xl"
            >
              &amp;
            </motion.span>
            <motion.span
              {...rise(0.6)}
              className="text-champagne-shine block pb-2"
            >
              {bride}
            </motion.span>
          </h1>
        </div>

        {/* Portrait */}
        <div className="lg:col-start-1 lg:row-span-2 lg:row-start-1">
          <CouplePortrait alt={t.coupleAlt} delay={D + 0.2} />
        </div>

        {/* Date */}
        <motion.div
          {...rise(0.9)}
          className="flex flex-col items-center gap-1 text-center lg:col-start-2 lg:self-start"
        >
          <Ornament className="mb-5 w-44 rotate-180 text-champagne" />
          <p className="font-numeric font-en text-2xl tracking-wider text-espresso sm:text-3xl">
            {formatWeddingDate(settings.weddingDate, locale)}
          </p>
          <p className="font-arSans text-base text-champagne-dark">
            {isAr ? settings.timeLabel : settings.timeLabelEn}
          </p>
        </motion.div>
      </div>

      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: D + 1.6, duration: 1 }}
        className="absolute bottom-7 left-1/2 -translate-x-1/2"
      >
        <motion.svg
          width="22"
          height="36"
          viewBox="0 0 24 40"
          fill="none"
          className="text-champagne-dark/70"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2.6, ease: "easeInOut" }}
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
        </motion.svg>
      </motion.div>
    </section>
  );
}

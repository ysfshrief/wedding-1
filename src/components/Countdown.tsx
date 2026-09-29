"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Fragment } from "react";
import { useCountdown } from "@/hooks/useCountdown";
import { getDict } from "@/messages";
import { EASE_LUXE } from "@/lib/motion";
import type { Locale, Settings } from "@/types";
import { Ornament } from "./Ornament";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

interface Props {
  settings: Settings;
  locale: Locale;
}

function FlipCard({ value, label }: { value: number; label: string }) {
  const display = String(value).padStart(2, "0");
  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="relative h-20 w-full max-w-[5.5rem] sm:h-28 sm:w-24 sm:max-w-none md:h-32 md:w-28"
        style={{ perspective: 600 }}
      >
        <div className="glass absolute inset-0 overflow-hidden rounded-2xl shadow-soft">
          <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/50 to-transparent" />
          {/* center hinge line */}
          <div className="absolute left-0 right-0 top-1/2 z-10 h-px -translate-y-1/2 bg-champagne/35" />
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={display}
              initial={{ rotateX: -90, opacity: 0 }}
              animate={{ rotateX: 0, opacity: 1 }}
              exit={{ rotateX: 90, opacity: 0 }}
              transition={{ duration: 0.55, ease: EASE_LUXE }}
              className="font-numeric absolute inset-0 flex items-center justify-center font-en text-4xl font-semibold text-espresso sm:text-5xl md:text-6xl"
            >
              {display}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>
      <span className="font-arSans text-xs uppercase tracking-[0.15em] text-charcoal/70 sm:text-sm">
        {label}
      </span>
    </div>
  );
}

export function Countdown({ settings, locale }: Props) {
  const t = getDict(locale);
  const time = useCountdown(settings.weddingDate);

  if (time.finished) {
    return (
      <section className="bg-linen/50 px-6 py-24">
        <Reveal scale={0.96} y={16}>
          <div className="glass mx-auto max-w-2xl rounded-[2rem] px-8 py-14 text-center shadow-luxe">
            <Ornament className="mx-auto mb-6 w-40 text-champagne" />
            <h2 className="text-champagne-shine font-ar text-3xl font-bold sm:text-4xl">
              {t.countdownDoneTitle}
            </h2>
            <p className="mt-3 font-ar text-2xl text-espresso sm:text-3xl">
              {t.countdownDoneSub}
            </p>
            <p className="mt-6 font-arSans text-lg leading-loose text-charcoal/80">
              {t.countdownDoneBody}
            </p>
            <Ornament className="mx-auto mt-8 w-40 rotate-180 text-champagne" />
          </div>
        </Reveal>
      </section>
    );
  }

  const units = [
    { value: time.days, label: t.days },
    { value: time.hours, label: t.hours },
    { value: time.minutes, label: t.minutes },
    { value: time.seconds, label: t.seconds },
  ];

  return (
    <section className="relative bg-[linear-gradient(180deg,#F1E7D9_0%,#EDE2D1_50%,#F4ECE0_100%)] px-5 py-20 sm:px-6 sm:py-24">
      <SectionHeading title={t.countdownTitle} />

      <Reveal delay={0.15}>
        <div className="mx-auto mt-10 grid max-w-sm grid-cols-4 gap-2.5 sm:flex sm:max-w-none sm:items-start sm:justify-center sm:gap-5">
          {units.map((u, i) => (
            <Fragment key={i}>
              {i > 0 && (
                <span className="hidden pt-8 font-en text-5xl text-champagne/60 sm:block">
                  :
                </span>
              )}
              <FlipCard value={u.value} label={u.label} />
            </Fragment>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

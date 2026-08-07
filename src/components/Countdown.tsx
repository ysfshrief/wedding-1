"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useCountdown } from "@/hooks/useCountdown";
import { getDict } from "@/messages";
import type { Locale, Settings } from "@/types";
import { Ornament } from "./Ornament";

interface Props {
  settings: Settings;
  locale: Locale;
}

function FlipCard({ value, label }: { value: number; label: string }) {
  const display = String(value).padStart(2, "0");
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative h-24 w-20 sm:h-28 sm:w-24 md:h-32 md:w-28">
        <div className="glass absolute inset-0 overflow-hidden rounded-2xl shadow-luxe">
          {/* center hinge line */}
          <div className="absolute left-0 right-0 top-1/2 z-10 h-px -translate-y-1/2 bg-gold/40" />
          <AnimatePresence mode="popLayout">
            <motion.span
              key={display}
              initial={{ rotateX: -90, opacity: 0 }}
              animate={{ rotateX: 0, opacity: 1 }}
              exit={{ rotateX: 90, opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="font-numeric absolute inset-0 flex items-center justify-center font-en text-4xl font-bold text-burgundy sm:text-5xl md:text-6xl"
            >
              {display}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>
      <span className="font-arSans text-xs tracking-wide text-charcoal/70 sm:text-sm">
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
      <section className="px-6 py-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="glass mx-auto max-w-2xl rounded-[2rem] px-8 py-14 text-center shadow-luxe"
        >
          <Ornament className="mx-auto mb-6 w-40 text-gold" />
          <h2 className="text-gold-shine font-ar text-3xl font-bold sm:text-4xl">
            {t.countdownDoneTitle}
          </h2>
          <p className="mt-3 font-ar text-2xl text-burgundy sm:text-3xl">
            {t.countdownDoneSub}
          </p>
          <p className="mt-6 font-arSans text-lg leading-loose text-charcoal/80">
            {t.countdownDoneBody}
          </p>
          <Ornament className="mx-auto mt-8 w-40 rotate-180 text-gold" />
        </motion.div>
      </section>
    );
  }

  return (
    <section className="px-6 py-20">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="section-title font-ar text-burgundy"
      >
        {t.countdownTitle}
      </motion.h2>
      <div className="divider-gold" />

      <div className="mt-10 flex flex-wrap items-start justify-center gap-3 sm:gap-5">
        <FlipCard value={time.days} label={t.days} />
        <span className="pt-8 font-en text-4xl text-gold/50 sm:text-5xl">:</span>
        <FlipCard value={time.hours} label={t.hours} />
        <span className="pt-8 font-en text-4xl text-gold/50 sm:text-5xl">:</span>
        <FlipCard value={time.minutes} label={t.minutes} />
        <span className="pt-8 font-en text-4xl text-gold/50 sm:text-5xl">:</span>
        <FlipCard value={time.seconds} label={t.seconds} />
      </div>
    </section>
  );
}

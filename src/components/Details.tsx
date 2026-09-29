"use client";

import type { Locale, Settings } from "@/types";
import { getDict } from "@/messages";
import { formatWeddingDate } from "@/lib/date";
import { Reveal } from "./Reveal";

interface Props {
  settings: Settings;
  locale: Locale;
}

const CARD =
  "glass group flex h-full flex-col items-center gap-3 rounded-3xl px-8 py-12 text-center shadow-soft transition-[box-shadow,transform] duration-500 ease-luxe hover:-translate-y-1 hover:shadow-luxe";

export function Details({ settings, locale }: Props) {
  const t = getDict(locale);
  const isAr = locale === "ar";

  return (
    <section className="px-6 py-20 sm:py-24">
      <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-2">
        <Reveal className="h-full">
          <div className={CARD}>
            <IconBadge>
              <CalendarIcon />
            </IconBadge>
            <h3 className="font-ar text-xl font-bold text-espresso">
              {t.weddingDate}
            </h3>
            <p className="font-numeric font-en text-2xl text-charcoal">
              {formatWeddingDate(settings.weddingDate, locale)}
            </p>
            <p className="font-arSans text-champagne-dark">
              {isAr ? settings.timeLabel : settings.timeLabelEn}
            </p>
          </div>
        </Reveal>

        <Reveal className="h-full" delay={0.15}>
          <div className={CARD}>
            <IconBadge>
              <PinIcon />
            </IconBadge>
            <h3 className="font-ar text-xl font-bold text-espresso">
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
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function IconBadge({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-1 flex h-16 w-16 items-center justify-center rounded-full border border-champagne/40 bg-ivory/80 transition-transform duration-500 ease-luxe group-hover:scale-105">
      {children}
    </div>
  );
}

function CalendarIcon() {
  return (
    <svg
      width="30"
      height="30"
      viewBox="0 0 24 24"
      fill="none"
      className="text-champagne-dark"
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
      width="30"
      height="30"
      viewBox="0 0 24 24"
      fill="none"
      className="text-champagne-dark"
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

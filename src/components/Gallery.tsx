"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { getGallery, getApprovedVideos } from "@/lib/data";
import { driveImageUrl } from "@/lib/drive";
import { getDict } from "@/messages";
import { EASE_LUXE } from "@/lib/motion";
import type { Locale } from "@/types";
import { Ornament } from "./Ornament";
import { SectionHeading } from "./SectionHeading";

interface Props {
  locale: Locale;
}

export function Gallery({ locale }: Props) {
  const t = getDict(locale);
  const [links, setLinks] = useState<string[]>([]);
  const [broken, setBroken] = useState<Set<string>>(() => new Set());
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    let alive = true;
    Promise.all([getGallery(), getApprovedVideos()])
      .then(([g, v]) => {
        if (!alive) return;
        setLinks([...g.map((i) => i.driveLink), ...v.map((i) => i.driveLink)]);
      })
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, []);

  // Links that aren't images (e.g. shared Drive folders) are skipped.
  const images = links.filter((l) => !broken.has(l));
  const markBroken = (link: string) =>
    setBroken((prev) => new Set(prev).add(link));

  useEffect(() => {
    if (active === null) return;
    const count = images.length;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
      if (e.key === "ArrowRight")
        setActive((a) => (a === null ? a : (a + 1) % count));
      if (e.key === "ArrowLeft")
        setActive((a) => (a === null ? a : (a - 1 + count) % count));
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [active, images.length]);

  if (images.length === 0) return null;

  const step = (dir: 1 | -1) =>
    setActive((a) =>
      a === null ? a : (a + dir + images.length) % images.length
    );

  return (
    <section className="bg-[linear-gradient(180deg,#FAF6EF_0%,#F3EADD_100%)] px-5 py-20 sm:px-6 sm:py-24">
      <SectionHeading title={t.galleryTitle} subtitle={t.fullscreenHint} />

      <div className="mx-auto mt-10 max-w-5xl columns-2 gap-3 sm:columns-3 sm:gap-4">
        {images.map((link, i) => (
          <motion.button
            key={`${link}-${i}`}
            type="button"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{
              duration: 0.8,
              ease: EASE_LUXE,
              delay: (i % 6) * 0.07,
            }}
            onClick={() => setActive(i)}
            aria-label={t.fullscreenHint}
            className="group mb-3 block w-full overflow-hidden rounded-2xl border border-champagne/25 bg-linen shadow-soft sm:mb-4"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={driveImageUrl(link, 800)}
              alt=""
              loading="lazy"
              decoding="async"
              onError={() => markBroken(link)}
              className="w-full object-cover transition-transform duration-1000 ease-luxe group-hover:scale-105"
            />
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {active !== null && images[active] && (
          <motion.div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-[60] flex items-center justify-center bg-espresso-dark/90 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={() => setActive(null)}
          >
            <button
              type="button"
              onClick={() => setActive(null)}
              className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full text-2xl text-champagne-light transition hover:bg-white/10"
              aria-label={t.close}
            >
              ✕
            </button>
            <motion.img
              key={active}
              src={driveImageUrl(images[active], 1600)}
              alt=""
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: EASE_LUXE }}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[85vh] max-w-full rounded-2xl object-contain shadow-luxe"
            />
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    step(-1);
                  }}
                  className="absolute left-2 flex h-12 w-12 items-center justify-center rounded-full text-4xl text-champagne-light/80 transition hover:bg-white/10 hover:text-champagne-light sm:left-4"
                  aria-label={t.previous}
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    step(1);
                  }}
                  className="absolute right-2 flex h-12 w-12 items-center justify-center rounded-full text-4xl text-champagne-light/80 transition hover:bg-white/10 hover:text-champagne-light sm:right-4"
                  aria-label={t.next}
                >
                  ›
                </button>
              </>
            )}
            <Ornament className="absolute bottom-6 w-32 text-champagne-light/50" />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

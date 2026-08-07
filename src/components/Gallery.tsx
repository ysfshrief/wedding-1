"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { getGallery, getApprovedVideos } from "@/lib/data";
import { driveImageUrl } from "@/lib/drive";
import { getDict } from "@/messages";
import type { Locale } from "@/types";
import { Ornament } from "./Ornament";

interface Props {
  locale: Locale;
}

export function Gallery({ locale }: Props) {
  const t = getDict(locale);
  const [images, setImages] = useState<string[]>([]);
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      const [g, v] = await Promise.all([getGallery(), getApprovedVideos()]);
      const links = [
        ...g.map((i) => i.driveLink),
        ...v.map((i) => i.driveLink),
      ];
      setImages(links);
    })();
  }, []);

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
      if (e.key === "ArrowRight")
        setActive((a) => (a === null ? a : (a + 1) % images.length));
      if (e.key === "ArrowLeft")
        setActive((a) =>
          a === null ? a : (a - 1 + images.length) % images.length
        );
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, images.length]);

  if (images.length === 0) return null;

  return (
    <section className="px-6 py-20">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="section-title font-ar text-burgundy"
      >
        {t.galleryTitle}
      </motion.h2>
      <div className="divider-gold" />

      <div className="mx-auto mt-8 max-w-5xl columns-2 gap-3 sm:columns-3 sm:gap-4">
        {images.map((link, i) => (
          <motion.button
            key={link + i}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, delay: (i % 6) * 0.06 }}
            whileHover={{ scale: 0.985 }}
            onClick={() => setActive(i)}
            className="mb-3 block w-full overflow-hidden rounded-2xl shadow-soft sm:mb-4"
          >
            <img
              src={driveImageUrl(link, 800)}
              alt=""
              loading="lazy"
              className="w-full object-cover transition-transform duration-700 hover:scale-105"
            />
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {active !== null && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-burgundy-dark/90 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
          >
            <button
              onClick={() => setActive(null)}
              className="absolute right-5 top-5 text-3xl text-gold-light"
              aria-label="Close"
            >
              ✕
            </button>
            <motion.img
              key={active}
              src={driveImageUrl(images[active], 1600)}
              alt=""
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[85vh] max-w-full rounded-2xl object-contain shadow-luxe"
            />
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActive((a) =>
                      a === null ? a : (a - 1 + images.length) % images.length
                    );
                  }}
                  className="absolute left-4 text-4xl text-gold-light/80 hover:text-gold-light"
                  aria-label="Previous"
                >
                  ‹
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActive((a) =>
                      a === null ? a : (a + 1) % images.length
                    );
                  }}
                  className="absolute right-4 text-4xl text-gold-light/80 hover:text-gold-light"
                  aria-label="Next"
                >
                  ›
                </button>
              </>
            )}
            <Ornament className="absolute bottom-6 w-32 text-gold-light/50" />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

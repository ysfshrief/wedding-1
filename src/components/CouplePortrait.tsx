"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import couple from "@/assets/fouad-demiana.png";
import { EASE_LUXE } from "@/lib/motion";

interface Props {
  alt: string;
  /** Seconds before the unveil starts. */
  delay?: number;
  className?: string;
}

const CORNERS = [
  "left-0 top-0 border-l border-t",
  "right-0 top-0 border-r border-t",
  "bottom-0 left-0 border-b border-l",
  "bottom-0 right-0 border-b border-r",
];

/**
 * The couple's portrait, shown exactly as photographed (no recolouring,
 * natural aspect ratio) inside a champagne gallery-mat frame.
 */
export function CouplePortrait({ alt, delay = 0, className = "" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [30, -30]);

  return (
    <motion.div
      ref={ref}
      style={{ y }}
      className={`relative mx-auto w-full max-w-[300px] sm:max-w-[360px] md:max-w-[400px] lg:max-w-[420px] ${className}`}
    >
      {/* soft champagne halo */}
      <motion.div
        aria-hidden="true"
        className="absolute -inset-12 rounded-full bg-[radial-gradient(closest-side,rgba(230,213,184,0.9),rgba(230,213,184,0))]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay, duration: 2.2, ease: EASE_LUXE }}
      />

      {/* outer hairline frame with corner accents */}
      <motion.div
        aria-hidden="true"
        className="absolute -inset-3 sm:-inset-4"
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: delay + 0.6, duration: 1.4, ease: EASE_LUXE }}
      >
        <div className="absolute inset-0 border border-champagne/45" />
        {CORNERS.map((c) => (
          <span
            key={c}
            className={`absolute h-5 w-5 border-champagne-dark/70 sm:h-6 sm:w-6 ${c}`}
            style={{ margin: -4 }}
          />
        ))}
      </motion.div>

      <motion.figure
        className="relative bg-[#FFFDF8] p-2 shadow-luxe sm:p-2.5"
        initial={{ opacity: 0, y: 36 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 1.3, ease: EASE_LUXE }}
      >
        <motion.div
          className="relative overflow-hidden"
          initial={{ clipPath: "inset(12% 12% 12% 12%)" }}
          animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
          transition={{ delay: delay + 0.1, duration: 1.7, ease: EASE_LUXE }}
        >
          <motion.div
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ delay, duration: 2.6, ease: EASE_LUXE }}
          >
            <Image
              src={couple}
              alt={alt}
              priority
              quality={90}
              placeholder="blur"
              sizes="(min-width: 1024px) 420px, (min-width: 768px) 400px, (min-width: 640px) 360px, 300px"
              className="block h-auto w-full"
            />
          </motion.div>
        </motion.div>
        {/* inner hairline on the mat */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-1 border border-champagne/35 sm:inset-[5px]"
        />
      </motion.figure>
    </motion.div>
  );
}

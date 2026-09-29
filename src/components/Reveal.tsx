"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { EASE_LUXE } from "@/lib/motion";

interface Props {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Vertical travel in px; 0 for a pure fade. */
  y?: number;
  scale?: number;
}

/** Fades content up once it scrolls into view. */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
  scale = 1,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y, scale }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "0px 0px -60px 0px" }}
      transition={{ duration: 0.9, ease: EASE_LUXE, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

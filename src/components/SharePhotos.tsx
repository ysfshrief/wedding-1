"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { addVideoLink } from "@/lib/data";
import { getDict } from "@/messages";
import type { Locale } from "@/types";
import { Ornament } from "./Ornament";

interface Props {
  locale: Locale;
}

export function SharePhotos({ locale }: Props) {
  const t = getDict(locale);
  const [name, setName] = useState("");
  const [link, setLink] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async () => {
    if (!link.trim() || sending) return;
    setSending(true);
    await addVideoLink(name.trim() || "—", link.trim());
    setSending(false);
    setDone(true);
    setName("");
    setLink("");
  };

  return (
    <section className="px-6 py-20">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="section-title font-ar text-burgundy"
      >
        {t.sharePhotosTitle}
      </motion.h2>
      <p className="mt-2 text-center font-arSans text-charcoal/70">
        {t.sharePhotosSubtitle}
      </p>
      <div className="divider-gold" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="glass mx-auto mt-8 max-w-lg rounded-3xl p-8 shadow-soft"
      >
        {done ? (
          <div className="py-8 text-center">
            <Ornament className="mx-auto mb-4 w-32 text-gold" />
            <p className="font-arSans text-lg text-burgundy">{t.shareThanks}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t.optionalName}
              className="rounded-xl border border-gold/30 bg-white/70 px-4 py-3 font-arSans outline-none transition focus:border-gold"
            />
            <input
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder={t.driveLink}
              dir="ltr"
              className="rounded-xl border border-gold/30 bg-white/70 px-4 py-3 font-arSans outline-none transition focus:border-gold"
            />
            <button
              onClick={submit}
              disabled={sending}
              className="btn-luxe font-arSans disabled:opacity-60"
            >
              {sending ? t.sending : t.send}
            </button>
          </div>
        )}
      </motion.div>
    </section>
  );
}

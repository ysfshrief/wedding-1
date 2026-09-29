"use client";

import { motion } from "framer-motion";
import { useState, type FormEvent } from "react";
import { addVideoLink } from "@/lib/data";
import { getDict } from "@/messages";
import { EASE_LUXE } from "@/lib/motion";
import type { Locale } from "@/types";
import { Ornament } from "./Ornament";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

interface Props {
  locale: Locale;
}

export function SharePhotos({ locale }: Props) {
  const t = getDict(locale);
  const [name, setName] = useState("");
  const [link, setLink] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [failed, setFailed] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!link.trim() || sending) return;
    setSending(true);
    setFailed(false);
    try {
      await addVideoLink(name.trim() || "—", link.trim());
      setDone(true);
      setName("");
      setLink("");
    } catch {
      setFailed(true);
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="bg-ivory px-5 py-20 sm:px-6 sm:py-24">
      <SectionHeading
        title={t.sharePhotosTitle}
        subtitle={t.sharePhotosSubtitle}
      />

      <Reveal delay={0.1}>
        <div className="glass mx-auto mt-10 max-w-lg rounded-3xl p-6 shadow-soft sm:p-8">
          {done ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: EASE_LUXE }}
              className="py-8 text-center"
            >
              <Ornament className="mx-auto mb-4 w-32 text-champagne" />
              <p className="font-arSans text-lg text-espresso">
                {t.shareThanks}
              </p>
            </motion.div>
          ) : (
            <form onSubmit={submit} className="flex flex-col gap-4">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t.optionalName}
                aria-label={t.optionalName}
                autoComplete="name"
                maxLength={80}
                className="field"
              />
              <input
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder={t.driveLink}
                aria-label={t.driveLink}
                inputMode="url"
                dir="ltr"
                required
                className="field"
              />
              {failed && (
                <p
                  role="alert"
                  className="text-center font-arSans text-sm text-espresso"
                >
                  {t.sendError}
                </p>
              )}
              <button
                type="submit"
                disabled={sending}
                className="btn-luxe font-arSans"
              >
                {sending ? t.sending : t.send}
              </button>
            </form>
          )}
        </div>
      </Reveal>
    </section>
  );
}

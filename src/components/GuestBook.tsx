"use client";

import { motion } from "framer-motion";
import { useEffect, useState, type FormEvent } from "react";
import { addGuestMessage, getApprovedMessages } from "@/lib/data";
import { getDict } from "@/messages";
import { EASE_LUXE } from "@/lib/motion";
import type { GuestMessage, Locale } from "@/types";
import { Ornament } from "./Ornament";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

interface Props {
  locale: Locale;
}

export function GuestBook({ locale }: Props) {
  const t = getDict(locale);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [failed, setFailed] = useState(false);
  const [approved, setApproved] = useState<GuestMessage[]>([]);

  useEffect(() => {
    getApprovedMessages()
      .then(setApproved)
      .catch(() => undefined);
  }, []);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim() || sending) return;
    setSending(true);
    setFailed(false);
    try {
      await addGuestMessage(name.trim(), message.trim());
      setDone(true);
      setName("");
      setMessage("");
    } catch {
      setFailed(true);
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="bg-[linear-gradient(180deg,#F3EADD_0%,#EDE2D1_100%)] px-5 py-20 sm:px-6 sm:py-24">
      <SectionHeading title={t.guestbookTitle} subtitle={t.guestbookSubtitle} />

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
                {t.guestbookThanks}
              </p>
            </motion.div>
          ) : (
            <form onSubmit={submit} className="flex flex-col gap-4">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t.yourName}
                aria-label={t.yourName}
                autoComplete="name"
                maxLength={80}
                required
                className="field"
              />
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t.yourMessage}
                aria-label={t.yourMessage}
                rows={4}
                maxLength={1000}
                required
                className="field resize-none"
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

      {approved.length > 0 && (
        <div className="mx-auto mt-16 max-w-4xl">
          <Reveal>
            <h3 className="mb-8 text-center font-ar text-2xl text-espresso sm:text-3xl">
              {t.memoriesTitle}
            </h3>
          </Reveal>
          <div className="columns-1 gap-4 sm:columns-2">
            {approved.map((m, i) => (
              <motion.figure
                key={m.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.8,
                  ease: EASE_LUXE,
                  delay: (i % 4) * 0.08,
                }}
                className="glass relative mb-4 break-inside-avoid rounded-2xl p-6 shadow-soft"
              >
                <span
                  aria-hidden="true"
                  className="absolute end-5 top-2 font-en text-5xl leading-none text-champagne/40"
                >
                  ”
                </span>
                <blockquote className="whitespace-pre-line break-words font-arSans leading-relaxed text-charcoal">
                  {m.message}
                </blockquote>
                <figcaption className="mt-3 font-ar text-sm font-bold text-champagne-dark">
                  — {m.name}
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { addGuestMessage, getApprovedMessages } from "@/lib/data";
import { getDict } from "@/messages";
import type { GuestMessage, Locale } from "@/types";
import { Ornament } from "./Ornament";

interface Props {
  locale: Locale;
}

export function GuestBook({ locale }: Props) {
  const t = getDict(locale);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [approved, setApproved] = useState<GuestMessage[]>([]);

  useEffect(() => {
    getApprovedMessages().then(setApproved);
  }, []);

  const submit = async () => {
    if (!name.trim() || !message.trim() || sending) return;
    setSending(true);
    await addGuestMessage(name.trim(), message.trim());
    setSending(false);
    setDone(true);
    setName("");
    setMessage("");
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
        {t.guestbookTitle}
      </motion.h2>
      <p className="mt-2 text-center font-arSans text-charcoal/70">
        {t.guestbookSubtitle}
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
            <p className="font-arSans text-lg text-burgundy">
              {t.guestbookThanks}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t.yourName}
              className="rounded-xl border border-gold/30 bg-white/70 px-4 py-3 font-arSans outline-none transition focus:border-gold"
            />
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t.yourMessage}
              rows={4}
              className="resize-none rounded-xl border border-gold/30 bg-white/70 px-4 py-3 font-arSans outline-none transition focus:border-gold"
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

      {approved.length > 0 && (
        <div className="mx-auto mt-14 max-w-4xl">
          <h3 className="mb-6 text-center font-ar text-2xl text-burgundy">
            {t.memoriesTitle}
          </h3>
          <div className="columns-1 gap-4 sm:columns-2">
            {approved.map((m, i) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: (i % 4) * 0.08 }}
                className="glass mb-4 break-inside-avoid rounded-2xl p-6 shadow-soft"
              >
                <p className="font-arSans leading-relaxed text-charcoal">
                  “{m.message}”
                </p>
                <p className="mt-3 font-ar text-sm font-bold text-gold-dark">
                  — {m.name}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { getDict } from "@/messages";
import { ADMIN_PASSWORD } from "@/config/defaults";
import type { Locale } from "@/types";
import { Ornament } from "./Ornament";

interface Props {
  locale: Locale;
}

export function Footer({ locale }: Props) {
  const t = getDict(locale);
  const router = useRouter();
  const clicks = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleLogoClick = () => {
    clicks.current += 1;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => (clicks.current = 0), 1200);
    if (clicks.current >= 3) {
      clicks.current = 0;
      setShowDialog(true);
    }
  };

  const login = () => {
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem("admin_ok", "1");
      router.push("/admin");
    } else {
      setError(true);
    }
  };

  return (
    <footer className="relative overflow-hidden bg-burgundy-gradient px-6 py-16 text-center text-ivory">
      <Ornament className="mx-auto mb-6 w-40 text-gold-light/70" />
      <p className="font-en text-lg tracking-wide text-ivory/90">
        {t.madeWith}{" "}
        <span className="text-gold-light">Youssef Shrief</span>
      </p>

      <button
        onClick={handleLogoClick}
        className="mx-auto mt-4 block select-none font-en text-sm tracking-[0.35em] text-gold-light/70 transition hover:text-gold-light"
        aria-label="Joe Industries"
      >
        JOE INDUSTRIES
      </button>

      <AnimatePresence>
        {showDialog && (
          <motion.div
            className="fixed inset-0 z-[70] flex items-center justify-center bg-burgundy-dark/80 p-6 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowDialog(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass w-full max-w-sm rounded-3xl p-8 text-center shadow-luxe"
            >
              <h3 className="font-ar text-xl font-bold text-burgundy">
                {t.adminPassword}
              </h3>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                onKeyDown={(e) => e.key === "Enter" && login()}
                dir="ltr"
                autoFocus
                className="mt-5 w-full rounded-xl border border-gold/30 bg-white/80 px-4 py-3 text-center font-en text-lg outline-none focus:border-gold"
              />
              {error && (
                <p className="mt-2 font-arSans text-sm text-burgundy">
                  {t.wrongPassword}
                </p>
              )}
              <button onClick={login} className="btn-luxe mt-5 w-full font-arSans">
                {t.login}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </footer>
  );
}

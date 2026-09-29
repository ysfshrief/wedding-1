"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { getDict } from "@/messages";
import { adminLogin } from "@/lib/data";
import type { Locale } from "@/types";
import { Ornament } from "./Ornament";
import { JoeIndustriesLogo } from "./JoeIndustriesLogo";

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
  const [checking, setChecking] = useState(false);

  const handleLogoClick = () => {
    clicks.current += 1;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => (clicks.current = 0), 1200);
    if (clicks.current >= 3) {
      clicks.current = 0;
      setShowDialog(true);
    }
  };

  const login = async () => {
    if (checking) return;
    setChecking(true);
    try {
      if (await adminLogin(password)) {
        router.push("/admin");
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setChecking(false);
    }
  };

  return (
    <footer className="relative overflow-hidden bg-espresso-gradient px-6 py-16 text-center text-ivory">
      <Ornament className="mx-auto mb-6 w-40 text-champagne-light/70" />
      <p className="font-en text-lg tracking-wide text-ivory/90">
        {t.madeWith}{" "}
        <span className="text-champagne-light">Youssef Shrief</span>
      </p>

      <button
        onClick={handleLogoClick}
        className="group mx-auto mt-5 block select-none"
        aria-label="Joe Industries"
      >
        <JoeIndustriesLogo className="w-44 sm:w-52" />
      </button>

      <AnimatePresence>
        {showDialog && (
          <motion.div
            className="fixed inset-0 z-[70] flex items-center justify-center bg-espresso-dark/80 p-6 backdrop-blur-sm"
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
              <h3 className="font-ar text-xl font-bold text-espresso">
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
                className="mt-5 w-full rounded-xl border border-champagne/30 bg-white/80 px-4 py-3 text-center font-en text-lg outline-none focus:border-champagne"
              />
              {error && (
                <p className="mt-2 font-arSans text-sm text-espresso">
                  {t.wrongPassword}
                </p>
              )}
              <button
                onClick={login}
                disabled={checking}
                className="btn-luxe mt-5 w-full font-arSans"
              >
                {t.login}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </footer>
  );
}

"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useSettings } from "@/hooks/useSettings";
import { trackVisit } from "@/lib/data";
import type { Locale } from "@/types";
import { AudioProvider } from "./AudioProvider";
import { WelcomeScreen } from "./WelcomeScreen";
import { Hero } from "./Hero";
import { Countdown } from "./Countdown";
import { Details } from "./Details";
import { Gallery } from "./Gallery";
import { GuestBook } from "./GuestBook";
import { SharePhotos } from "./SharePhotos";
import { Footer } from "./Footer";
import { MusicButton } from "./MusicButton";
import { LangToggle } from "./LangToggle";

function Content() {
  const { settings } = useSettings();
  const [opened, setOpened] = useState(false);
  const [locale, setLocale] = useState<Locale>("ar");

  useEffect(() => {
    if (opened) trackVisit();
  }, [opened]);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
  }, [locale]);

  const s = settings.sections;

  return (
    <>
      <AnimatePresence>
        {!opened && (
          <WelcomeScreen
            settings={settings}
            locale={locale}
            onOpen={() => setOpened(true)}
          />
        )}
      </AnimatePresence>

      {opened && (
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {s.hero && <Hero settings={settings} locale={locale} />}
          {s.countdown && <Countdown settings={settings} locale={locale} />}
          {s.hero && <Details settings={settings} locale={locale} />}
          {s.gallery && <Gallery locale={locale} />}
          {s.guestbook && <GuestBook locale={locale} />}
          {s.sharePhotos && <SharePhotos locale={locale} />}
          <Footer locale={locale} />

          <MusicButton />
          <LangToggle
            locale={locale}
            onToggle={() => setLocale((l) => (l === "ar" ? "en" : "ar"))}
          />
        </motion.main>
      )}
    </>
  );
}

export function Experience() {
  return (
    <AudioProvider>
      <Content />
    </AudioProvider>
  );
}

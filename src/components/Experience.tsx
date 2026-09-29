"use client";

import { AnimatePresence, MotionConfig } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { useSettings } from "@/hooks/useSettings";
import { trackVisit } from "@/lib/data";
import { driveAudioUrl } from "@/lib/drive";
import { DEFAULT_MUSIC_SRC } from "@/config/defaults";
import type { Locale } from "@/types";
import { AudioProvider, useAudio } from "./AudioProvider";
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

/** welcome → (click) opening: curtains part over the invitation → open */
type Phase = "welcome" | "opening" | "open";

/** Curtain choreography length; the welcome layer unmounts after it. */
const OPENING_MS = 2300;

function Content() {
  const { settings } = useSettings();
  const audio = useAudio();
  const [phase, setPhase] = useState<Phase>("welcome");
  // English on every fresh visit; `?lang=ar` opens directly in Arabic.
  const [locale, setLocale] = useState<Locale>("en");

  useEffect(() => {
    const lang = new URLSearchParams(window.location.search).get("lang");
    if (lang === "ar" || lang === "en") setLocale(lang);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
  }, [locale]);

  const { setSource } = audio;
  useEffect(() => {
    setSource(
      settings.musicLink ? driveAudioUrl(settings.musicLink) : DEFAULT_MUSIC_SRC
    );
  }, [settings.musicLink, setSource]);

  useEffect(() => {
    if (phase !== "opening") return;
    trackVisit();
    const id = setTimeout(() => setPhase("open"), OPENING_MS);
    return () => clearTimeout(id);
  }, [phase]);

  const { start } = audio;
  const handleOpen = useCallback(() => {
    if (phase !== "welcome") return;
    // Music starts only here, synchronously within the user's tap.
    start();
    window.scrollTo(0, 0);
    setPhase("opening");
  }, [phase, start]);

  const toggleLocale = useCallback(
    () => setLocale((l) => (l === "ar" ? "en" : "ar")),
    []
  );

  const s = settings.sections;
  const revealed = phase !== "welcome";

  return (
    <>
      <AnimatePresence>
        {phase !== "open" && (
          <WelcomeScreen
            key="welcome"
            settings={settings}
            locale={locale}
            opening={phase === "opening"}
            onOpen={handleOpen}
          />
        )}
      </AnimatePresence>

      {revealed && (
        <main>
          {s.hero && <Hero settings={settings} locale={locale} />}
          {s.countdown && <Countdown settings={settings} locale={locale} />}
          {s.hero && <Details settings={settings} locale={locale} />}
          {s.gallery && <Gallery locale={locale} />}
          {s.guestbook && <GuestBook locale={locale} />}
          {s.sharePhotos && <SharePhotos locale={locale} />}
          <Footer locale={locale} />
        </main>
      )}

      {revealed && <MusicButton locale={locale} />}
      <LangToggle locale={locale} onToggle={toggleLocale} />
    </>
  );
}

export function Experience() {
  return (
    <MotionConfig reducedMotion="user">
      <AudioProvider>
        <Content />
      </AudioProvider>
    </MotionConfig>
  );
}

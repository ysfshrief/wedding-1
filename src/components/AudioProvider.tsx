"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { DEFAULT_MUSIC_SRC } from "@/config/defaults";

interface AudioCtx {
  playing: boolean;
  /** A source is loaded and the controls can be shown. */
  ready: boolean;
  /** Plays the track once from the beginning. Call from a user gesture. */
  start: () => void;
  toggle: () => void;
  setSource: (src: string) => void;
}

const Ctx = createContext<AudioCtx | null>(null);

const TARGET_VOLUME = 0.7;
const FADE_IN_MS = 1800;

type FadeRef = { current: number | null };

function stopFade(ref: FadeRef) {
  if (ref.current !== null) cancelAnimationFrame(ref.current);
  ref.current = null;
}

function fadeIn(el: HTMLAudioElement, ref: FadeRef) {
  stopFade(ref);
  el.volume = 0;
  const t0 = performance.now();
  const step = (now: number) => {
    const p = Math.min(1, (now - t0) / FADE_IN_MS);
    el.volume = TARGET_VOLUME * p * (2 - p); // ease-out
    ref.current = p < 1 ? requestAnimationFrame(step) : null;
  };
  ref.current = requestAnimationFrame(step);
}

export function AudioProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const sourceRef = useRef("");
  const fadeRef = useRef<number | null>(null);
  const resumeOnVisibleRef = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);

  /** Lazily creates the element so it exists whichever effect runs first. */
  const ensureEl = useCallback((): HTMLAudioElement => {
    if (audioRef.current) return audioRef.current;
    const el = new Audio();
    // Plays a single time per opening — never loops.
    el.loop = false;
    el.preload = "auto";
    el.volume = TARGET_VOLUME;
    el.addEventListener("play", () => setPlaying(true));
    el.addEventListener("pause", () => setPlaying(false));
    el.addEventListener("ended", () => {
      stopFade(fadeRef);
      setPlaying(false);
    });
    // A broken custom (Drive) link falls back to the bundled track.
    el.addEventListener("error", () => {
      if (sourceRef.current && sourceRef.current !== DEFAULT_MUSIC_SRC) {
        sourceRef.current = DEFAULT_MUSIC_SRC;
        el.src = DEFAULT_MUSIC_SRC;
      }
    });
    audioRef.current = el;
    return el;
  }, []);

  useEffect(() => {
    // Pause while the tab is hidden; resume the same play-through on return.
    const onVisibility = () => {
      const el = audioRef.current;
      if (!el) return;
      if (document.hidden) {
        resumeOnVisibleRef.current = !el.paused;
        if (!el.paused) el.pause();
      } else if (resumeOnVisibleRef.current) {
        resumeOnVisibleRef.current = false;
        el.play().catch(() => undefined);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      stopFade(fadeRef);
      const el = audioRef.current;
      if (el) {
        el.pause();
        el.removeAttribute("src");
        el.load();
      }
      audioRef.current = null;
      sourceRef.current = "";
    };
  }, []);

  const setSource = useCallback(
    (src: string) => {
      if (!src || src === sourceRef.current) return;
      const el = ensureEl();
      sourceRef.current = src;
      el.src = src;
      setReady(true);
    },
    [ensureEl]
  );

  const start = useCallback(() => {
    const el = audioRef.current;
    if (!el || !sourceRef.current) return;
    // Must run synchronously inside the click handler (autoplay policies).
    el.currentTime = 0;
    fadeIn(el, fadeRef);
    el.play().catch(() => {
      stopFade(fadeRef);
      el.volume = TARGET_VOLUME;
      setPlaying(false);
    });
  }, []);

  const toggle = useCallback(() => {
    const el = audioRef.current;
    if (!el || !sourceRef.current) return;
    if (el.paused) {
      stopFade(fadeRef);
      el.volume = TARGET_VOLUME;
      el.play().catch(() => setPlaying(false));
    } else {
      stopFade(fadeRef);
      el.pause();
    }
  }, []);

  const value = useMemo(
    () => ({ playing, ready, start, toggle, setSource }),
    [playing, ready, start, toggle, setSource]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAudio() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAudio must be used within AudioProvider");
  return ctx;
}

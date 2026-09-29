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
    // rAF timestamps can precede t0, so clamp: a negative volume throws and
    // would leave the track playing silently at volume 0.
    const p = Math.min(1, Math.max(0, (now - t0) / FADE_IN_MS));
    try {
      el.volume = Math.min(TARGET_VOLUME, TARGET_VOLUME * p * (2 - p)); // ease-out
    } catch {
      el.volume = TARGET_VOLUME;
      ref.current = null;
      return;
    }
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

  const retryRef = useRef<(() => void) | null>(null);

  const clearRetry = () => {
    retryRef.current?.();
    retryRef.current = null;
  };

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
    const el = audioRef.current;

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      stopFade(fadeRef);
      clearRetry();
      el?.pause();
      sourceRef.current = "";
    };
  }, []);

  const setSource = useCallback((src: string) => {
    const el = audioRef.current;
    if (!el || !src || src === sourceRef.current) return;
    sourceRef.current = src;
    el.src = src;
    setReady(true);
  }, []);

  /**
   * If a mobile browser still refuses playback, try again on the guest's
   * next tap/click/key press (each of those counts as a fresh user gesture).
   */
  const retryOnNextGesture = useCallback((el: HTMLAudioElement) => {
    clearRetry();
    const events = ["touchend", "pointerup", "click", "keydown"] as const;
    const retry = () => {
      clearRetry();
      if (el.paused && !el.ended) el.play().catch(() => undefined);
    };
    events.forEach((e) =>
      document.addEventListener(e, retry, { capture: true, passive: true })
    );
    retryRef.current = () =>
      events.forEach((e) =>
        document.removeEventListener(e, retry, { capture: true })
      );
  }, []);

  const start = useCallback(() => {
    const el = audioRef.current;
    if (!el || !sourceRef.current) return;
    // Must run synchronously inside the click handler (autoplay policies).
    // Older iOS WebKit throws if currentTime is set before metadata loads.
    if (el.readyState > 0) {
      try {
        el.currentTime = 0;
      } catch {
        /* already at the start */
      }
    }
    fadeIn(el, fadeRef);
    const attempt = el.play();
    attempt?.catch(() => {
      stopFade(fadeRef);
      el.volume = TARGET_VOLUME;
      setPlaying(false);
      retryOnNextGesture(el);
    });
  }, [retryOnNextGesture]);

  const toggle = useCallback(() => {
    const el = audioRef.current;
    if (!el || !sourceRef.current) return;
    clearRetry();
    stopFade(fadeRef);
    if (el.paused) {
      el.volume = TARGET_VOLUME;
      el.play().catch(() => setPlaying(false));
    } else {
      el.pause();
    }
  }, []);

  const onError = () => {
    // A broken custom (Drive) link falls back to the bundled track.
    const el = audioRef.current;
    if (el && sourceRef.current && sourceRef.current !== DEFAULT_MUSIC_SRC) {
      sourceRef.current = DEFAULT_MUSIC_SRC;
      el.src = DEFAULT_MUSIC_SRC;
    }
  };

  const value = useMemo(
    () => ({ playing, ready, start, toggle, setSource }),
    [playing, ready, start, toggle, setSource]
  );

  return (
    <Ctx.Provider value={value}>
      {/* In-page element (not `new Audio()`): most reliable on iOS/Android. */}
      <audio
        ref={audioRef}
        preload="auto"
        playsInline
        // Plays a single time per opening — never loops.
        loop={false}
        aria-hidden="true"
        className="hidden"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => {
          stopFade(fadeRef);
          setPlaying(false);
        }}
        onError={onError}
      />
      {children}
    </Ctx.Provider>
  );
}

export function useAudio() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAudio must be used within AudioProvider");
  return ctx;
}

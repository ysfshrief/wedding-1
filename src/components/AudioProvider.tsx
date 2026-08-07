"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { driveAudioUrl } from "@/lib/drive";

interface AudioCtx {
  playing: boolean;
  ready: boolean;
  start: () => void;
  toggle: () => void;
  setSource: (link: string) => void;
}

const Ctx = createContext<AudioCtx | null>(null);

export function AudioProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const [source, setSourceState] = useState("");

  useEffect(() => {
    const el = new Audio();
    el.loop = true;
    el.preload = "auto";
    el.volume = 0.6;
    audioRef.current = el;
    return () => {
      el.pause();
      audioRef.current = null;
    };
  }, []);

  const setSource = (link: string) => {
    if (!link || link === source) return;
    setSourceState(link);
    if (audioRef.current) {
      audioRef.current.src = driveAudioUrl(link);
      setReady(true);
    }
  };

  const start = () => {
    const el = audioRef.current;
    if (!el || !el.src) return;
    el.play()
      .then(() => setPlaying(true))
      .catch(() => setPlaying(false));
  };

  const toggle = () => {
    const el = audioRef.current;
    if (!el || !el.src) return;
    if (el.paused) {
      el.play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
    } else {
      el.pause();
      setPlaying(false);
    }
  };

  return (
    <Ctx.Provider value={{ playing, ready, start, toggle, setSource }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAudio() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAudio must be used within AudioProvider");
  return ctx;
}

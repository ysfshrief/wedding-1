"use client";

import { useEffect, useState } from "react";
import { subscribeSettings } from "@/lib/data";
import { DEFAULT_SETTINGS } from "@/config/defaults";
import type { Settings } from "@/types";

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeSettings((s) => {
      setSettings(s);
      setLoading(false);
    });
    return () => {
      if (unsub) unsub();
    };
  }, []);

  return { settings, loading };
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSettings, getVisits } from "@/lib/data";
import { DEFAULT_SETTINGS, SITE_URL } from "@/config/defaults";
import type { Settings } from "@/types";
import { SettingsTab } from "./SettingsTab";
import { GalleryTab } from "./GalleryTab";
import { MessagesTab } from "./MessagesTab";
import { VideosTab } from "./VideosTab";

type Tab = "settings" | "gallery" | "messages" | "videos";

const TABS: { id: Tab; label: string }[] = [
  { id: "settings", label: "الإعدادات" },
  { id: "gallery", label: "الألبوم" },
  { id: "messages", label: "الرسائل" },
  { id: "videos", label: "روابط الصور" },
];

export function AdminDashboard() {
  const router = useRouter();
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState<Tab>("settings");
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [visits, setVisits] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("admin_ok") !== "1") {
      router.replace("/");
      return;
    }
    setAuthed(true);
    getSettings().then(setSettings);
    getVisits().then(setVisits);
  }, [router]);

  const copyLink = () => {
    navigator.clipboard.writeText(SITE_URL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const logout = () => {
    sessionStorage.removeItem("admin_ok");
    router.replace("/");
  };

  if (!authed) return null;

  return (
    <div dir="rtl" lang="ar" className="min-h-screen bg-cream font-arSans">
      <header className="sticky top-0 z-30 border-b border-champagne/20 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-4">
          <h1 className="font-ar text-xl font-bold text-espresso">
            لوحة التحكم
          </h1>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-champagne/10 px-3 py-1.5 text-sm text-champagne-dark">
              👁 {visits} زيارة
            </span>
            <button
              onClick={copyLink}
              className="rounded-full border border-champagne/40 px-3 py-1.5 text-sm text-espresso transition hover:bg-champagne/10"
            >
              {copied ? "✓ تم النسخ" : "نسخ رابط الموقع"}
            </button>
            <button
              onClick={logout}
              className="rounded-full bg-espresso px-3 py-1.5 text-sm text-ivory transition hover:bg-espresso-light"
            >
              خروج
            </button>
          </div>
        </div>
        <nav className="mx-auto flex max-w-5xl gap-1 overflow-x-auto px-4 pb-2">
          {TABS.map((tb) => (
            <button
              key={tb.id}
              onClick={() => setTab(tb.id)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm transition ${
                tab === tb.id
                  ? "bg-espresso text-ivory"
                  : "text-charcoal hover:bg-champagne/10"
              }`}
            >
              {tb.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        {tab === "settings" && (
          <SettingsTab settings={settings} onChange={setSettings} />
        )}
        {tab === "gallery" && <GalleryTab />}
        {tab === "messages" && <MessagesTab />}
        {tab === "videos" && <VideosTab />}
      </main>
    </div>
  );
}

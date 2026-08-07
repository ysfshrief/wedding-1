"use client";

import { useState } from "react";
import { saveSettings } from "@/lib/data";
import type { Settings, SectionToggles } from "@/types";

interface Props {
  settings: Settings;
  onChange: (s: Settings) => void;
}

function Field({
  label,
  value,
  onChange,
  ltr,
  textarea,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  ltr?: boolean;
  textarea?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-charcoal/80">{label}</span>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          dir={ltr ? "ltr" : undefined}
          className="resize-none rounded-xl border border-gold/30 bg-white px-4 py-2.5 outline-none focus:border-gold"
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          dir={ltr ? "ltr" : undefined}
          className="rounded-xl border border-gold/30 bg-white px-4 py-2.5 outline-none focus:border-gold"
        />
      )}
    </label>
  );
}

const SECTION_LABELS: Record<keyof SectionToggles, string> = {
  hero: "الغلاف والتفاصيل",
  countdown: "العد التنازلي",
  gallery: "الألبوم",
  guestbook: "دفتر الرسائل",
  sharePhotos: "شارك صورك",
};

export function SettingsTab({ settings, onChange }: Props) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const set = <K extends keyof Settings>(key: K, val: Settings[K]) =>
    onChange({ ...settings, [key]: val });

  const toggleSection = (key: keyof SectionToggles) =>
    onChange({
      ...settings,
      sections: { ...settings.sections, [key]: !settings.sections[key] },
    });

  const save = async () => {
    setSaving(true);
    await saveSettings(settings);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6">
      <Card title="أسماء العروسين">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="اسم العريس (عربي)"
            value={settings.groomName}
            onChange={(v) => set("groomName", v)}
          />
          <Field
            label="Groom (English)"
            value={settings.groomNameEn}
            onChange={(v) => set("groomNameEn", v)}
            ltr
          />
          <Field
            label="اسم العروسة (عربي)"
            value={settings.brideName}
            onChange={(v) => set("brideName", v)}
          />
          <Field
            label="Bride (English)"
            value={settings.brideNameEn}
            onChange={(v) => set("brideNameEn", v)}
            ltr
          />
        </div>
      </Card>

      <Card title="الآية والتفاصيل">
        <div className="grid gap-4">
          <Field
            label="الآية"
            value={settings.bibleVerse}
            onChange={(v) => set("bibleVerse", v)}
            textarea
          />
          <Field
            label="مرجع الآية"
            value={settings.bibleVerseRef}
            onChange={(v) => set("bibleVerseRef", v)}
          />
          <Field
            label="تاريخ ووقت الفرح (ISO)"
            value={settings.weddingDate}
            onChange={(v) => set("weddingDate", v)}
            ltr
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="الوقت (عربي)"
              value={settings.timeLabel}
              onChange={(v) => set("timeLabel", v)}
            />
            <Field
              label="Time (English)"
              value={settings.timeLabelEn}
              onChange={(v) => set("timeLabelEn", v)}
              ltr
            />
          </div>
        </div>
      </Card>

      <Card title="المكان">
        <div className="grid gap-4">
          <Field
            label="المكان (عربي)"
            value={settings.location}
            onChange={(v) => set("location", v)}
          />
          <Field
            label="Location (English)"
            value={settings.locationEn}
            onChange={(v) => set("locationEn", v)}
            ltr
          />
          <Field
            label="رابط خرائط جوجل"
            value={settings.mapsLink}
            onChange={(v) => set("mapsLink", v)}
            ltr
          />
        </div>
      </Card>

      <Card title="الوسائط">
        <div className="grid gap-4">
          <Field
            label="صورة الغلاف (Google Drive link)"
            value={settings.heroImage}
            onChange={(v) => set("heroImage", v)}
            ltr
          />
          <Field
            label="رابط الموسيقى (Google Drive link)"
            value={settings.musicLink}
            onChange={(v) => set("musicLink", v)}
            ltr
          />
        </div>
      </Card>

      <Card title="تفعيل / إخفاء الأقسام">
        <div className="grid gap-3 sm:grid-cols-2">
          {(Object.keys(SECTION_LABELS) as (keyof SectionToggles)[]).map(
            (key) => (
              <label
                key={key}
                className="flex items-center justify-between rounded-xl border border-gold/20 bg-white px-4 py-3"
              >
                <span className="text-charcoal">{SECTION_LABELS[key]}</span>
                <button
                  onClick={() => toggleSection(key)}
                  className={`relative h-6 w-11 rounded-full transition ${
                    settings.sections[key] ? "bg-gold" : "bg-charcoal/20"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
                      settings.sections[key] ? "right-0.5" : "right-5"
                    }`}
                  />
                </button>
              </label>
            )
          )}
        </div>
      </Card>

      <div className="sticky bottom-4 flex justify-end">
        <button
          onClick={save}
          disabled={saving}
          className="btn-luxe shadow-luxe disabled:opacity-60"
        >
          {saving ? "جاري الحفظ..." : saved ? "✓ تم الحفظ" : "حفظ التغييرات"}
        </button>
      </div>
    </div>
  );
}

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-gold/20 bg-white/60 p-6 shadow-soft">
      <h2 className="mb-4 font-ar text-lg font-bold text-burgundy">{title}</h2>
      {children}
    </section>
  );
}

"use client";

import { useEffect, useState } from "react";
import {
  addGalleryItem,
  deleteGalleryItem,
  getGallery,
} from "@/lib/data";
import { driveImageUrl } from "@/lib/drive";
import type { GalleryItem } from "@/types";
import { reportAdminError } from "./errors";

export function GalleryTab() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setItems(await getGallery());
    } catch (err) {
      reportAdminError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const add = async () => {
    if (!link.trim()) return;
    try {
      await addGalleryItem(link.trim());
      setLink("");
      load();
    } catch (err) {
      reportAdminError(err);
    }
  };

  const remove = async (id: string) => {
    try {
      await deleteGalleryItem(id);
      load();
    } catch (err) {
      reportAdminError(err);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-2xl border border-champagne/20 bg-white/60 p-6 shadow-soft">
        <h2 className="mb-4 font-ar text-lg font-bold text-espresso">
          إضافة صورة للألبوم
        </h2>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="Google Drive image link"
            dir="ltr"
            className="flex-1 rounded-xl border border-champagne/30 bg-white px-4 py-2.5 outline-none focus:border-champagne"
          />
          <button onClick={add} className="btn-luxe whitespace-nowrap">
            إضافة
          </button>
        </div>
      </section>

      {loading ? (
        <p className="text-center text-charcoal/60">جاري التحميل...</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {items.map((it) => (
            <div
              key={it.id}
              className="group relative overflow-hidden rounded-xl shadow-soft"
            >
              {/* Drive thumbnails are already resized by Google. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={driveImageUrl(it.driveLink, 400)}
                alt=""
                className="aspect-square w-full object-cover"
                loading="lazy"
              />
              <button
                onClick={() => remove(it.id)}
                className="absolute right-2 top-2 rounded-full bg-espresso/90 px-2.5 py-1 text-xs text-ivory opacity-0 transition group-hover:opacity-100"
              >
                حذف
              </button>
            </div>
          ))}
          {items.length === 0 && (
            <p className="col-span-full text-center text-charcoal/60">
              لا توجد صور بعد
            </p>
          )}
        </div>
      )}
    </div>
  );
}

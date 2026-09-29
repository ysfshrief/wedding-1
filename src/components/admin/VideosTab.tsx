"use client";

import { useEffect, useState } from "react";
import {
  deleteVideo,
  getAllVideos,
  setVideoStatus,
} from "@/lib/data";
import type { ModerationStatus, VideoLink } from "@/types";
import { reportAdminError } from "./errors";

const STATUS_LABEL: Record<ModerationStatus, string> = {
  pending: "قيد المراجعة",
  approved: "مقبولة",
  rejected: "مرفوضة",
};
const STATUS_STYLE: Record<ModerationStatus, string> = {
  pending: "bg-champagne/15 text-champagne-dark",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-espresso/10 text-espresso",
};

export function VideosTab() {
  const [items, setItems] = useState<VideoLink[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setItems(await getAllVideos());
    } catch (err) {
      reportAdminError(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);

  const act = async (id: string, status: ModerationStatus) => {
    try {
      await setVideoStatus(id, status);
      load();
    } catch (err) {
      reportAdminError(err);
    }
  };
  const remove = async (id: string) => {
    try {
      await deleteVideo(id);
      load();
    } catch (err) {
      reportAdminError(err);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-charcoal/70">
        الروابط المقبولة تظهر تلقائياً داخل الألبوم.
      </p>
      {loading ? (
        <p className="text-center text-charcoal/60">جاري التحميل...</p>
      ) : items.length === 0 ? (
        <p className="text-center text-charcoal/60">لا توجد روابط</p>
      ) : (
        <div className="grid gap-3">
          {items.map((v) => (
            <div
              key={v.id}
              className="flex min-w-0 flex-col gap-3 rounded-2xl border border-champagne/20 bg-white/70 p-4 shadow-soft sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-ar font-bold text-espresso">
                    {v.name}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${STATUS_STYLE[v.status]}`}
                  >
                    {STATUS_LABEL[v.status]}
                  </span>
                </div>
                <a
                  href={v.driveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  dir="ltr"
                  className="block truncate text-sm text-champagne-dark underline"
                >
                  {v.driveLink}
                </a>
              </div>
              <div className="flex flex-wrap gap-2">
                {v.status !== "approved" && (
                  <button
                    onClick={() => act(v.id, "approved")}
                    className="rounded-full bg-green-600 px-3 py-1.5 text-sm text-white hover:bg-green-700"
                  >
                    قبول
                  </button>
                )}
                {v.status !== "rejected" && (
                  <button
                    onClick={() => act(v.id, "rejected")}
                    className="rounded-full bg-charcoal/70 px-3 py-1.5 text-sm text-white hover:bg-charcoal"
                  >
                    رفض
                  </button>
                )}
                <button
                  onClick={() => remove(v.id)}
                  className="rounded-full bg-espresso px-3 py-1.5 text-sm text-white hover:bg-espresso-light"
                >
                  حذف
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

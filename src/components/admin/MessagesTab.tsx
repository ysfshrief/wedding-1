"use client";

import { useEffect, useState } from "react";
import {
  deleteMessage,
  getAllMessages,
  setMessageStatus,
} from "@/lib/data";
import type { GuestMessage, ModerationStatus } from "@/types";
import { reportAdminError } from "./errors";

const STATUS_STYLE: Record<ModerationStatus, string> = {
  pending: "bg-champagne/15 text-champagne-dark",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-espresso/10 text-espresso",
};
const STATUS_LABEL: Record<ModerationStatus, string> = {
  pending: "قيد المراجعة",
  approved: "مقبولة",
  rejected: "مرفوضة",
};

export function MessagesTab() {
  const [items, setItems] = useState<GuestMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<ModerationStatus | "all">("pending");

  const load = async () => {
    try {
      setItems(await getAllMessages());
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
      await setMessageStatus(id, status);
      load();
    } catch (err) {
      reportAdminError(err);
    }
  };
  const remove = async (id: string) => {
    try {
      await deleteMessage(id);
      load();
    } catch (err) {
      reportAdminError(err);
    }
  };

  const filtered =
    filter === "all" ? items : items.filter((m) => m.status === filter);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap gap-2">
        {(["pending", "approved", "rejected", "all"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-1.5 text-sm transition ${
              filter === f
                ? "bg-espresso text-ivory"
                : "border border-champagne/30 text-charcoal hover:bg-champagne/10"
            }`}
          >
            {f === "all" ? "الكل" : STATUS_LABEL[f]}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-center text-charcoal/60">جاري التحميل...</p>
      ) : filtered.length === 0 ? (
        <p className="text-center text-charcoal/60">لا توجد رسائل</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((m) => (
            <div
              key={m.id}
              className="rounded-2xl border border-champagne/20 bg-white/70 p-5 shadow-soft"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="font-ar font-bold text-espresso">
                  {m.name}
                </span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs ${STATUS_STYLE[m.status]}`}
                >
                  {STATUS_LABEL[m.status]}
                </span>
              </div>
              <p className="leading-relaxed text-charcoal">{m.message}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {m.status !== "approved" && (
                  <button
                    onClick={() => act(m.id, "approved")}
                    className="rounded-full bg-green-600 px-3 py-1.5 text-sm text-white transition hover:bg-green-700"
                  >
                    قبول
                  </button>
                )}
                {m.status !== "rejected" && (
                  <button
                    onClick={() => act(m.id, "rejected")}
                    className="rounded-full bg-charcoal/70 px-3 py-1.5 text-sm text-white transition hover:bg-charcoal"
                  >
                    رفض
                  </button>
                )}
                <button
                  onClick={() => remove(m.id)}
                  className="rounded-full bg-espresso px-3 py-1.5 text-sm text-white transition hover:bg-espresso-light"
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

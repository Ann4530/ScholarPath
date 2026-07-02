"use client";

// Thanh nổi ở đáy màn hình khi user chọn học bổng để so sánh (E4-03).

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { scholarshipById } from "@/lib/data";
import { useTrack, MAX_COMPARE } from "@/lib/store";
import { flagEmoji } from "@/lib/ui";

export default function CompareBar() {
  const { t } = useTranslation();
  const { compare, toggleCompare, clearCompare } = useTrack();
  const pathname = usePathname();

  // Ẩn trên chính trang so sánh & trang login
  if (compare.length === 0 || pathname === "/compare" || pathname === "/login") return null;

  const items = compare.map((id) => scholarshipById(id)).filter(Boolean);

  return (
    <div className="animate-rise fixed inset-x-0 bottom-4 z-40 px-4">
      <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-700/60 bg-slate-900/95 px-4 py-3 text-white shadow-2xl backdrop-blur">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
          <span className="shrink-0 text-sm font-semibold text-slate-300">
            ⇄ {t("compareBar.label")} ({items.length}/{MAX_COMPARE})
          </span>
          {items.map((s) => s && (
            <span
              key={s.id}
              className="flex max-w-44 items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-xs ring-1 ring-white/20"
            >
              <span>{flagEmoji(s.countryCode)}</span>
              <span className="truncate">{s.title}</span>
              <button
                onClick={() => toggleCompare(s.id)}
                className="ml-0.5 text-slate-400 hover:text-rose-400"
                title={t("compareBar.removeTitle")}
              >
                ✕
              </button>
            </span>
          ))}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button onClick={clearCompare} className="text-xs text-slate-400 hover:text-white">
            {t("compareBar.clear")}
          </button>
          <Link
            href="/compare"
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
              items.length >= 2
                ? "bg-gradient-to-r from-indigo-500 to-violet-500 text-white hover:from-indigo-400 hover:to-violet-400"
                : "cursor-not-allowed bg-white/10 text-slate-400"
            }`}
            aria-disabled={items.length < 2}
            onClick={(e) => items.length < 2 && e.preventDefault()}
          >
            {t("compareBar.go")} →
          </Link>
        </div>
      </div>
    </div>
  );
}

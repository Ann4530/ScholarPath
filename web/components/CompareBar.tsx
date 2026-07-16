"use client";

// Thanh nổi ở đáy màn hình khi user chọn học bổng để so sánh (E4-03).

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { ArrowLeftRight, ArrowRight, X } from "lucide-react";
import { scholarshipById } from "@/lib/data";
import { useTrack, MAX_COMPARE } from "@/lib/store";
import CountryTag from "@/components/CountryTag";

export default function CompareBar() {
  const { t } = useTranslation();
  const { compare, toggleCompare, clearCompare } = useTrack();
  const pathname = usePathname();

  // Ẩn trên chính trang so sánh & trang login
  if (compare.length === 0 || pathname === "/compare" || pathname === "/login") return null;

  const items = compare.map((id) => scholarshipById(id)).filter(Boolean);

  return (
    <div className="animate-rise fixed inset-x-0 bottom-4 z-40 px-4">
      <div className="mx-auto flex max-w-[820px] flex-wrap items-center justify-between gap-3 rounded-[18px] border border-[#7896dc]/35 bg-[#101936]/95 px-4 py-3 text-white shadow-[0_20px_50px_-18px_rgba(0,0,0,0.7)] backdrop-blur">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
          <span className="flex shrink-0 items-center gap-1.5 text-sm font-semibold text-[#c5d2f0]">
            <ArrowLeftRight className="h-4 w-4" />
            {t("compareBar.label")} ({items.length}/{MAX_COMPARE})
          </span>
          {items.map((s) => s && (
            <span
              key={s.id}
              className="flex max-w-44 items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-xs ring-1 ring-white/20"
            >
              <CountryTag name={t(`country.${s.countryCode}`)} code={s.countryCode} tone="dark" />
              <span className="truncate">{s.title}</span>
              <button
                onClick={() => toggleCompare(s.id)}
                className="ml-0.5 text-[#93a7bd] hover:text-rose-400"
                title={t("compareBar.removeTitle")}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button onClick={clearCompare} className="text-xs text-[#93a7bd] hover:text-white">
            {t("compareBar.clear")}
          </button>
          <Link
            href="/compare"
            className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-bold transition ${
              items.length >= 2
                ? "bg-[#2f6fe0] text-white hover:brightness-110"
                : "cursor-not-allowed bg-white/10 text-[#93a7bd]"
            }`}
            aria-disabled={items.length < 2}
            onClick={(e) => items.length < 2 && e.preventDefault()}
          >
            {t("compareBar.go")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

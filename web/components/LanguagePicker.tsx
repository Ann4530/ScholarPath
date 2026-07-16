"use client";

// Bộ chọn ngôn ngữ (pattern tham khảo plucky/src/components/LanguagePicker.tsx):
// nút mã ngôn ngữ, bấm mở danh sách — mỗi mục có tên bản địa (đậm), tên tiếng Anh
// (phụ đề) và dấu tích ở mục đang chọn.
//
// Không dùng emoji cờ: Windows không có font emoji cờ nên 🇻🇳 rơi về cặp chữ "VN"
// trông như lỗi. Ngoài ra cờ ≠ ngôn ngữ (tiếng Đức không chỉ ở Đức).
//
// Với 18 ngôn ngữ, danh sách phải cuộn được và có ô lọc — bản 2 ngôn ngữ trước đây
// không cần.
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Check, Globe, Search } from "lucide-react";
import { setAppLanguage, TRANSLATED_CODES } from "@/lib/i18n";
import { SUPPORTED_LANGUAGES, languageDef, type LanguageCode } from "@/lib/i18n/languages";

// Chỉ hiện ngôn ngữ đã có bản dịch (xem TRANSLATED_CODES trong lib/i18n).
const AVAILABLE = SUPPORTED_LANGUAGES.filter((l) => TRANSLATED_CODES.includes(l.code));

export default function LanguagePicker() {
  const { i18n, t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const current = languageDef(i18n.language);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Lọc theo tên bản địa hoặc tên tiếng Anh — người dùng có thể gõ "german" hoặc "deutsch".
  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return AVAILABLE;
    return AVAILABLE.filter(
      (l) =>
        l.label.toLowerCase().includes(needle) ||
        l.english.toLowerCase().includes(needle) ||
        l.code.toLowerCase().includes(needle)
    );
  }, [q]);

  const choose = (code: LanguageCode) => {
    setOpen(false);
    setQ("");
    if (code !== i18n.language) setAppLanguage(code);
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        title={current.label}
        aria-label={t("language.label")}
        className={`flex items-center gap-1.5 rounded-[10px] border px-2.5 py-1.5 text-sm font-semibold transition ${
          open ? "border-[#9cc1f5] bg-white ring-2 ring-[#dbe8f7]" : "border-[#dce8f4] bg-white text-[#5a7794] hover:border-[#9cc1f5]"
        }`}
      >
        <Globe className="h-4 w-4 text-[#5a7794]" />
        <span className="max-w-[120px] truncate text-[13px] font-semibold text-[#1a3352]">{current.label}</span>
        <svg className={`h-3 w-3 text-[#93a7bd] transition-transform ${open ? "rotate-180" : ""}`} viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </button>

      {open && (
        <div className="animate-drop absolute right-0 z-50 mt-2 w-60 overflow-hidden rounded-[14px] border border-[#dce8f4] bg-white shadow-[0_18px_44px_-14px_rgba(23,50,76,0.4)]">
          <div className="flex items-center gap-2 border-b border-[#eef2f7] px-3 py-2">
            <Search className="h-3.5 w-3.5 shrink-0 text-[#93a7bd]" />
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t("language.search")}
              className="w-full bg-transparent text-[13px] text-[#1a3352] outline-none placeholder:text-[#a9b8c9]"
            />
          </div>

          <div className="sf-scroll max-h-[292px] overflow-y-auto py-1">
            {shown.length === 0 ? (
              <p className="px-3 py-6 text-center text-[12px] text-[#93a7bd]">{t("language.noMatch")}</p>
            ) : (
              shown.map((l) => {
                const active = l.code === i18n.language;
                return (
                  <button
                    key={l.code}
                    onClick={() => choose(l.code)}
                    className={`flex w-full items-center gap-2.5 px-3 py-2 text-left transition ${
                      active ? "bg-[#eaf1fd]" : "hover:bg-[#f6f9fd]"
                    }`}
                  >
                    <span className="min-w-0 flex-1">
                      <span className={`block truncate text-[13px] font-semibold ${active ? "text-[#1c5cc0]" : "text-[#1a3352]"}`}>{l.label}</span>
                      <span className="block truncate text-[11px] text-[#93a7bd]">{l.english}</span>
                    </span>
                    {active && <Check className="h-4 w-4 shrink-0 text-[#2f6fe0]" />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

// Bộ chọn ngôn ngữ (pattern tham khảo plucky/src/components/LanguagePicker.tsx):
// nút cờ + mã ngôn ngữ, bấm mở danh sách — mỗi mục có cờ, tên bản địa (đậm),
// tên tiếng Anh (phụ đề) và ✓ ở mục đang chọn.
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { setAppLanguage } from "@/lib/i18n";
import { SUPPORTED_LANGUAGES, languageDef, type LanguageCode } from "@/lib/i18n/languages";

export default function LanguagePicker() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
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

  const choose = (code: LanguageCode) => {
    setOpen(false);
    if (code !== i18n.language) setAppLanguage(code);
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        title={current.label}
        className={`flex items-center gap-1.5 rounded-[10px] border px-2.5 py-1.5 text-sm font-semibold transition ${
          open ? "border-[#9cc1f5] bg-white ring-2 ring-[#dbe8f7]" : "border-[#dce8f4] bg-white text-[#5a7794] hover:border-[#9cc1f5]"
        }`}
      >
        <span className="text-base leading-none">{current.flag}</span>
        <span className="uppercase">{current.code}</span>
        <svg className={`h-3 w-3 text-[#93a7bd] transition-transform ${open ? "rotate-180" : ""}`} viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </button>

      {open && (
        <div className="animate-drop absolute right-0 z-50 mt-2 w-52 overflow-hidden rounded-[14px] border border-[#dce8f4] bg-white shadow-[0_18px_44px_-14px_rgba(23,50,76,0.4)]">
          {SUPPORTED_LANGUAGES.map((l) => {
            const active = l.code === i18n.language;
            return (
              <button
                key={l.code}
                onClick={() => choose(l.code)}
                className={`flex w-full items-center gap-2.5 px-3 py-2.5 text-left transition ${
                  active ? "bg-[#eaf1fd]" : "hover:bg-[#f6f9fd]"
                }`}
              >
                <span className="text-lg leading-none">{l.flag}</span>
                <span className="flex-1">
                  <span className={`block text-sm font-semibold ${active ? "text-[#1c5cc0]" : "text-[#1a3352]"}`}>{l.label}</span>
                  <span className="block text-[11px] text-[#93a7bd]">{l.english}</span>
                </span>
                {active && <span className="text-[#2f6fe0]">✓</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

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
        className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-sm font-medium transition ${
          open ? "border-indigo-400 bg-white ring-2 ring-indigo-100" : "border-slate-300 bg-white text-slate-600 hover:border-indigo-400"
        }`}
      >
        <span className="text-base leading-none">{current.flag}</span>
        <span className="uppercase">{current.code}</span>
        <svg className={`h-3 w-3 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </button>

      {open && (
        <div className="animate-drop absolute right-0 z-40 mt-2 w-52 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
          {SUPPORTED_LANGUAGES.map((l) => {
            const active = l.code === i18n.language;
            return (
              <button
                key={l.code}
                onClick={() => choose(l.code)}
                className={`flex w-full items-center gap-2.5 px-3 py-2.5 text-left transition ${
                  active ? "bg-indigo-50" : "hover:bg-slate-50"
                }`}
              >
                <span className="text-lg leading-none">{l.flag}</span>
                <span className="flex-1">
                  <span className={`block text-sm font-semibold ${active ? "text-indigo-700" : "text-slate-800"}`}>{l.label}</span>
                  <span className="block text-[11px] text-slate-400">{l.english}</span>
                </span>
                {active && <span className="text-indigo-600">✓</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

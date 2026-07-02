"use client";

// Bộ lọc dạng "pill dropdown": chỉ khi bấm vào mới xổ danh sách lựa chọn.
// Dùng cho cả hàng lọc ngang (trang tìm kiếm) và các trang danh sách khác.

import { useEffect, useRef, useState } from "react";

export interface FilterOption {
  value: string;
  label: string;
}

export default function FilterDropdown({
  label,
  icon,
  options,
  selected,
  onToggle,
  onClear,
  searchable = false,
  align = "left",
}: {
  label: string;
  icon?: string;
  options: FilterOption[];
  selected: string[];
  onToggle: (value: string) => void;
  onClear: () => void;
  searchable?: boolean;
  align?: "left" | "right";
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  // Đóng khi bấm ra ngoài / nhấn Esc
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

  // Reset ô tìm nhanh mỗi lần mở/đóng panel
  const toggleOpen = () => {
    setQ("");
    setOpen((v) => !v);
  };

  const active = selected.length > 0;
  const shown = q.trim()
    ? options.filter((o) => o.label.toLowerCase().includes(q.trim().toLowerCase()))
    : options;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={toggleOpen}
        className={`flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3.5 py-2 text-sm font-medium transition ${
          active
            ? "border-indigo-600 bg-indigo-600 text-white shadow-sm"
            : open
              ? "border-indigo-400 bg-white text-slate-800 ring-2 ring-indigo-100"
              : "border-slate-300 bg-white text-slate-700 hover:border-indigo-400 hover:text-indigo-700"
        }`}
      >
        {icon && <span className="text-base leading-none">{icon}</span>}
        {label}
        {active && (
          <span className="grid h-5 min-w-5 place-items-center rounded-full bg-white px-1 text-xs font-bold text-indigo-600">
            {selected.length}
          </span>
        )}
        <svg
          className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`}
          viewBox="0 0 20 20" fill="currentColor"
        >
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </button>

      {open && (
        <div
          className={`animate-drop absolute z-40 mt-2 w-64 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          {searchable && (
            <div className="border-b border-slate-100 p-2">
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Tìm nhanh…"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm outline-none focus:border-indigo-400 focus:bg-white"
              />
            </div>
          )}
          <div className="thin-scroll max-h-64 overflow-y-auto p-2">
            {shown.length === 0 ? (
              <p className="px-2 py-3 text-center text-xs text-slate-400">Không có mục nào</p>
            ) : (
              shown.map((o) => {
                const checked = selected.includes(o.value);
                return (
                  <label
                    key={o.value}
                    className={`flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition ${
                      checked ? "bg-indigo-50 font-medium text-indigo-800" : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => onToggle(o.value)}
                      className="h-4 w-4 accent-indigo-600"
                    />
                    <span className="flex-1">{o.label}</span>
                  </label>
                );
              })
            )}
          </div>
          <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/60 px-3 py-2">
            <button
              type="button"
              onClick={onClear}
              disabled={!active}
              className="text-xs font-medium text-slate-400 enabled:text-slate-500 enabled:hover:text-rose-600 disabled:cursor-not-allowed"
            >
              Bỏ chọn
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg bg-indigo-600 px-3 py-1 text-xs font-semibold text-white hover:bg-indigo-700"
            >
              Xong
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

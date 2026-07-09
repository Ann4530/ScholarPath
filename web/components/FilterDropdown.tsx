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
        className={`flex items-center gap-1.5 whitespace-nowrap rounded-[11px] border px-3 py-2 text-[13px] font-semibold transition ${
          active
            ? "border-[#c8dcfa] bg-[#eaf1fd] text-[#2f6fe0]"
            : open
              ? "border-[#9cc1f5] bg-white text-[#1a3352]"
              : "border-[#dce8f4] bg-white text-[#5a7794] hover:border-[#9cc1f5] hover:text-[#2f6fe0]"
        }`}
      >
        {icon && <span className="text-base leading-none">{icon}</span>}
        {label}
        {active && (
          <span className="grid h-[18px] min-w-[18px] place-items-center rounded-full bg-[#2f6fe0] px-1.5 text-[10.5px] font-extrabold text-white">
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
          className={`animate-drop absolute z-50 mt-2 w-[246px] overflow-hidden rounded-[14px] border border-[#dce8f4] bg-white shadow-[0_18px_44px_-14px_rgba(23,50,76,0.4)] ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          {searchable && (
            <div className="border-b border-[#eef3f9] p-2">
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Tìm nhanh…"
                className="w-full rounded-lg border border-[#cfe0f2] bg-[#f6f9fd] px-3 py-1.5 text-sm text-[#1a3352] outline-none focus:border-[#2f6fe0] focus:bg-white"
              />
            </div>
          )}
          <div className="sf-scroll max-h-[290px] overflow-y-auto p-2">
            {shown.length === 0 ? (
              <p className="px-2 py-3 text-center text-xs text-[#93a7bd]">Không có mục nào</p>
            ) : (
              shown.map((o) => {
                const checked = selected.includes(o.value);
                return (
                  <label
                    key={o.value}
                    className={`flex cursor-pointer items-center gap-2.5 rounded-[9px] px-2.5 py-2 text-[13px] font-medium transition ${
                      checked ? "bg-[#eaf1fd] text-[#1c5cc0]" : "text-[#324a63] hover:bg-[#f6f9fd]"
                    }`}
                  >
                    <span
                      className={`grid h-[18px] w-[18px] shrink-0 place-items-center rounded-md border-2 ${
                        checked ? "border-[#2f6fe0] bg-[#2f6fe0]" : "border-[#cfe0f2] bg-white"
                      }`}
                    >
                      {checked && (
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                      )}
                    </span>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => onToggle(o.value)}
                      className="hidden"
                    />
                    <span className="flex-1">{o.label}</span>
                  </label>
                );
              })
            )}
          </div>
          <div className="flex items-center justify-between border-t border-[#eef3f9] bg-[#f6f9fd] px-3 py-2">
            <button
              type="button"
              onClick={onClear}
              disabled={!active}
              className="text-xs font-semibold text-[#93a7bd] enabled:text-[#5a7794] enabled:hover:text-[#d33a4a] disabled:cursor-not-allowed"
            >
              Bỏ chọn
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg bg-[#2f6fe0] px-3 py-1 text-xs font-bold text-white hover:brightness-105"
            >
              Xong
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

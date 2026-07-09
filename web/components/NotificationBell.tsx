"use client";

// Chuông thông báo trên NavBar: gom deadline sắp tới (≤14 ngày, kể cả quá hạn ≤30 ngày)
// và học bổng hồ sơ chưa xong mà hạn ≤30 ngày — bấm mở dropdown, đi thẳng tới việc cần làm.
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import { useTranslation } from "react-i18next";
import { scholarshipById, nextDeadline, daysLeft } from "@/lib/data";
import { useTrack } from "@/lib/store";
import { flagEmoji, deadlineColor, deadlineText } from "@/lib/ui";

interface NotifItem {
  id: string;
  title: string;
  countryCode: string;
  message: string;
  days: number;
  overdue: boolean;
  href: string;
}

export default function NotificationBell() {
  const { t } = useTranslation();
  const { tracked, progress } = useTrack();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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

  const items = useMemo<NotifItem[]>(() => {
    const list: NotifItem[] = [];
    for (const item of Object.values(tracked)) {
      const s = scholarshipById(item.scholarshipId);
      if (!s) continue;
      const dl = nextDeadline(s);
      if (!dl) continue;
      const days = daysLeft(dl.date);
      const prog = progress(s.id);
      const finished = item.stage === "da_nop" || item.stage === "phong_van" || item.stage === "ket_qua";

      // Deadline gần (≤14 ngày) hoặc vừa quá hạn (≤30 ngày trước) — trừ khi đã nộp
      if (!finished && days <= 14 && days >= -30) {
        list.push({
          id: s.id,
          title: s.title,
          countryCode: s.countryCode,
          message: t("notif.deadline", { type: dl.type, left: deadlineText(days, t) }),
          days,
          overdue: days < 0,
          href: `/scholarships/${s.id}`,
        });
      } else if (!finished && days <= 30 && prog < 100) {
        // Hồ sơ chưa xong mà hạn ≤30 ngày
        list.push({
          id: s.id,
          title: s.title,
          countryCode: s.countryCode,
          message: t("notif.docsLow", { p: prog, left: deadlineText(days, t) }),
          days,
          overdue: false,
          href: `/scholarships/${s.id}/documents`,
        });
      }
    }
    return list.sort((a, b) => a.days - b.days).slice(0, 8);
  }, [tracked, progress, t]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        title={t("notif.aria")}
        aria-label={t("notif.aria")}
        className={`relative grid h-9 w-9 place-items-center rounded-[10px] border text-[#5a7794] transition ${
          open ? "border-[#9cc1f5] bg-white ring-2 ring-[#dbe8f7]" : "border-[#dce8f4] bg-white hover:border-[#9cc1f5]"
        }`}
      >
        <Bell className="h-[18px] w-[18px]" />
        {items.length > 0 && (
          <span className="absolute -right-1.5 -top-1.5 grid h-4.5 min-w-4 place-items-center rounded-full bg-rose-500 px-1 text-[10px] font-bold leading-none text-white">
            {items.length}
          </span>
        )}
      </button>

      {open && (
        <div className="animate-drop absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-[14px] border border-[#dce8f4] bg-white shadow-[0_18px_44px_-14px_rgba(23,50,76,0.4)]">
          <p className="flex items-center gap-1.5 border-b border-[#eef3f9] px-3.5 py-2.5 text-sm font-bold text-[#1a3352]"><Bell className="h-4 w-4 text-[#2f6fe0]" /> {t("notif.title")}</p>
          {items.length === 0 ? (
            <p className="px-3.5 py-6 text-center text-sm text-[#93a7bd]">{t("notif.empty")}</p>
          ) : (
            <ul className="sf-scroll max-h-80 overflow-y-auto">
              {items.map((n) => (
                <li key={n.id + n.href}>
                  <Link href={n.href} onClick={() => setOpen(false)}
                    className="flex items-start gap-2.5 border-b border-[#f3f7fb] px-3.5 py-2.5 transition hover:bg-[#f6f9fd]">
                    <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${n.overdue ? "bg-[#93a7bd]" : n.days <= 7 ? "bg-[#d33a4a]" : "bg-[#e0921a]"}`} />
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-[#1a3352]">
                        {flagEmoji(n.countryCode)} {n.title}
                      </span>
                      <span className={`block text-xs ${deadlineColor(n.days)}`}>
                        {n.overdue && <b className="mr-1 rounded bg-[#eef3f9] px-1 text-[10px] uppercase text-[#5a7794]">{t("notif.overdueTag")}</b>}
                        {n.message}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <Link href="/profile" onClick={() => setOpen(false)}
            className="block bg-[#f6f9fd] px-3.5 py-2.5 text-center text-xs font-bold text-[#2f6fe0] hover:bg-[#eef4fb]">
            {t("notif.viewProfile")}
          </Link>
        </div>
      )}
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Sparkles } from "lucide-react";
import { useTrack } from "@/lib/store";
import LanguagePicker from "@/components/LanguagePicker";
import NotificationBell from "@/components/NotificationBell";

export default function NavBar({ children }: { children?: React.ReactNode }) {
  const pathname = usePathname();
  const { count } = useTrack();
  const { t } = useTranslation();

  const link = (href: string, label: string, badge?: number) => {
    const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
    return (
      <Link
        href={href}
        className={`relative flex items-center gap-1.5 rounded-[9px] px-3.5 py-2 text-[13.5px] transition ${
          active
            ? "bg-white font-bold text-[#1a3352] shadow-[0_1px_3px_rgba(23,50,76,0.08)]"
            : "font-semibold text-[#5a7794] hover:text-[#1a3352]"
        }`}
      >
        {label}
        {badge ? (
          <span className="grid h-5 min-w-5 items-center justify-center rounded-full bg-[#2f6fe0] px-1.5 text-[11px] font-bold text-white">
            {badge}
          </span>
        ) : null}
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[#d9e6f3] bg-[#eef4fb]/85 backdrop-blur-[12px]">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-3">
        <Link href="/" title={t("nav.home")} aria-label={t("nav.home")} className="flex items-center gap-2.5 transition hover:opacity-80">
          <span className="grid h-9 w-9 place-items-center rounded-[11px] bg-gradient-to-br from-[#1e3a8a] to-[#3b82f6] text-white shadow-[0_6px_16px_-7px_rgba(30,58,138,0.7)]">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="#fff">
              <path d="M2.5 19h19v2h-19zM22.07 9.64c-.21-.8-1.04-1.28-1.84-1.06L14.92 10 8.46 3.98l-1.93.52 3.87 6.7-4.97 1.34-1.97-1.54-1.45.39 2.59 4.49 17.42-4.67c.81-.23 1.28-1.05 1.06-1.86z" />
            </svg>
          </span>
          <span className="text-[19px] font-extrabold tracking-tight text-[#1a3352]">
            Scholar<span className="text-[#2f6fe0]">Finder</span>
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <nav className="flex items-center gap-1 rounded-xl bg-[#dbe8f7] p-1">
            {link("/explore", t("nav.search"))}
            {link("/professors", t("nav.professors"))}
            {link("/board", t("nav.board"), count)}
            {link("/profile", t("account.navTitle"))}
          </nav>
          <Link
            href="/start"
            className="hidden items-center gap-1.5 rounded-[10px] bg-gradient-to-br from-[#1e3a8a] to-[#3b82f6] px-3.5 py-2 text-[13px] font-bold text-white shadow-[0_8px_18px_-10px_rgba(30,58,138,0.8)] transition hover:brightness-110 sm:flex"
          >
            <Sparkles className="h-4 w-4" /> {t("nav.start")}
          </Link>
          <NotificationBell />
          <LanguagePicker />
          {children}
        </div>
      </div>
    </header>
  );
}

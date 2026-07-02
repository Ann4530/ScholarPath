"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
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
        className={`relative rounded-lg px-3 py-2 text-sm font-medium transition ${
          active ? "bg-indigo-600 text-white" : "text-slate-600 hover:bg-slate-100"
        }`}
      >
        {label}
        {badge ? (
          <span
            className={`ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-xs font-bold ${
              active ? "bg-white text-indigo-600" : "bg-indigo-600 text-white"
            }`}
          >
            {badge}
          </span>
        ) : null}
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-600 text-lg font-black text-white">
            S
          </span>
          <span className="text-lg font-bold text-slate-900">
            Scholar<span className="text-indigo-600">Finder</span>
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <nav className="flex items-center gap-1">
            {link("/", t("nav.search"))}
            {link("/professors", t("nav.professors"))}
            {link("/board", t("nav.board"), count)}
            {link("/profile", t("account.navTitle"))}
            <Link
              href="/start"
              className="ml-1 hidden rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:from-indigo-500 hover:to-violet-500 sm:block"
            >
              ✨ {t("nav.start")}
            </Link>
          </nav>
          <NotificationBell />
          <LanguagePicker />
          {children}
        </div>
      </div>
    </header>
  );
}

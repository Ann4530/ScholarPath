"use client";

import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="border-t border-[#dbe6f2]">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-3 px-6 py-6">
        <div className="flex items-center gap-2.5">
          <span className="grid h-7 w-7 place-items-center rounded-[9px] bg-gradient-to-br from-[#1e3a8a] to-[#3b82f6] text-white">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="#fff"><path d="M2.5 19h19v2h-19zM22.07 9.64c-.21-.8-1.04-1.28-1.84-1.06L14.92 10 8.46 3.98l-1.93.52 3.87 6.7-4.97 1.34-1.97-1.54-1.45.39 2.59 4.49 17.42-4.67c.81-.23 1.28-1.05 1.06-1.86z" /></svg>
          </span>
          <span className="text-[13px] font-bold text-[#1a3352]">ScholarFinder</span>
        </div>
        <p className="text-[11.5px] text-[#93a7bd]">
          {t("footer.demo1")} <b className="text-[#5a7794]">{t("footer.demo2")}</b> {t("footer.demo3")}
        </p>
      </div>
    </footer>
  );
}

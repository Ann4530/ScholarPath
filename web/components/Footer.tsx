"use client";

import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-6 text-xs text-slate-500">
        {t("footer.demo1")} <b>{t("footer.demo2")}</b> {t("footer.demo3")}
      </div>
    </footer>
  );
}

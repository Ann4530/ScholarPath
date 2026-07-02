"use client";

// Bọc app bằng i18next. Server prerender bằng ngôn ngữ mặc định;
// sau khi mount mới khôi phục ngôn ngữ đã lưu/của trình duyệt (tránh hydration mismatch).
import { useEffect } from "react";
import { I18nextProvider } from "react-i18next";
import i18n, { restoreLanguage } from "@/lib/i18n";

export default function I18nProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    restoreLanguage();
  }, []);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}

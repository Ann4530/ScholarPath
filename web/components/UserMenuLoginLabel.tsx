"use client";

// Nhãn nút "Đăng nhập / Đăng ký" — tách client để dịch được (UserMenu là server component).
import { useTranslation } from "react-i18next";

export default function UserMenuLoginLabel() {
  const { t } = useTranslation();
  return <span>{t("nav.login")}</span>;
}

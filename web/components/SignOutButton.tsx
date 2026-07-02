"use client";

// Nút Đăng xuất — client component để dịch được nhãn (form + server action ở UserMenu).
import { useTranslation } from "react-i18next";

export default function SignOutButton() {
  const { t } = useTranslation();
  return (
    <button
      type="submit"
      className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
    >
      {t("nav.signOut")}
    </button>
  );
}

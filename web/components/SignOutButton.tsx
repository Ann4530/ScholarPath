"use client";

// Nút Đăng xuất — client component để dịch được nhãn (form + server action ở UserMenu).
import { useTranslation } from "react-i18next";

export default function SignOutButton() {
  const { t } = useTranslation();
  return (
    <button
      type="submit"
      className="rounded-[10px] border border-[#dce8f4] bg-white px-3 py-1.5 text-sm font-semibold text-[#5a7794] transition hover:border-[#9cc1f5] hover:text-[#2f6fe0]"
    >
      {t("nav.signOut")}
    </button>
  );
}

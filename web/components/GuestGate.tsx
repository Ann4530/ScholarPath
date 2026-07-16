"use client";

// Bọc nội dung chỉ dành cho thành viên (wizard, tracker, trang cá nhân).
// Khách thấy màn mời đăng nhập; children chỉ render khi đã đăng nhập (nên hook
// bên trong không chạy với khách).
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Lock } from "lucide-react";
import { useAuth } from "@/components/AuthContext";

export default function GuestGate({ children }: { children: React.ReactNode }) {
  const { loggedIn } = useAuth();
  const { t } = useTranslation();

  if (loggedIn) return <>{children}</>;

  return (
    <div className="mx-auto grid max-w-md place-items-center px-4 py-24 text-center">
      <div className="grid h-14 w-14 place-items-center rounded-full bg-[#eaf1fd] text-[#2f6fe0]">
        <Lock className="h-7 w-7" />
      </div>
      <h1 className="mt-4 text-xl font-extrabold text-[#1a3352]">{t("authGate.title")}</h1>
      <p className="mt-2 text-sm leading-relaxed text-[#5a7794]">{t("authGate.desc")}</p>
      <Link
        href="/login"
        className="mt-5 rounded-[12px] bg-[#2f6fe0] px-5 py-2.5 text-sm font-bold text-white transition hover:brightness-110"
      >
        {t("authGate.cta")}
      </Link>
    </div>
  );
}

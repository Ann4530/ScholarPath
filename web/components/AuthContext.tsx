"use client";

// Trạng thái đăng nhập cho phía client + "cổng" cá nhân hóa.
//
// Site công khai: khách xem/tìm/lọc học bổng thoải mái. Nhưng các tính năng CÁ NHÂN
// HÓA (Match Score, hồ sơ, wizard, theo dõi, tracker) yêu cầu đăng nhập. Component
// gọi requireAuth(fn): nếu đã đăng nhập thì chạy fn; nếu là khách thì hiện lời mời
// đăng nhập và trả về false (không chạy fn).
//
// loggedIn được xác định phía server (layout gọi auth()) rồi truyền xuống — nên
// không cần fetch session ở client.
import { createContext, useContext, useState, type ReactNode } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Lock } from "lucide-react";

interface AuthCtx {
  loggedIn: boolean;
  /** Chạy fn nếu đã đăng nhập; nếu là khách thì mở lời mời đăng nhập. Trả về loggedIn. */
  requireAuth: (fn?: () => void) => boolean;
}

const Ctx = createContext<AuthCtx>({ loggedIn: false, requireAuth: () => false });

export const useAuth = () => useContext(Ctx);

export default function AuthProvider({
  loggedIn,
  children,
}: {
  loggedIn: boolean;
  children: ReactNode;
}) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const requireAuth = (fn?: () => void) => {
    if (loggedIn) {
      fn?.();
      return true;
    }
    setOpen(true);
    return false;
  };

  return (
    <Ctx.Provider value={{ loggedIn, requireAuth }}>
      {children}
      {open && (
        <div
          className="fixed inset-0 z-[100] grid place-items-center bg-[#0b1020]/55 p-4 backdrop-blur-[2px]"
          onClick={() => setOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="animate-drop w-full max-w-sm rounded-[20px] bg-white p-6 text-center shadow-[0_30px_70px_-20px_rgba(11,16,32,0.6)]"
          >
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#eaf1fd] text-[#2f6fe0]">
              <Lock className="h-6 w-6" />
            </div>
            <h2 className="mt-3.5 text-[17px] font-extrabold text-[#1a3352]">{t("authGate.title")}</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-[#5a7794]">{t("authGate.desc")}</p>
            <Link
              href="/login"
              className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-[12px] bg-[#2f6fe0] px-4 py-2.5 text-sm font-bold text-white transition hover:brightness-110"
            >
              {t("authGate.cta")}
            </Link>
            <button
              onClick={() => setOpen(false)}
              className="mt-2 w-full rounded-[12px] px-4 py-2 text-sm font-semibold text-[#7591ab] transition hover:bg-[#f6f9fd]"
            >
              {t("authGate.later")}
            </button>
          </div>
        </div>
      )}
    </Ctx.Provider>
  );
}

import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import { auth } from "@/auth";
import { TrackProvider } from "@/lib/store";
import I18nProvider from "@/components/I18nProvider";
import AuthProvider from "@/components/AuthContext";
import NavBar from "@/components/NavBar";
import UserMenu from "@/components/UserMenu";
import CompareBar from "@/components/CompareBar";
import Footer from "@/components/Footer";

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ScholarFinder — Tìm học bổng du học & theo dõi hồ sơ",
  description:
    "Tìm học bổng du học phù hợp theo hồ sơ, xem yêu cầu & kỳ nhập học, tìm giáo sư hướng dẫn, lập checklist chuẩn bị và theo dõi tiến độ ứng tuyển.",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Xác định đăng nhập phía server, truyền xuống client để "cổng" cá nhân hóa.
  const session = await auth();
  const loggedIn = !!session?.user;

  return (
    <html lang="vi" className={`h-full antialiased ${beVietnamPro.className}`}>
      <body className="min-h-full flex flex-col bg-[#eef4fb] text-[#1a3352]">
        <I18nProvider>
          <TrackProvider>
            <AuthProvider loggedIn={loggedIn}>
              <NavBar>
                <UserMenu />
              </NavBar>
              <main className="flex-1">{children}</main>
              <CompareBar />
              <Footer />
            </AuthProvider>
          </TrackProvider>
        </I18nProvider>
      </body>
    </html>
  );
}

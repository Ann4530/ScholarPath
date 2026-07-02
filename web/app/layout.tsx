import type { Metadata } from "next";
import "./globals.css";
import { TrackProvider } from "@/lib/store";
import I18nProvider from "@/components/I18nProvider";
import NavBar from "@/components/NavBar";
import UserMenu from "@/components/UserMenu";
import CompareBar from "@/components/CompareBar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "ScholarFinder — Tìm học bổng du học & theo dõi hồ sơ",
  description:
    "Tìm học bổng du học phù hợp theo hồ sơ, xem yêu cầu & kỳ nhập học, tìm giáo sư hướng dẫn, lập checklist chuẩn bị và theo dõi tiến độ ứng tuyển.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-800">
        <I18nProvider>
          <TrackProvider>
            <NavBar>
              <UserMenu />
            </NavBar>
            <main className="flex-1">{children}</main>
            <CompareBar />
            <Footer />
          </TrackProvider>
        </I18nProvider>
      </body>
    </html>
  );
}

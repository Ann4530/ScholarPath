import type { Metadata } from "next";
import "./globals.css";
import { TrackProvider } from "@/lib/store";
import NavBar from "@/components/NavBar";
import UserMenu from "@/components/UserMenu";

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
        <TrackProvider>
          <NavBar>
            <UserMenu />
          </NavBar>
          <main className="flex-1">{children}</main>
          <footer className="border-t border-slate-200 bg-white">
            <div className="mx-auto max-w-7xl px-4 py-6 text-xs text-slate-500">
              ScholarFinder · Bản demo minh họa luồng nghiệp vụ. Dữ liệu học bổng
              &amp; giáo sư là <b>mẫu minh họa</b> — luôn kiểm tra tại nguồn chính
              thức trước khi nộp hồ sơ.
            </div>
          </footer>
        </TrackProvider>
      </body>
    </html>
  );
}

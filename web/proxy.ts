// Next.js 16: "Middleware" đã đổi tên thành "Proxy" (proxy.ts).
// Chặn toàn bộ site: chưa đăng nhập -> chuyển tới /login.
import { auth } from "@/auth";

export const proxy = auth((req) => {
  const { pathname } = req.nextUrl;
  const isPublic = pathname === "/login" || pathname.startsWith("/api/auth");

  // Chưa đăng nhập và truy cập trang bảo vệ -> về /login
  if (!req.auth && !isPublic) {
    const url = new URL("/login", req.nextUrl.origin);
    if (pathname !== "/") url.searchParams.set("callbackUrl", pathname);
    return Response.redirect(url);
  }

  // Đã đăng nhập mà vào /login -> về trang chủ
  if (req.auth && pathname === "/login") {
    return Response.redirect(new URL("/", req.nextUrl.origin));
  }
});

export const config = {
  // Chạy proxy trên mọi route, trừ tài nguyên tĩnh
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

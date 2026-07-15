// Next.js 16: "Middleware" đã đổi tên thành "Proxy" (proxy.ts).
// Site ở chế độ CÔNG KHAI: ai cũng xem được, không bắt buộc đăng nhập.
// Đăng nhập chỉ để cá nhân hóa (đồng bộ hồ sơ). Chỉ giữ một tiện ích nhỏ:
// đã đăng nhập mà vào /login thì đưa về trang chủ.
import { auth } from "@/auth";

export const proxy = auth((req) => {
  const { pathname } = req.nextUrl;
  if (req.auth && pathname === "/login") {
    return Response.redirect(new URL("/", req.nextUrl.origin));
  }
});

export const config = {
  // Chỉ cần chạy trên /login để xử lý redirect ở trên; tránh gọi auth() trên mọi route.
  matcher: ["/login"],
};

import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

// Danh sách email được phép truy cập (đọc từ biến môi trường ALLOWED_EMAILS)
// Ví dụ: ALLOWED_EMAILS="a@gmail.com, b@company.com"
const allowedEmails = (process.env.ALLOWED_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  providers: [Google],
  pages: {
    signIn: "/login",
    error: "/login", // lỗi (vd không nằm trong allowlist) quay về /login
  },
  callbacks: {
    // Chỉ cho phép đăng nhập nếu email nằm trong danh sách cho phép
    signIn({ user }) {
      const email = user.email?.toLowerCase();
      if (allowedEmails.length === 0) return false; // fail-closed: chưa cấu hình -> chặn hết
      return !!email && allowedEmails.includes(email);
    },
  },
});

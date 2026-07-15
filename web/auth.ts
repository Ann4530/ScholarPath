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
    // Đăng ký/đăng nhập MỞ để cá nhân hóa: ai có Google cũng vào được.
    // Nếu quản trị viên đặt ALLOWED_EMAILS thì mới giới hạn theo danh sách đó.
    signIn({ user }) {
      if (allowedEmails.length === 0) return true; // mở: cho phép mọi tài khoản
      const email = user.email?.toLowerCase();
      return !!email && allowedEmails.includes(email);
    },
  },
});

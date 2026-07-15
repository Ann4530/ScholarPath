import Link from "next/link";
import { LogIn } from "lucide-react";
import { auth, signOut } from "@/auth";
import SignOutButton from "@/components/SignOutButton";
import UserMenuLoginLabel from "@/components/UserMenuLoginLabel";

export default async function UserMenu() {
  const session = await auth();

  // Khách (chưa đăng nhập): hiện nút Đăng nhập/Đăng ký để bắt đầu cá nhân hóa.
  if (!session?.user) {
    return (
      <Link
        href="/login"
        className="flex items-center gap-1.5 rounded-[10px] border border-[#c8dcfa] bg-white px-3.5 py-2 text-[13px] font-bold text-[#2f6fe0] transition hover:bg-[#eaf1fd]"
      >
        <LogIn className="h-4 w-4" />
        <UserMenuLoginLabel />
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href="/profile"
        className="hidden max-w-[180px] truncate text-sm text-[#5a7794] hover:text-[#2f6fe0] sm:inline"
        title={session.user.email ?? ""}
      >
        {session.user.email}
      </Link>
      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/" });
        }}
      >
        <SignOutButton />
      </form>
    </div>
  );
}

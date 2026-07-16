import { redirect } from "next/navigation";
import { auth } from "@/auth";
import ProfileClient from "@/components/ProfileClient";

// Server component: trang cá nhân là tính năng cá nhân hóa → khách phải đăng nhập.
export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  return <ProfileClient email={session.user.email ?? null} />;
}

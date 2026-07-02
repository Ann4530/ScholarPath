import { auth } from "@/auth";
import ProfileClient from "@/components/ProfileClient";

// Server component: lấy email phiên đăng nhập rồi truyền xuống hub (client).
export default async function ProfilePage() {
  const session = await auth();
  return <ProfileClient email={session?.user?.email ?? null} />;
}

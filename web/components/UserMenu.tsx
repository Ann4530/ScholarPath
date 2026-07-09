import Link from "next/link";
import { auth, signOut } from "@/auth";
import SignOutButton from "@/components/SignOutButton";

export default async function UserMenu() {
  const session = await auth();
  if (!session?.user) return null;

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
          await signOut({ redirectTo: "/login" });
        }}
      >
        <SignOutButton />
      </form>
    </div>
  );
}

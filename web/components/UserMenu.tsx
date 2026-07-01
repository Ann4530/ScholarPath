import { auth, signOut } from "@/auth";

export default async function UserMenu() {
  const session = await auth();
  if (!session?.user) return null;

  return (
    <div className="flex items-center gap-2">
      <span className="hidden max-w-[180px] truncate text-sm text-slate-500 sm:inline" title={session.user.email ?? ""}>
        {session.user.email}
      </span>
      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/login" });
        }}
      >
        <button
          type="submit"
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
        >
          Đăng xuất
        </button>
      </form>
    </div>
  );
}

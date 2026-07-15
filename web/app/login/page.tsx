import { signIn } from "@/auth";
import HeroSky from "@/components/HeroSky";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; callbackUrl?: string }>;
}) {
  const { error, callbackUrl } = await searchParams;

  return (
    <div className="relative grid min-h-[calc(100vh-66px)] place-items-center overflow-hidden bg-[linear-gradient(160deg,#0a1230_0%,#152159_52%,#243a86_100%)] px-6 py-10">
      <div className="starfield pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[320px]">
        <HeroSky id="login" />
      </div>

      <div className="relative w-full max-w-[390px] rounded-[22px] bg-white p-8 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.6)]">
        <div className="flex items-center justify-center gap-2.5">
          <span className="grid h-10 w-10 place-items-center rounded-[12px] bg-gradient-to-br from-[#1e3a8a] to-[#3b82f6] text-white">
            <svg width="21" height="21" viewBox="0 0 24 24" fill="#fff"><path d="M2.5 19h19v2h-19zM22.07 9.64c-.21-.8-1.04-1.28-1.84-1.06L14.92 10 8.46 3.98l-1.93.52 3.87 6.7-4.97 1.34-1.97-1.54-1.45.39 2.59 4.49 17.42-4.67c.81-.23 1.28-1.05 1.06-1.86z" /></svg>
          </span>
          <span className="text-xl font-extrabold tracking-tight text-[#1a3352]">
            Scholar<span className="text-[#2f6fe0]">Finder</span>
          </span>
        </div>

        <h1 className="mt-5 text-center text-xl font-extrabold text-[#12345c]">Đăng nhập / Đăng ký</h1>
        <p className="mt-1 text-center text-[13px] text-[#7591ab]">
          Đăng nhập bằng Google để lưu hồ sơ, theo dõi tiến độ ứng tuyển và nhận gợi ý học bổng cá nhân hóa.
          Chưa có tài khoản? Lần đầu đăng nhập sẽ tự tạo cho bạn.
        </p>

        {error && (
          <div className="mt-4 rounded-[11px] border border-[#f7ccd2] bg-[#fdecee] p-3 text-sm text-[#b23343]">
            Không thể đăng nhập với tài khoản này. Vui lòng thử lại hoặc dùng một email Google khác.
          </div>
        )}

        <form
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: callbackUrl || "/explore" });
          }}
          className="mt-6"
        >
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-3 rounded-[12px] border border-[#dce8f4] bg-white px-4 py-3 font-bold text-[#1a3352] transition hover:bg-[#f6f9fd]"
          >
            <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
              <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22 22-9.8 22-22c0-1.3-.1-2.3-.4-3.5z" />
              <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 4.1 29.6 2 24 2 15.6 2 8.3 6.9 6.3 14.7z" />
              <path fill="#4CAF50" d="M24 46c5.5 0 10.5-2.1 14.3-5.6l-6.6-5.6C29.6 36.5 26.9 37.5 24 37.5c-5.2 0-9.6-3.3-11.2-8l-6.5 5C8.2 41.1 15.5 46 24 46z" />
              <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.4l6.6 5.6C41.9 35.4 46 30.3 46 24c0-1.3-.1-2.3-.4-3.5z" />
            </svg>
            Đăng nhập với Google
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-[#93a7bd]">
          Bạn có thể xem học bổng mà không cần đăng nhập. Đăng nhập chỉ để lưu & đồng bộ hồ sơ cá nhân.
        </p>
      </div>
    </div>
  );
}

// Nhãn quốc gia — chip nhỏ chứa TÊN nước (vd "Hà Lan"), không phải mã ISO.
//
// Trước đây chip hiện mã 2 chữ (NL, DE…) nhưng người dùng thấy khó hiểu; giờ hiện
// tên đầy đủ. Truyền `name` (tên đã dịch) từ nơi gọi; nếu thiếu thì fallback về
// `code` để không bao giờ trống.

const SIZES = {
  sm: "px-1.5 py-0.5 text-[11px]",
  md: "px-2 py-[3px] text-[12px]",
} as const;

export default function CountryTag({
  name,
  code,
  size = "sm",
  tone = "light",
  title,
}: {
  /** Tên nước đã dịch để hiển thị (vd "Hà Lan"). Thiếu thì dùng `code`. */
  name?: string;
  code: string;
  size?: keyof typeof SIZES;
  /** "light" trên nền sáng, "dark" trên nền tối (header gradient). */
  tone?: "light" | "dark";
  title?: string;
}) {
  const toneCls =
    tone === "dark"
      ? "bg-white/15 text-white ring-white/25"
      : "bg-[#eef4fb] text-[#3f5f7f] ring-[#dce8f4]";

  return (
    <span
      title={title ?? name ?? code}
      className={`inline-flex shrink-0 items-center rounded-[5px] font-semibold leading-none ring-1 ring-inset ${SIZES[size]} ${toneCls}`}
    >
      {name ?? code}
    </span>
  );
}

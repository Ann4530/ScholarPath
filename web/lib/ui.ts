// Helper UI dùng chung — bảng màu "Starry Blue"
//
// Nhãn quốc gia: xem components/CountryTag.tsx. Trước đây ở đây có bảng emoji cờ
// (flagEmoji) nhưng đã bỏ — Windows không có font emoji cờ nên 🇩🇪 rơi về cặp chữ
// "DE" trông như lỗi, và bảng cứng chỉ phủ 13 nước trong khi dữ liệu nay có 33.

// Màu theo Match Score (badge/khung) — trả về class Tailwind
export function matchColor(score: number): string {
  if (score >= 80) return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (score >= 60) return "bg-blue-50 text-blue-700 border-blue-200";
  if (score >= 40) return "bg-amber-50 text-amber-700 border-amber-200";
  return "bg-rose-50 text-rose-700 border-rose-200";
}

export function matchBar(score: number): string {
  if (score >= 80) return "bg-[#10a06d]";
  if (score >= 60) return "bg-[#2f6fe0]";
  if (score >= 40) return "bg-[#e0921a]";
  return "bg-[#e14b5a]";
}

// Màu hex cho vòng match (nested circle / conic ring) và chữ %
export function matchRingBar(score: number): string {
  if (score >= 80) return "#10a06d";
  if (score >= 60) return "#2f6fe0";
  if (score >= 40) return "#e0921a";
  return "#e14b5a";
}

export function matchFg(score: number): string {
  if (score >= 80) return "#0b7a52";
  if (score >= 60) return "#1c5cc0";
  if (score >= 40) return "#a9670a";
  return "#b23343";
}

// Màu theo số ngày còn lại tới deadline (class Tailwind)
export function deadlineColor(days: number): string {
  if (days < 0) return "text-[#93a7bd]";
  if (days <= 7) return "text-[#d33a4a] font-semibold";
  if (days <= 30) return "text-[#c47a00] font-semibold";
  return "text-[#5a7794]";
}

// Màu hex tương ứng cho deadline (icon/inline style)
export function deadlineHex(days: number): string {
  if (days < 0) return "#93a7bd";
  if (days <= 7) return "#d33a4a";
  if (days <= 30) return "#c47a00";
  return "#5a7794";
}

// Chuỗi "còn N ngày" theo ngôn ngữ hiện tại — component truyền t (i18next) vào.
export function deadlineText(days: number, t: (key: string, opts?: Record<string, unknown>) => string): string {
  if (days < 0) return t("deadline.closed");
  if (days === 0) return t("deadline.today");
  return t("deadline.left", { n: days });
}

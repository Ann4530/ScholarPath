// Helper UI dùng chung

const FLAGS: Record<string, string> = {
  DE: "🇩🇪", JP: "🇯🇵", GB: "🇬🇧", NL: "🇳🇱", AU: "🇦🇺", US: "🇺🇸",
  CA: "🇨🇦", FR: "🇫🇷", CN: "🇨🇳", KR: "🇰🇷", SG: "🇸🇬", SE: "🇸🇪", CH: "🇨🇭",
};

export const flagEmoji = (code: string) => FLAGS[code] ?? "🏳️";

// Màu theo Match Score
export function matchColor(score: number): string {
  if (score >= 80) return "bg-emerald-100 text-emerald-800 border-emerald-300";
  if (score >= 60) return "bg-indigo-100 text-indigo-800 border-indigo-300";
  if (score >= 40) return "bg-amber-100 text-amber-800 border-amber-300";
  return "bg-rose-100 text-rose-800 border-rose-300";
}

export function matchBar(score: number): string {
  if (score >= 80) return "bg-emerald-500";
  if (score >= 60) return "bg-indigo-500";
  if (score >= 40) return "bg-amber-500";
  return "bg-rose-500";
}

// Màu theo số ngày còn lại tới deadline
export function deadlineColor(days: number): string {
  if (days < 0) return "text-slate-400";
  if (days <= 7) return "text-rose-600 font-semibold";
  if (days <= 30) return "text-orange-600 font-semibold";
  return "text-slate-600";
}

// Chuỗi "còn N ngày" theo ngôn ngữ hiện tại — component truyền t (i18next) vào.
export function deadlineText(days: number, t: (key: string, opts?: Record<string, unknown>) => string): string {
  if (days < 0) return t("deadline.closed");
  if (days === 0) return t("deadline.today");
  return t("deadline.left", { n: days });
}

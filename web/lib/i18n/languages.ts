// Danh sách ngôn ngữ được hỗ trợ — một nguồn duy nhất cho i18n + bộ chọn ngôn ngữ.
// (Pattern tham khảo từ project plucky/src/i18n/languages.ts)
// Thêm/bớt ngôn ngữ: cập nhật mảng này, thêm file locales/<code>.json và đăng ký
// resource tương ứng trong ./index.ts.
//
// Bộ 18 ngôn ngữ chọn theo điểm đến du học phổ biến (không theo số người nói
// toàn cầu), vì người dùng đọc app này để tìm học bổng ở các nước đó.

export type LanguageCode =
  | "vi" | "en" | "de" | "fr" | "es" | "it" | "nl" | "sv" | "pt" | "pl"
  | "cs" | "tr" | "ru" | "ja" | "ko" | "zh-Hans" | "zh-Hant" | "th";

export interface LanguageDef {
  code: LanguageCode;
  /** Tên hiển thị trong bộ chọn — theo chính ngôn ngữ đó. */
  label: string;
  /** Tên tiếng Anh (phụ đề trong bộ chọn). */
  english: string;
}

export const SUPPORTED_LANGUAGES: LanguageDef[] = [
  { code: "vi", label: "Tiếng Việt", english: "Vietnamese" },
  { code: "en", label: "English", english: "English" },
  { code: "de", label: "Deutsch", english: "German" },
  { code: "fr", label: "Français", english: "French" },
  { code: "es", label: "Español", english: "Spanish" },
  { code: "it", label: "Italiano", english: "Italian" },
  { code: "nl", label: "Nederlands", english: "Dutch" },
  { code: "sv", label: "Svenska", english: "Swedish" },
  { code: "pt", label: "Português", english: "Portuguese" },
  { code: "pl", label: "Polski", english: "Polish" },
  { code: "cs", label: "Čeština", english: "Czech" },
  { code: "tr", label: "Türkçe", english: "Turkish" },
  { code: "ru", label: "Русский", english: "Russian" },
  { code: "ja", label: "日本語", english: "Japanese" },
  { code: "ko", label: "한국어", english: "Korean" },
  { code: "zh-Hans", label: "简体中文", english: "Chinese (Simplified)" },
  { code: "zh-Hant", label: "繁體中文", english: "Chinese (Traditional)" },
  { code: "th", label: "ไทย", english: "Thai" },
];

export const DEFAULT_LANGUAGE: LanguageCode = "vi";

const BY_CODE = new Map<string, LanguageDef>(SUPPORTED_LANGUAGES.map((l) => [l.code, l]));

export function isSupported(code: string | null | undefined): code is LanguageCode {
  return !!code && BY_CODE.has(code);
}

/**
 * Quy đổi locale trình duyệt về mã được hỗ trợ.
 * Xử lý 3 mức: khớp nguyên tag ("zh-Hans") > khớp riêng tiếng Trung theo vùng
 * ("zh-TW"/"zh-HK" → phồn thể, còn lại → giản thể) > khớp phần gốc ("en-US" → "en").
 */
export function normalizeLanguage(tag?: string | null): LanguageCode | null {
  const raw = (tag ?? "").trim();
  if (!raw) return null;

  const exact = SUPPORTED_LANGUAGES.find((l) => l.code.toLowerCase() === raw.toLowerCase());
  if (exact) return exact.code;

  const lower = raw.toLowerCase();
  const base = lower.split("-")[0];

  if (base === "zh") {
    // zh-Hant, zh-TW, zh-HK, zh-MO → phồn thể; zh, zh-CN, zh-SG, zh-Hans → giản thể.
    if (/hant|tw|hk|mo/.test(lower)) return "zh-Hant";
    return "zh-Hans";
  }

  if (isSupported(base)) return base;
  return null;
}

export function languageDef(code: string): LanguageDef {
  return BY_CODE.get(code) ?? BY_CODE.get(DEFAULT_LANGUAGE)!;
}

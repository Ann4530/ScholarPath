// Danh sách ngôn ngữ được hỗ trợ — một nguồn duy nhất cho i18n + bộ chọn ngôn ngữ.
// (Pattern tham khảo từ project plucky/src/i18n/languages.ts)
// Thêm/bớt ngôn ngữ: cập nhật mảng này, thêm file locales/<code>.json và đăng ký
// resource tương ứng trong ./index.ts.

export type LanguageCode = "vi" | "en";

export interface LanguageDef {
  code: LanguageCode;
  /** Tên hiển thị trong bộ chọn — theo chính ngôn ngữ đó. */
  label: string;
  /** Tên tiếng Anh (phụ đề trong bộ chọn). */
  english: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageDef[] = [
  { code: "vi", label: "Tiếng Việt", english: "Vietnamese", flag: "🇻🇳" },
  { code: "en", label: "English", english: "English", flag: "🇬🇧" },
];

export const DEFAULT_LANGUAGE: LanguageCode = "vi";

const BY_CODE = new Map<string, LanguageDef>(SUPPORTED_LANGUAGES.map((l) => [l.code, l]));

export function isSupported(code: string | null | undefined): code is LanguageCode {
  return !!code && BY_CODE.has(code);
}

/** Quy đổi locale trình duyệt (vd "en-US", "vi-VN") về mã được hỗ trợ. */
export function normalizeLanguage(tag?: string | null): LanguageCode | null {
  const base = (tag ?? "").toLowerCase().split("-")[0];
  if (isSupported(base)) return base;
  return null;
}

export function languageDef(code: string): LanguageDef {
  return BY_CODE.get(code) ?? BY_CODE.get(DEFAULT_LANGUAGE)!;
}

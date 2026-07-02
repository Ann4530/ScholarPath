// Khởi tạo i18next cho toàn app (pattern tham khảo từ project plucky/src/i18n/index.ts):
// nạp resource tĩnh, phát hiện ngôn ngữ trình duyệt, lưu lựa chọn vào localStorage.
//
// Khác plucky (React Native): đây là Next.js — server prerender phải trùng HTML với
// client lúc hydrate, nên luôn init bằng DEFAULT_LANGUAGE; ngôn ngữ đã lưu/của trình
// duyệt được khôi phục SAU khi mount (I18nProvider gọi restoreLanguage()).
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import {
  DEFAULT_LANGUAGE,
  isSupported,
  normalizeLanguage,
  type LanguageCode,
} from "./languages";
import en from "./locales/en.json";
import vi from "./locales/vi.json";

export const STORAGE_KEY = "scholarfinder-language";

const resources = {
  vi: { translation: vi },
  en: { translation: en },
} as const;

if (!i18n.isInitialized) {
  void i18n.use(initReactI18next).init({
    resources,
    lng: DEFAULT_LANGUAGE, // server & client render lần đầu giống nhau (tránh hydration mismatch)
    fallbackLng: DEFAULT_LANGUAGE,
    interpolation: { escapeValue: false },
    returnNull: false,
  });
}

/** Ngôn ngữ ưu tiên: đã lưu > trình duyệt > mặc định. Chỉ gọi phía client. */
function preferredLanguage(): LanguageCode {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (isSupported(saved)) return saved;
  } catch {
    /* localStorage có thể bị chặn — bỏ qua */
  }
  return normalizeLanguage(navigator.language) ?? DEFAULT_LANGUAGE;
}

/** Khôi phục ngôn ngữ sau khi mount (I18nProvider gọi trong useEffect). */
export function restoreLanguage(): void {
  const target = preferredLanguage();
  if (target !== i18n.language) void i18n.changeLanguage(target);
  document.documentElement.lang = target;
}

/** Đổi ngôn ngữ app và lưu lại lựa chọn. */
export function setAppLanguage(code: LanguageCode): void {
  void i18n.changeLanguage(code);
  document.documentElement.lang = code;
  try {
    localStorage.setItem(STORAGE_KEY, code);
  } catch {
    /* Lưu thất bại thì vẫn đổi cho phiên hiện tại. */
  }
}

export default i18n;

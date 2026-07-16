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
import de from "./locales/de.json";
import fr from "./locales/fr.json";
import es from "./locales/es.json";
import it from "./locales/it.json";
import nl from "./locales/nl.json";
import sv from "./locales/sv.json";
import pt from "./locales/pt.json";
import pl from "./locales/pl.json";
import cs from "./locales/cs.json";
import tr from "./locales/tr.json";
import ru from "./locales/ru.json";
import ja from "./locales/ja.json";
import ko from "./locales/ko.json";
import zhHans from "./locales/zh-Hans.json";
import zhHant from "./locales/zh-Hant.json";
import th from "./locales/th.json";

export const STORAGE_KEY = "scholarfinder-language";

// CHỈ đăng ký ngôn ngữ đã có file dịch — TRANSLATED_CODES bên dưới lọc bộ chọn theo
// đúng danh sách này, để không ai chọn được một ngôn ngữ rồi thấy hiện tiếng Việt.
// Thứ tự khớp SUPPORTED_LANGUAGES trong ./languages.ts.
const resources = {
  vi: { translation: vi },
  en: { translation: en },
  de: { translation: de },
  fr: { translation: fr },
  es: { translation: es },
  it: { translation: it },
  nl: { translation: nl },
  sv: { translation: sv },
  pt: { translation: pt },
  pl: { translation: pl },
  cs: { translation: cs },
  tr: { translation: tr },
  ru: { translation: ru },
  ja: { translation: ja },
  ko: { translation: ko },
  "zh-Hans": { translation: zhHans },
  "zh-Hant": { translation: zhHant },
  th: { translation: th },
} as const;

/** Mã ngôn ngữ đã thực sự có bản dịch — nguồn cho bộ chọn ngôn ngữ. */
export const TRANSLATED_CODES = Object.keys(resources) as LanguageCode[];

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
    if (isSupported(saved) && TRANSLATED_CODES.includes(saved)) return saved;
  } catch {
    /* localStorage có thể bị chặn — bỏ qua */
  }
  const fromBrowser = normalizeLanguage(navigator.language);
  if (fromBrowser && TRANSLATED_CODES.includes(fromBrowser)) return fromBrowser;
  return DEFAULT_LANGUAGE;
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

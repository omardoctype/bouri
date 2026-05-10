import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ar from './locales/ar.json';
import fr from './locales/fr.json';
import en from './locales/en.json';

type AppLanguage = 'ar' | 'fr' | 'en';

const STORAGE_KEY = 'bouri_language';
const DEFAULT_LANGUAGE: AppLanguage = 'ar';
const SUPPORTED_LANGUAGES: AppLanguage[] = ['ar', 'fr', 'en'];

const isSupportedLanguage = (value: string): value is AppLanguage =>
  SUPPORTED_LANGUAGES.includes(value as AppLanguage);

const getInitialLanguage = (): AppLanguage => {
  if (typeof window === 'undefined') {
    return DEFAULT_LANGUAGE;
  }

  const savedLanguage = window.localStorage.getItem(STORAGE_KEY);
  if (!savedLanguage) {
    return DEFAULT_LANGUAGE;
  }

  return isSupportedLanguage(savedLanguage) ? savedLanguage : DEFAULT_LANGUAGE;
};

const applyDocumentLanguage = (language: AppLanguage) => {
  if (typeof document === 'undefined') {
    return;
  }

  document.documentElement.lang = language;
  document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
};

const initialLanguage = getInitialLanguage();

if (typeof window !== 'undefined') {
  window.localStorage.setItem(STORAGE_KEY, initialLanguage);
}

applyDocumentLanguage(initialLanguage);

void i18n.use(initReactI18next).init({
  resources: {
    ar: { translation: ar },
    fr: { translation: fr },
    en: { translation: en },
  },
  lng: initialLanguage,
  fallbackLng: DEFAULT_LANGUAGE,
  supportedLngs: SUPPORTED_LANGUAGES,
  interpolation: {
    escapeValue: false,
  },
  returnNull: false,
});

i18n.on('languageChanged', (language) => {
  const nextLanguage = isSupportedLanguage(language) ? language : DEFAULT_LANGUAGE;

  if (typeof window !== 'undefined') {
    window.localStorage.setItem(STORAGE_KEY, nextLanguage);
  }

  applyDocumentLanguage(nextLanguage);
});

export { STORAGE_KEY, DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES };
export type { AppLanguage };
export default i18n;

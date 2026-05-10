import { Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '../../lib/utils';
import { DEFAULT_LANGUAGE, STORAGE_KEY, SUPPORTED_LANGUAGES, type AppLanguage } from '../../i18n';

const LANGUAGE_OPTIONS: Array<{ code: AppLanguage; label: string }> = [
  { code: 'ar', label: '\u0627\u0644\u0639\u0631\u0628\u064A\u0629' },
  { code: 'fr', label: 'Fran\u00e7ais' },
  { code: 'en', label: 'English' }
];

const isSupportedLanguage = (value: string): value is AppLanguage =>
  SUPPORTED_LANGUAGES.includes(value as AppLanguage);

const normalizeLanguage = (value?: string): AppLanguage => {
  if (!value) return DEFAULT_LANGUAGE;
  const base = value.split('-')[0];
  return isSupportedLanguage(base) ? base : DEFAULT_LANGUAGE;
};

const syncDocumentLanguage = (language: AppLanguage) => {
  if (typeof document === 'undefined') return;
  document.documentElement.lang = language;
  document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
};

interface LanguageSwitcherProps {
  className?: string;
}

export const LanguageSwitcher = ({ className }: LanguageSwitcherProps) => {
  const { i18n, t } = useTranslation();
  const activeLanguage = normalizeLanguage(i18n.resolvedLanguage ?? i18n.language);

  const changeLanguage = async (language: AppLanguage) => {
    await i18n.changeLanguage(language);

    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, language);
    }

    syncDocumentLanguage(language);
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border border-white/15 bg-black/45 p-1 backdrop-blur-xl',
        className
      )}
      aria-label={t('common.language')}
      dir="ltr"
    >
      <label className="sm:hidden">
        <span className="sr-only">{t('common.language')}</span>
        <select
          value={activeLanguage}
          onChange={(event) => void changeLanguage(normalizeLanguage(event.target.value))}
          className="h-8 rounded-full border border-white/10 bg-black/45 px-3 text-[11px] font-semibold text-offWhite outline-none transition focus:border-goldLuxury"
          aria-label={t('common.language')}
        >
          {LANGUAGE_OPTIONS.map((option) => (
            <option key={option.code} value={option.code}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <div className="hidden items-center gap-1 sm:inline-flex">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/5 text-grayLuxury">
          <Globe className="h-3.5 w-3.5" />
        </span>

        {LANGUAGE_OPTIONS.map((option) => {
          const selected = activeLanguage === option.code;

          return (
            <button
              key={option.code}
              type="button"
              onClick={() => void changeLanguage(option.code)}
              className={cn(
                'rounded-full px-2.5 py-1 text-[11px] font-semibold transition sm:px-3 sm:text-xs',
                selected
                  ? 'bg-goldLuxury/20 text-goldLuxury'
                  : 'text-grayLuxury hover:bg-white/10 hover:text-offWhite'
              )}
              aria-pressed={selected}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

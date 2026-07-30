import { LOCALES, useI18n, type Locale } from '../i18n/I18nProvider'

export function LanguageSwitcher({ className = '' }: { className?: string }) {
  const { locale, setLocale, t } = useI18n()

  return (
    <div
      className={`flex items-center gap-2 font-body text-[0.8rem] tracking-[0.12em] uppercase md:text-[0.85rem] ${className}`}
      role="group"
      aria-label={t('lang.aria')}
    >
      {LOCALES.map((l, i) => (
        <span key={l.code} className="flex items-center gap-2">
          {i > 0 && <span className="text-ink/30" aria-hidden>·</span>}
          <button
            type="button"
            onClick={() => setLocale(l.code as Locale)}
            aria-pressed={locale === l.code}
            title={l.name}
            className={`nav-lang-btn min-h-11 min-w-[1.75rem] px-0.5 ${
              locale === l.code ? 'font-semibold text-ink' : 'text-ink/50'
            }`}
          >
            {l.label}
          </button>
        </span>
      ))}
    </div>
  )
}

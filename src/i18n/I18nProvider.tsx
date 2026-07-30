import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { dictionaries } from './dictionaries'

export type Locale = 'it' | 'fr' | 'en' | 'de'

export const LOCALES: { code: Locale; label: string; name: string }[] = [
  { code: 'it', label: 'IT', name: 'Italiano' },
  { code: 'fr', label: 'FR', name: 'Français' },
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'de', label: 'DE', name: 'Deutsch' },
]

const STORAGE_KEY = 'grosjean-locale'

type I18nContextValue = {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string, vars?: Record<string, string | number>) => string
}

const I18nContext = createContext<I18nContextValue | null>(null)

function interpolate(template: string, vars?: Record<string, string | number>) {
  if (!vars) return template
  return template.replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k] ?? `{${k}}`))
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window === 'undefined') return 'it'
    const saved = window.localStorage.getItem(STORAGE_KEY) as Locale | null
    if (saved && LOCALES.some((l) => l.code === saved)) return saved
    const nav = window.navigator.language.slice(0, 2).toLowerCase()
    if (nav === 'fr' || nav === 'en' || nav === 'de') return nav
    return 'it'
  })

  const setLocale = (next: Locale) => {
    setLocaleState(next)
    window.localStorage.setItem(STORAGE_KEY, next)
  }

  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  const value = useMemo<I18nContextValue>(() => {
    const dict = dictionaries[locale]
    const fallback = dictionaries.it
    const t = (key: string, vars?: Record<string, string | number>) => {
      const raw = dict[key] ?? fallback[key] ?? key
      return interpolate(raw, vars)
    }
    return { locale, setLocale, t }
  }, [locale])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}

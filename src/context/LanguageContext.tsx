import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { translations } from '../i18n/translations'
import type { Lang, Translations } from '../i18n/translations'

const STORAGE_KEY = 'padel-lang'

function detectLang(): Lang {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'pt' || saved === 'en') return saved
  } catch { /* localStorage may be unavailable (private browsing, quota exceeded, etc.) */ }
  return navigator.language.toLowerCase().startsWith('en') ? 'en' : 'pt'
}

type LanguageContextValue = {
  lang: Lang
  setLang: (lang: Lang) => void
  t: Translations
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'pt',
  setLang: () => {},
  t: translations.pt,
})

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(detectLang)

  const setLang = useCallback((l: Lang) => {
    setLangState(l)
    try { localStorage.setItem(STORAGE_KEY, l) } catch { /* localStorage may be unavailable (private browsing, quota exceeded, etc.) */ }
  }, [])

  const t = useMemo(() => translations[lang], [lang])

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useLanguage = () => useContext(LanguageContext)

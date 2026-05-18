import { useLanguage } from '../../context/LanguageContext'

function SunIcon() {
  return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
    </svg>
  )
}

type Props = { dark: boolean; onToggle: () => void }

export function DarkModeToggle({ dark, onToggle }: Props) {
  const { t } = useLanguage()

  return (
    <button
      data-testid="dark-mode-toggle"
      type="button"
      onClick={onToggle}
      aria-label={dark ? t.theme.lightMode : t.theme.darkMode}
      className="flex items-center gap-0.5 p-1 bg-gray-100 dark:bg-gray-700 rounded-full cursor-pointer transition-colors hover:bg-gray-200 dark:hover:bg-gray-600"
    >
      <span className={`p-1.5 rounded-full transition-all duration-200 ${!dark ? 'bg-white shadow text-amber-500' : 'text-gray-400 dark:text-gray-500'}`}>
        <SunIcon />
      </span>
      <span className={`p-1.5 rounded-full transition-all duration-200 ${dark ? 'bg-gray-600 shadow text-blue-300' : 'text-gray-400'}`}>
        <MoonIcon />
      </span>
    </button>
  )
}

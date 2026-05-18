import { useLanguage } from '../../context/LanguageContext'

export function PrintButton() {
  const { t } = useLanguage()

  return (
    <button
      data-testid="print-button"
      onClick={() => window.print()}
      className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 rounded-md text-sm hover:bg-gray-700 dark:hover:bg-gray-300 print:hidden transition-colors"
    >
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path
          fillRule="evenodd"
          d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a1 1 0 001 1h8a1 1 0 001-1v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a1 1 0 00-1-1H6a1 1 0 00-1 1zm2 0h6v3H7V4zm-1 9h8v3H6v-3zm-2-4a1 1 0 100 2 1 1 0 000-2z"
          clipRule="evenodd"
        />
      </svg>
      {t.print}
    </button>
  )
}

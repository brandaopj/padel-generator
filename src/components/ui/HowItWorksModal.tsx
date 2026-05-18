import { useEffect } from 'react'
import { MODES } from '../../utils/modes'
import { useLanguage } from '../../context/LanguageContext'

type Props = { onClose: () => void }

export function HowItWorksModal({ onClose }: Props) {
  const { t } = useLanguage()

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in-up"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={t.howItWorks.title}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{t.howItWorks.title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.toast.close}
            className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Mode sections */}
        <div className="p-6 space-y-6">
          {MODES.map((mode, i) => (
            <div key={mode.value}>
              <h3 className="flex items-center gap-2.5 text-base font-semibold text-gray-900 dark:text-gray-100 mb-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-md bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 shrink-0">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule={mode.iconFillRule ?? 'nonzero'} d={mode.iconPath} />
                  </svg>
                </span>
                {t.modes[mode.value].label}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed pl-8.5">
                {t.howItWorks.modeDescriptions[i]}
              </p>
            </div>
          ))}

          {/* Summary table */}
          <div className="mt-2 overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50 text-left">
                  {t.howItWorks.tableHeaders.map((header, i) => (
                    <th key={i} className="px-4 py-2.5 font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MODES.map((mode, i) => (
                  <tr key={mode.value} className={i < MODES.length - 1 ? 'border-b border-gray-100 dark:border-gray-700' : ''}>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-2 font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">
                        <svg className="w-3.5 h-3.5 text-blue-500 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule={mode.iconFillRule ?? 'nonzero'} d={mode.iconPath} />
                        </svg>
                        {t.modes[mode.value].label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{t.howItWorks.tableInputs[i]}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{t.howItWorks.tableIdeal[i]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

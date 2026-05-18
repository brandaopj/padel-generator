import { MODES } from '../../utils/modes'
import { useLanguage } from '../../context/LanguageContext'
import type { GameMode } from '../../types'

type Props = { value: GameMode; onChange: (mode: GameMode) => void }

export function ModeSelector({ value, onChange }: Props) {
  const { t } = useLanguage()
  const selected = MODES.find(m => m.value === value)

  return (
    <div>
      <div
        className="flex rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
        role="tablist"
      >
        {MODES.map(mode => (
          <button
            key={mode.value}
            role="tab"
            aria-selected={value === mode.value}
            data-testid={`mode-${mode.value}`}
            onClick={() => onChange(mode.value)}
            className={`flex-1 py-2 px-2 text-xs font-medium transition-colors ${
              value === mode.value
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <span className="flex flex-col items-center gap-1">
              <svg
                className="w-4 h-4 shrink-0"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule={mode.iconFillRule ?? 'nonzero'}
                  d={mode.iconPath}
                />
              </svg>
              <span>{t.modes[mode.value].label}</span>
            </span>
          </button>
        ))}
      </div>
      {selected && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 leading-snug">
          {t.modes[selected.value].description}
        </p>
      )}
    </div>
  )
}

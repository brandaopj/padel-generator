import { MODES } from '../../utils/modes'
import type { GameMode } from '../../types'

type Props = { value: GameMode; onChange: (mode: GameMode) => void }

export function ModeSelector({ value, onChange }: Props) {
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
            className={`flex-1 py-2 px-2 text-sm font-medium transition-colors whitespace-nowrap ${
              value === mode.value
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            {mode.label}
          </button>
        ))}
      </div>
      {selected && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
          {selected.description}
        </p>
      )}
    </div>
  )
}

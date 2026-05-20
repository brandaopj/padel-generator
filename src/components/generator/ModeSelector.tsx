import { MODES } from '../../utils/modes'
import { useLanguage } from '../../context/LanguageContext'
import type { GameMode } from '../../types'

type Props = { value: GameMode; onChange: (mode: GameMode) => void }

export function ModeSelector({ value, onChange }: Props) {
  const { t } = useLanguage()
  const regular = MODES[0]
  const secondary = MODES.slice(1)

  return (
    <div>
      <div className="flex gap-2" role="group">
        {/* Regular — large primary button */}
        <button
          role="tab"
          aria-selected={value === regular.value}
          data-testid={`mode-${regular.value}`}
          onClick={() => onChange(regular.value)}
          className={`flex-[2] min-h-[80px] p-3 rounded-lg border text-left transition-colors flex flex-col gap-1 ${
            value === regular.value
              ? 'bg-brand border-brand text-brand-on'
              : 'bg-surface border-border text-fg2 hover:bg-surface2'
          }`}
        >
          <svg className="w-5 h-5 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule={regular.iconFillRule ?? 'nonzero'} d={regular.iconPath} />
          </svg>
          <span className="text-sm font-semibold">{t.modes[regular.value].label}</span>
          <span className={`text-xs leading-snug ${value === regular.value ? 'text-brand-on/70' : 'text-fg3'}`}>
            {t.modes[regular.value].description}
          </span>
        </button>

        {/* Fixed pairs + Seeded — stacked small */}
        <div className="flex-1 flex flex-col gap-2">
          {secondary.map(mode => (
            <button
              key={mode.value}
              role="tab"
              aria-selected={value === mode.value}
              data-testid={`mode-${mode.value}`}
              onClick={() => onChange(mode.value)}
              className={`flex-1 px-2.5 py-2 rounded-lg border text-xs font-medium transition-colors flex items-center gap-2 ${
                value === mode.value
                  ? 'bg-brand border-brand text-brand-on'
                  : 'bg-surface border-border text-fg2 hover:bg-surface2'
              }`}
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule={mode.iconFillRule ?? 'nonzero'} d={mode.iconPath} />
              </svg>
              <span>{t.modes[mode.value].label}</span>
            </button>
          ))}
        </div>
      </div>

      {value !== 'regular' && (
        <p className="text-sm text-fg3 mt-2 leading-snug">
          {t.modes[value].description}
        </p>
      )}
    </div>
  )
}

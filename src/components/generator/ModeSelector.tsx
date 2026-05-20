import { MODES } from '../../utils/modes'
import { useLanguage } from '../../context/LanguageContext'
import type { GameMode } from '../../types'

type Props = { value: GameMode; onChange: (mode: GameMode) => void }

export function ModeSelector({ value, onChange }: Props) {
  const { t } = useLanguage()
  const selected = MODES.find(m => m.value === value)!
  const others = MODES.filter(m => m.value !== value)

  return (
    <div className="space-y-2">
      {/* Selected mode — large primary slot */}
      <button
        role="tab"
        aria-selected
        data-testid={`mode-${selected.value}`}
        onClick={() => onChange(selected.value)}
        className="w-full min-h-[80px] p-3 rounded-lg border border-brand bg-brand text-brand-on text-left transition-colors flex flex-col gap-1"
      >
        <svg className="w-5 h-5 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule={selected.iconFillRule ?? 'nonzero'} d={selected.iconPath} />
        </svg>
        <span className="text-sm font-semibold">{t.modes[selected.value].label}</span>
        <span className="text-xs leading-snug text-brand-on/70">
          {t.modes[selected.value].description}
        </span>
      </button>

      {/* Other two modes — compact pair */}
      <div className="grid grid-cols-2 gap-2">
        {others.map(mode => (
          <button
            key={mode.value}
            role="tab"
            aria-selected={false}
            data-testid={`mode-${mode.value}`}
            onClick={() => onChange(mode.value)}
            className="px-2.5 py-2.5 rounded-lg border border-border bg-surface text-fg2 text-xs font-medium transition-colors flex items-center gap-2 hover:bg-surface2 hover:border-brand/40"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule={mode.iconFillRule ?? 'nonzero'} d={mode.iconPath} />
            </svg>
            <span>{t.modes[mode.value].label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

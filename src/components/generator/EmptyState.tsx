import { useLanguage } from '../../context/LanguageContext'

type Props = { onLoadExample: () => void }

export function EmptyState({ onLoadExample }: Props) {
  const { t } = useLanguage()

  return (
    <div
      data-testid="rounds-empty"
      className="flex flex-col items-center justify-center h-full min-h-[360px] gap-6 py-12 text-center"
    >
      <svg
        className="w-20 h-20 text-border"
        viewBox="0 0 80 96"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <ellipse cx="40" cy="36" rx="26" ry="30" stroke="currentColor" strokeWidth="3.5" />
        <path d="M34 64 L34 88 Q34 92 40 92 Q46 92 46 88 L46 64 Z" fill="currentColor" opacity="0.4" />
        <line x1="16" y1="24" x2="64" y2="24" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
        <line x1="14" y1="36" x2="66" y2="36" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
        <line x1="16" y1="48" x2="64" y2="48" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
        <line x1="28" y1="8" x2="28" y2="64" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
        <line x1="40" y1="6" x2="40" y2="66" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
        <line x1="52" y1="8" x2="52" y2="64" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
      </svg>

      <div className="space-y-1">
        <p className="text-base font-medium text-fg3">
          {t.emptyState.title}
        </p>
        <p className="text-sm text-fg3">
          {t.emptyState.subtitle}
        </p>
      </div>

      <button
        type="button"
        onClick={onLoadExample}
        className="px-4 py-2 text-sm text-brand border border-brand/40 rounded-lg hover:bg-brand/10 transition-colors"
      >
        {t.emptyState.loadExample}
      </button>
    </div>
  )
}

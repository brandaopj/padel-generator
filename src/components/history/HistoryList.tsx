import { Link } from 'react-router-dom'
import type { Tournament } from '../../types'
import { HistoryEntry } from './HistoryEntry'
import { useLanguage } from '../../context/LanguageContext'

function HistoryEmpty() {
  const { t } = useLanguage()

  return (
    <div
      data-testid="history-empty"
      className="flex flex-col items-center justify-center py-20 gap-6 text-center"
    >
      <svg
        className="w-20 h-20 text-gray-200 dark:text-gray-700"
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
        <p className="text-base font-medium text-gray-600 dark:text-gray-400">
          {t.history.empty.title}
        </p>
        <p className="text-sm text-gray-400 dark:text-gray-500">
          {t.history.empty.subtitle}
        </p>
      </div>

      <Link
        to="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
      >
        {t.history.empty.cta}
        <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </Link>
    </div>
  )
}

type Props = { tournaments: Tournament[]; onDelete: (id: string) => void }

export function HistoryList({ tournaments, onDelete }: Props) {
  if (!tournaments.length) return <HistoryEmpty />

  return (
    <ul data-testid="history-list" className="space-y-3">
      {tournaments.map(t => (
        <li key={t.id}>
          <HistoryEntry tournament={t} onDelete={onDelete} />
        </li>
      ))}
    </ul>
  )
}

import { Link } from 'react-router-dom'
import type { Tournament } from '../../types'

const MODE_LABELS: Record<string, string> = {
  regular: 'Regular',
  'fixed-pairs': 'Duplas Fixas',
  seeded: 'Cabeças de Série',
}

type Props = { tournament: Tournament }

export function HistoryEntry({ tournament: t }: Props) {
  return (
    <Link
      to={`/history/${t.id}`}
      data-testid={`history-entry-${t.id}`}
      className="block bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="font-semibold text-gray-800 dark:text-gray-100 truncate">
            {t.clubName || 'Sem nome'}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {MODE_LABELS[t.mode]} · {t.courts} campo(s) · {t.pairs.length} duplas
          </p>
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500 shrink-0 mt-0.5">
          {new Date(t.date).toLocaleDateString('pt-PT')}
        </p>
      </div>
    </Link>
  )
}

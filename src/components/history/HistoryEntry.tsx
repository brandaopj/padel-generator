import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { GameMode, Tournament } from '../../types'
import { MODE_LABELS } from '../../utils/modes'

function tournamentTitle(t: Tournament): string {
  if (t.clubName) return t.clubName
  const auto: Record<GameMode, string> = {
    'regular': `Torneio Regular — ${t.pairs.length} duplas`,
    'fixed-pairs': `Duplas Fixas — ${t.pairs.length} pares`,
    'seeded': `Cabeças de Série — ${t.pairs.length} duplas`,
  }
  return auto[t.mode]
}

const MODE_BADGE_CLASS: Record<GameMode, string> = {
  'regular':     'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  'fixed-pairs': 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300',
  'seeded':      'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
}

const TRASH_PATH = 'M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z'
const ARROW_PATH = 'M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z'

function TrashIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d={TRASH_PATH} clipRule="evenodd" />
    </svg>
  )
}

function DeleteButton({ onDelete }: { onDelete: () => void }) {
  const [confirming, setConfirming] = useState(false)

  if (confirming) {
    return (
      <span className="flex items-center gap-1 text-xs">
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="px-2 py-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors rounded"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="flex items-center gap-1 px-2 py-1 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium transition-colors rounded"
        >
          <TrashIcon className="w-3.5 h-3.5" />
          Apagar
        </button>
      </span>
    )
  }

  return (
    <button
      type="button"
      onClick={() => setConfirming(true)}
      aria-label="Apagar torneio"
      title="Apagar torneio"
      className="p-1.5 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-colors rounded"
    >
      <TrashIcon />
    </button>
  )
}

type Props = { tournament: Tournament; onDelete: (id: string) => void }

export function HistoryEntry({ tournament: t, onDelete }: Props) {
  const title = tournamentTitle(t)
  const date = new Date(t.date).toLocaleDateString('pt-PT', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  return (
    <article
      data-testid={`history-entry-${t.id}`}
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md transition-all"
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">

        {/* Title + date */}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">
            {title}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{date}</p>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${MODE_BADGE_CLASS[t.mode]}`}>
            {MODE_LABELS[t.mode]}
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400">
            {t.courts} campo(s) · {t.pairs.length} duplas
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0">
          <DeleteButton onDelete={() => onDelete(t.id)} />
          <Link
            to={`/history/${t.id}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-md text-xs font-medium hover:bg-blue-700 transition-colors"
          >
            Ver Jogos
            <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d={ARROW_PATH} clipRule="evenodd" />
            </svg>
          </Link>
        </div>

      </div>
    </article>
  )
}

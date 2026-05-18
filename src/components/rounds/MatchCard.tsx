import { useRef, useState } from 'react'
import type { Match, Pair } from '../../types'

function PlayerAvatar() {
  return (
    <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/40 print:bg-gray-100 flex items-center justify-center shrink-0">
      <svg
        className="w-4 h-4 text-blue-500 dark:text-blue-400 print:text-gray-500"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  )
}

function PairColumn({ pair }: { pair: Pair }) {
  return (
    <div className="flex flex-col gap-2 min-w-0">
      {pair.map((name, i) => (
        <div key={i} className="flex items-center gap-2 min-w-0">
          <PlayerAvatar />
          <span className="text-sm font-medium text-gray-800 dark:text-gray-100 break-words min-w-0">{name}</span>
        </div>
      ))}
    </div>
  )
}

function CourtLabel({ name, onEdit }: { name: string; onEdit?: (name: string) => void }) {
  const [editing, setEditing] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  if (editing) {
    return (
      <input
        ref={inputRef}
        defaultValue={name}
        autoFocus
        aria-label="Nome do campo"
        className="text-xs font-medium text-gray-600 dark:text-gray-400 bg-transparent border-b border-blue-500 outline-none w-40 mb-2"
        onBlur={e => {
          const val = e.target.value.trim()
          onEdit?.(val || name)
          setEditing(false)
        }}
        onKeyDown={e => {
          if (e.key === 'Enter') (e.target as HTMLInputElement).blur()
          if (e.key === 'Escape') setEditing(false)
        }}
      />
    )
  }

  if (!onEdit) {
    return (
      <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">{name}</div>
    )
  }

  return (
    <div className="flex items-center gap-1 mb-2">
      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{name}</span>
      <button
        type="button"
        onClick={() => setEditing(true)}
        aria-label={`Editar nome: ${name}`}
        title="Editar nome do campo"
        className="print:hidden text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
      >
        <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
        </svg>
      </button>
    </div>
  )
}

type Props = {
  match: Match
  courtName: string
  onEditCourtName?: (name: string) => void
}

export function MatchCard({ match, courtName, onEditCourtName }: Props) {
  return (
    <div
      data-testid="match-card"
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 print:p-5 print:border-gray-400 print:break-inside-avoid break-inside-avoid"
    >
      <CourtLabel name={courtName} onEdit={onEditCourtName} />

      <div className="grid grid-cols-[1fr_auto_1fr] items-start gap-3">
        <PairColumn pair={match.pair1} />
        <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 px-1 pt-1.5 self-start">vs</span>
        <PairColumn pair={match.pair2} />
      </div>

      {/* Score boxes — one per pair, aligned to each column */}
      <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700 print:border-gray-300">
        <div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-center">
          <div className="flex justify-center">
            <div
              aria-label="Score da dupla 1"
              className="w-12 h-10 border-2 border-dashed border-gray-300 dark:border-gray-600 print:border-gray-400 rounded"
            />
          </div>
          <span className="text-sm font-medium text-gray-400 dark:text-gray-500 px-1 text-center">–</span>
          <div className="flex justify-center">
            <div
              aria-label="Score da dupla 2"
              className="w-12 h-10 border-2 border-dashed border-gray-300 dark:border-gray-600 print:border-gray-400 rounded"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

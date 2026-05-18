import { useRef, useState } from 'react'
import type { Match, Pair } from '../../types'

const AVATAR_PALETTE = [
  { bg: 'dbeafe', fg: '1e40af', fbBg: 'bg-blue-100 dark:bg-blue-900/40', fbText: 'text-blue-700 dark:text-blue-300' },
  { bg: 'd1fae5', fg: '065f46', fbBg: 'bg-emerald-100 dark:bg-emerald-900/40', fbText: 'text-emerald-700 dark:text-emerald-300' },
  { bg: 'ede9fe', fg: '4c1d95', fbBg: 'bg-violet-100 dark:bg-violet-900/40', fbText: 'text-violet-700 dark:text-violet-300' },
  { bg: 'fef3c7', fg: '92400e', fbBg: 'bg-amber-100 dark:bg-amber-900/40', fbText: 'text-amber-700 dark:text-amber-300' },
  { bg: 'fee2e2', fg: '991b1b', fbBg: 'bg-rose-100 dark:bg-rose-900/40', fbText: 'text-rose-700 dark:text-rose-300' },
  { bg: 'cffafe', fg: '164e63', fbBg: 'bg-cyan-100 dark:bg-cyan-900/40', fbText: 'text-cyan-700 dark:text-cyan-300' },
  { bg: 'ffedd5', fg: '9a3412', fbBg: 'bg-orange-100 dark:bg-orange-900/40', fbText: 'text-orange-700 dark:text-orange-300' },
  { bg: 'ccfbf1', fg: '134e4a', fbBg: 'bg-teal-100 dark:bg-teal-900/40', fbText: 'text-teal-700 dark:text-teal-300' },
]

const COURT_ACCENTS = [
  'border-t-blue-500',
  'border-t-emerald-500',
  'border-t-violet-500',
  'border-t-amber-500',
  'border-t-rose-500',
  'border-t-cyan-500',
]

function avatarPalette(name: string) {
  const hash = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return AVATAR_PALETTE[hash % AVATAR_PALETTE.length]
}

function PlayerAvatar({ name }: { name: string }) {
  const [errored, setErrored] = useState(false)
  const palette = avatarPalette(name)
  const initials = name
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  if (errored) {
    return (
      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold select-none print:hidden ${palette.fbBg} ${palette.fbText}`}>
        {initials}
      </div>
    )
  }

  const url =
    `https://api.dicebear.com/7.x/initials/svg` +
    `?seed=${encodeURIComponent(name)}` +
    `&backgroundColor=${palette.bg}&textColor=${palette.fg}&fontSize=40&bold=true`

  return (
    <img
      src={url}
      alt={initials}
      width={32}
      height={32}
      className="w-8 h-8 rounded-full shrink-0 print:hidden"
      style={{ backgroundColor: `#${palette.bg}` }}
      loading="lazy"
      onError={() => setErrored(true)}
    />
  )
}

function PairColumn({ pair, reverse = false }: { pair: Pair; reverse?: boolean }) {
  return (
    <div className="flex flex-col gap-3 print:gap-2 min-w-0">
      {pair.map((name, i) => {
        const nameEl = (
          <span className={`truncate flex-1 min-w-0 text-sm font-medium text-gray-800 dark:text-gray-100 print:text-xs print:font-semibold ${reverse ? 'text-right' : ''}`}>
            {name}
          </span>
        )
        const avatarEl = <PlayerAvatar name={name} />
        return (
          <div key={i} className={`flex items-center gap-3 print:gap-2 w-full min-w-0 ${reverse ? 'justify-end' : ''}`}>
            {reverse ? <>{nameEl}{avatarEl}</> : <>{avatarEl}{nameEl}</>}
          </div>
        )
      })}
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
      <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-3 print:mb-2">{name}</div>
    )
  }

  return (
    <div className="flex items-center gap-1 mb-3 print:mb-2">
      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{name}</span>
      <button
        type="button"
        onClick={() => setEditing(true)}
        aria-label={`Editar nome: ${name}`}
        title="Editar nome do campo"
        className="print:hidden text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-all opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
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
  const accentClass = COURT_ACCENTS[(match.court - 1) % COURT_ACCENTS.length]

  return (
    <div
      data-testid="match-card"
      className={`flex flex-col bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 border-t-4 ${accentClass} rounded-lg p-5 print:p-3 print:pb-4 print:border-gray-400 print:break-inside-avoid break-inside-avoid group`}
    >
      <CourtLabel name={courtName} onEdit={onEditCourtName} />

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-x-5 md:gap-x-6 w-full">
        <PairColumn pair={match.pair1} reverse />
        <div className="flex items-center justify-center self-center">
          <span className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xs font-black text-gray-400 dark:text-gray-500 select-none print:w-6 print:h-6 print:text-[10px]">
            VS
          </span>
        </div>
        <PairColumn pair={match.pair2} />
      </div>

      {/* Score boxes — dashed, one per pair, for hand-written scores */}
      <div className="mt-auto pt-5 border-t border-gray-100 dark:border-gray-700 print:border-gray-300 print:pt-3 print:mt-3">
        <div className="grid grid-cols-[1fr_auto_1fr] gap-3 print:gap-1 items-center">
          <div className="flex justify-center">
            <div
              aria-label="Score da dupla 1"
              className="w-12 h-10 border-2 border-dashed border-gray-300 dark:border-gray-600 print:border-gray-400 print:w-10 print:h-7 rounded"
            />
          </div>
          <span className="text-sm font-medium text-gray-400 dark:text-gray-500 px-1 text-center">–</span>
          <div className="flex justify-center">
            <div
              aria-label="Score da dupla 2"
              className="w-12 h-10 border-2 border-dashed border-gray-300 dark:border-gray-600 print:border-gray-400 print:w-10 print:h-7 rounded"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

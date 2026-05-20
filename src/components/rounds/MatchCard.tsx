import { useRef, useState } from 'react'
import type { Match, Pair } from '../../types'
import { useLanguage } from '../../context/LanguageContext'

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
  '[border-top-color:var(--color-court1)]',
  '[border-top-color:var(--color-court2)]',
  '[border-top-color:var(--color-court3)]',
  '[border-top-color:var(--color-court4)]',
  '[border-top-color:var(--color-court5)]',
  '[border-top-color:var(--color-court6)]',
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
      <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold select-none ${palette.fbBg} ${palette.fbText}`}>
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
      className="w-7 h-7 sm:w-8 sm:h-8 rounded-full shrink-0"
      style={{ backgroundColor: `#${palette.bg}` }}
      loading="lazy"
      onError={() => setErrored(true)}
    />
  )
}

function PairColumn({ pair, reverse = false }: { pair: Pair; reverse?: boolean }) {
  return (
    <div className="flex flex-col gap-2 sm:gap-3 print:gap-2 min-w-0">
      {pair.map((name, i) => {
        const nameEl = (
          <span className={`flex-1 min-w-0 break-words text-sm font-medium leading-snug text-fg print:text-xs print:font-semibold ${reverse ? 'text-right' : ''}`}>
            {name}
          </span>
        )
        const avatarEl = <PlayerAvatar name={name} />
        return (
          <div key={i} className={`flex items-center gap-2 sm:gap-3 print:gap-2 w-full min-w-0 ${reverse ? 'justify-end' : ''}`}>
            {reverse ? <>{nameEl}{avatarEl}</> : <>{avatarEl}{nameEl}</>}
          </div>
        )
      })}
    </div>
  )
}

function CourtLabel({ name, court, onEdit }: { name: string; court: number; onEdit?: (name: string) => void }) {
  const { t } = useLanguage()
  const [editing, setEditing] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const courtIndex = (court - 1) % 6 + 1

  if (editing) {
    return (
      <input
        ref={inputRef}
        defaultValue={name}
        autoFocus
        aria-label={t.rounds.courtNameLabel}
        className="text-xs font-medium text-fg2 bg-transparent border-b border-brand outline-none w-full max-w-[160px] mb-2"
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
      <div className="mb-3 print:mb-2">
        <span
          className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-widest uppercase text-white"
          style={{ background: `var(--color-court${courtIndex})` }}
        >
          {name}
        </span>
      </div>
    )
  }

  return (
    <div className="mb-3 print:mb-2">
      <button
        type="button"
        onClick={() => setEditing(true)}
        aria-label={t.rounds.editCourtName(name)}
        title={t.rounds.editCourtTitle}
        className="group/court inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-widest uppercase text-white hover:opacity-80 transition-opacity print:pointer-events-none"
        style={{ background: `var(--color-court${courtIndex})` }}
      >
        {name}
        <svg className="w-2.5 h-2.5 opacity-0 group-hover/court:opacity-100 transition-opacity print:hidden" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
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
  onScoreChange?: (scores: [number | null, number | null]) => void
}

export function MatchCard({ match, courtName, onEditCourtName, onScoreChange }: Props) {
  const { t } = useLanguage()
  const accentClass = COURT_ACCENTS[(match.court - 1) % COURT_ACCENTS.length]

  const [scores, setScores] = useState<[number | null, number | null]>(
    match.scores ?? [null, null]
  )

  function handleScore(idx: 0 | 1, raw: string) {
    const val = raw === '' ? null : Math.max(0, parseInt(raw, 10))
    const next: [number | null, number | null] = idx === 0 ? [val, scores[1]] : [scores[0], val]
    setScores(next)
    onScoreChange?.(next)
  }

  return (
    <div
      data-testid="match-card"
      className={`flex flex-col bg-surface border border-border border-t-4 ${accentClass} rounded-xl p-3 sm:p-5 print:p-3 print:pb-4 print:border-gray-400 print:break-inside-avoid break-inside-avoid group`}
    >
      <CourtLabel name={courtName} court={match.court} onEdit={onEditCourtName} />

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-x-4 md:gap-x-5 w-full pb-5 print:pb-3">
        <PairColumn pair={match.pair1} reverse />
        <div className="flex items-center justify-center self-center">
          <span
            className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-black select-none print:w-6 print:h-6 print:text-[10px]"
            style={{
              background: '#a3e635',
              color: '#1a2e00',
              boxShadow: '0 0 0 3px var(--color-surface), 0 0 0 5px rgba(163,230,53,0.4)',
            }}
          >
            VS
          </span>
        </div>
        <PairColumn pair={match.pair2} />
      </div>

      <div className="mt-auto pt-3 border-t border-border">
        <div className="grid grid-cols-[1fr_auto_1fr] gap-2 items-center">
          <input
            type="number"
            min="0"
            max="99"
            value={scores[0] ?? ''}
            onChange={e => handleScore(0, e.target.value)}
            aria-label={t.rounds.scoreTeam1}
            className="w-full text-center text-lg font-bold bg-surface2 border border-border rounded-lg py-2 text-fg focus:outline-none focus:ring-2 focus:ring-brand print:border-dashed print:border-bordermd print:bg-transparent"
            placeholder="–"
          />
          <span className="text-sm font-medium text-fg3 text-center select-none">–</span>
          <input
            type="number"
            min="0"
            max="99"
            value={scores[1] ?? ''}
            onChange={e => handleScore(1, e.target.value)}
            aria-label={t.rounds.scoreTeam2}
            className="w-full text-center text-lg font-bold bg-surface2 border border-border rounded-lg py-2 text-fg focus:outline-none focus:ring-2 focus:ring-brand print:border-dashed print:border-bordermd print:bg-transparent"
            placeholder="–"
          />
        </div>
      </div>
    </div>
  )
}

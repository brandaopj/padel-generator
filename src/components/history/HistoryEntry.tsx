import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Tournament } from '../../types'
import { AppContext } from '../../context/AppContext'
import { useLanguage } from '../../context/LanguageContext'
import { useToast } from '../../context/ToastContext'

const MODE_BADGE: Record<string, string> = {
  'regular':     'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300',
  'fixed-pairs': 'bg-violet-50 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300',
  'seeded':      'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300',
}

function tournamentTitle(t: Tournament, autoTitle: { regular: (n: number) => string; fixedPairs: (n: number) => string; seeded: (n: number) => string }): string {
  if (t.clubName) return t.clubName
  return {
    'regular': autoTitle.regular(t.pairs.length),
    'fixed-pairs': autoTitle.fixedPairs(t.pairs.length),
    'seeded': autoTitle.seeded(t.pairs.length),
  }[t.mode]
}

function UseTemplateButton({ tournament }: { tournament: Tournament }) {
  const { dispatch } = useContext(AppContext)
  const { t } = useLanguage()
  const { showToast } = useToast()
  const navigate = useNavigate()

  function handleClick(e: React.MouseEvent) {
    e.stopPropagation()
    dispatch({ type: 'SET_MODE', payload: tournament.mode })
    if (tournament.mode === 'regular') {
      dispatch({ type: 'SET_PLAYERS', payload: tournament.players })
    } else if (tournament.mode === 'fixed-pairs') {
      dispatch({ type: 'SET_PAIRS', payload: tournament.pairs })
    } else {
      dispatch({ type: 'SET_TABLE_A', payload: tournament.tableA ?? [] })
      dispatch({ type: 'SET_TABLE_B', payload: tournament.tableB ?? [] })
    }
    showToast('success', t.toast.playersLoaded)
    navigate('/')
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      title={t.history.useAsTemplate}
      aria-label={t.history.useAsTemplate}
      className="w-8 h-8 flex items-center justify-center rounded-md text-fg3 hover:bg-surface2 hover:text-brand transition-colors"
    >
      {/* Copy icon (F-14) */}
      <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z"/>
        <path d="M5 3a2 2 0 00-2 2v6a2 2 0 002 2V5h8a2 2 0 00-2-2H5z"/>
      </svg>
    </button>
  )
}

function DeleteButton({ onDelete }: { onDelete: () => void }) {
  const { t } = useLanguage()
  return (
    <button
      type="button"
      onClick={e => { e.stopPropagation(); onDelete() }}
      aria-label={t.history.deleteTooltip}
      title={t.history.deleteTooltip}
      className="w-8 h-8 flex items-center justify-center rounded-md text-fg3 hover:bg-surface2 hover:text-red-500 dark:hover:text-red-400 transition-colors"
    >
      <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"/>
      </svg>
    </button>
  )
}

type Props = { tournament: Tournament; onDelete: (id: string) => void }

export function HistoryEntry({ tournament: tourney, onDelete }: Props) {
  const { lang, t } = useLanguage()
  const navigate = useNavigate()
  const title = tournamentTitle(tourney, t.history.autoTitle)

  const dateStr = new Date(tourney.date).toLocaleDateString(
    lang === 'pt' ? 'pt-PT' : 'en-GB',
    { day: 'numeric', month: 'short', year: 'numeric' }
  )

  const badgeClass = MODE_BADGE[tourney.mode] ?? 'bg-surface2 text-fg3'

  return (
    <article
      data-testid={`history-entry-${tourney.id}`}
      onClick={() => navigate(`/history/${tourney.id}`)}
      className="flex items-center gap-3 px-4 py-3 bg-surface border border-border rounded-xl cursor-pointer hover:border-brand/30 hover:shadow-sm transition-all group"
    >
      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-fg truncate leading-tight">{title}</p>
        <p className="text-xs text-fg3 mt-0.5">{dateStr}</p>
      </div>

      {/* Badges — hidden on tiny screens */}
      <div className="hidden sm:flex items-center gap-1.5 shrink-0">
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${badgeClass}`}>
          {t.modes[tourney.mode].label}
        </span>
        <span className="bg-surface2 text-fg3 px-2 py-0.5 rounded-full text-[10px] font-medium">
          {t.history.courts(tourney.courts)} · {t.history.pairs(tourney.pairs.length)}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center shrink-0" onClick={e => e.stopPropagation()}>
        <UseTemplateButton tournament={tourney} />
        <DeleteButton onDelete={() => onDelete(tourney.id)} />
      </div>

      {/* Chevron */}
      <svg className="w-4 h-4 text-fg3 shrink-0 group-hover:text-brand transition-colors" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
      </svg>
    </article>
  )
}

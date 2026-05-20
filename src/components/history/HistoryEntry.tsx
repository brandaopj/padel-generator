import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Tournament } from '../../types'
import { AppContext } from '../../context/AppContext'
import { useLanguage } from '../../context/LanguageContext'
import { useToast } from '../../context/ToastContext'
import { ShareButton } from '../ui/ShareButton'

// Mode dot colors — matches existing badge logic
const MODE_COLORS: Record<string, string> = {
  'regular':     'var(--color-brand)',
  'fixed-pairs': '#7c3aed',
  'seeded':      '#d97706',
}

function relativeTime(dateStr: string, lang: string): string {
  const now = Date.now()
  const then = new Date(dateStr).getTime()
  const diffMs = now - then
  const diffMin = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  const diffWeeks = Math.floor(diffDays / 7)
  const diffMonths = Math.floor(diffDays / 30)
  const diffYears = Math.floor(diffDays / 365)

  const isPt = lang === 'pt'
  if (diffMin < 1) return isPt ? 'Agora mesmo' : 'Just now'
  if (diffMin < 60) return isPt ? `Há ${diffMin} min` : `${diffMin}m ago`
  if (diffHours < 24) return isPt ? `Há ${diffHours} hora${diffHours !== 1 ? 's' : ''}` : `${diffHours}h ago`
  if (diffDays < 7) return isPt ? `Há ${diffDays} dia${diffDays !== 1 ? 's' : ''}` : `${diffDays}d ago`
  if (diffWeeks < 5) return isPt ? `Há ${diffWeeks} semana${diffWeeks !== 1 ? 's' : ''}` : `${diffWeeks}w ago`
  if (diffMonths < 12) return isPt ? `Há ${diffMonths} ${diffMonths === 1 ? 'mês' : 'meses'}` : `${diffMonths}mo ago`
  return isPt ? `Há ${diffYears} ano${diffYears !== 1 ? 's' : ''}` : `${diffYears}y ago`
}

function tournamentTitle(t: Tournament, autoTitle: { regular: (n: number) => string; fixedPairs: (n: number) => string; seeded: (n: number) => string }): string {
  if (t.clubName) return t.clubName
  const auto = {
    'regular': autoTitle.regular(t.pairs.length),
    'fixed-pairs': autoTitle.fixedPairs(t.pairs.length),
    'seeded': autoTitle.seeded(t.pairs.length),
  }
  return auto[t.mode]
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
      className="p-1.5 min-w-[36px] min-h-[36px] flex items-center justify-center text-fg3 hover:text-brand transition-colors rounded"
    >
      <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
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
      className="p-1.5 min-w-[36px] min-h-[36px] flex items-center justify-center text-fg3 hover:text-red-500 dark:hover:text-red-400 transition-colors rounded"
    >
      <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    </button>
  )
}

type Props = { tournament: Tournament; onDelete: (id: string) => void }

export function HistoryEntry({ tournament: tourney, onDelete }: Props) {
  const { lang, t } = useLanguage()
  const navigate = useNavigate()
  const title = tournamentTitle(tourney, t.history.autoTitle)

  const date = new Date(tourney.date)
  const day = date.toLocaleDateString(lang === 'pt' ? 'pt-PT' : 'en-GB', { day: 'numeric' })
  const month = date.toLocaleDateString(lang === 'pt' ? 'pt-PT' : 'en-GB', { month: 'short' }).replace('.', '').toUpperCase()

  const ago = relativeTime(tourney.date, lang)
  const playerCount = tourney.mode === 'regular'
    ? tourney.players.length
    : tourney.pairs.length * 2
  const meta = `${ago} · ${t.history.players(playerCount)} · ${t.history.courts(tourney.courts)}`

  return (
    <article
      data-testid={`history-entry-${tourney.id}`}
      onClick={() => navigate(`/history/${tourney.id}`)}
      className="flex items-center gap-4 py-4 cursor-pointer group hover:bg-surface2/40 rounded-lg px-2 -mx-2 transition-colors"
    >
      {/* Date block */}
      <div className="w-10 text-center shrink-0">
        <div className="text-xl font-black text-fg leading-none tabular-nums">{day}</div>
        <div className="text-[10px] font-bold text-fg3 uppercase tracking-wider mt-0.5">{month}</div>
      </div>

      {/* Vertical divider */}
      <div className="w-px h-8 bg-border shrink-0" aria-hidden="true" />

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-fg truncate leading-tight">{title}</p>
        <p className="text-xs text-fg3 mt-0.5 truncate">{meta}</p>
      </div>

      {/* Mode indicator */}
      <div className="hidden sm:flex items-center gap-1.5 shrink-0">
        <span
          className="w-2 h-2 rounded-full shrink-0"
          style={{ background: MODE_COLORS[tourney.mode] ?? 'var(--color-brand)' }}
          aria-hidden="true"
        />
        <span className="text-xs text-fg3 font-medium">{t.modes[tourney.mode].label}</span>
      </div>

      {/* Actions — stop propagation so they don't trigger navigation */}
      <div className="flex items-center shrink-0" onClick={e => e.stopPropagation()}>
        <ShareButton tournament={tourney} variant="icon" source="history" />
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

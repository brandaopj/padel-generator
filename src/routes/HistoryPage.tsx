import { useCallback, useMemo, useRef, useState } from 'react'
import type { Tournament } from '../types'
import type { GameMode } from '../types'
import { useHistory } from '../hooks/useHistory'
import { useToast } from '../context/ToastContext'
import { useLanguage } from '../context/LanguageContext'
import { HistoryList } from '../components/history/HistoryList'
import { analytics } from '../analytics'

type SortOrder = 'newest' | 'oldest'
type ModeFilter = 'all' | GameMode

export function HistoryPage() {
  const { getAll, remove } = useHistory()
  const { showToast } = useToast()
  const { t } = useLanguage()
  const [tournaments, setTournaments] = useState<Tournament[]>(() => getAll())
  const deleteTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest')
  const [modeFilter, setModeFilter] = useState<ModeFilter>('all')

  const handleDelete = useCallback((id: string) => {
    setTournaments(prev => prev.filter(tourney => tourney.id !== id))

    const timer = setTimeout(() => {
      remove(id)
      deleteTimers.current.delete(id)
      analytics.tournamentDeleted()
    }, 5000)
    deleteTimers.current.set(id, timer)

    showToast('info', t.toast.deleted, {
      duration: 5000,
      action: {
        label: t.toast.undo,
        onClick: () => {
          const pending = deleteTimers.current.get(id)
          if (pending) {
            clearTimeout(pending)
            deleteTimers.current.delete(id)
          }
          setTournaments(getAll())
        },
      },
    })
  }, [showToast, t.toast.deleted, t.toast.undo, remove, getAll])

  const filtered = useMemo(() => {
    let list = modeFilter === 'all' ? tournaments : tournaments.filter(t => t.mode === modeFilter)
    list = [...list].sort((a, b) => {
      const diff = new Date(b.date).getTime() - new Date(a.date).getTime()
      return sortOrder === 'newest' ? diff : -diff
    })
    return list
  }, [tournaments, sortOrder, modeFilter])

  const modeOptions: { value: ModeFilter; label: string }[] = [
    { value: 'all', label: t.history.filterAll },
    { value: 'regular', label: t.modes.regular.label },
    { value: 'fixed-pairs', label: t.modes['fixed-pairs'].label },
    { value: 'seeded', label: t.modes.seeded.label },
  ]

  const selectClass = 'rounded-md border border-border bg-surface text-fg2 text-sm px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand'

  return (
    <div className="max-w-4xl mx-auto p-4 lg:p-8">
      {/* Header row with filters inline */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <h1 className="text-2xl font-bold text-fg font-display">{t.history.title}</h1>
        {tournaments.length > 0 && (
          <span className="min-w-[24px] h-6 px-1.5 rounded-full bg-brand/10 text-brand text-xs font-bold flex items-center justify-center leading-none">
            {filtered.length}
          </span>
        )}
        {tournaments.length > 0 && (
          <div className="ml-auto flex gap-2">
            <select value={sortOrder} onChange={e => setSortOrder(e.target.value as SortOrder)} aria-label={t.history.sortNewest} className={selectClass}>
              <option value="newest">{t.history.sortNewest}</option>
              <option value="oldest">{t.history.sortOldest}</option>
            </select>
            <select value={modeFilter} onChange={e => setModeFilter(e.target.value as ModeFilter)} aria-label={t.history.filterAll} className={selectClass}>
              {modeOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {filtered.length === 0 && tournaments.length > 0 ? (
        <p className="text-sm text-fg3 py-12 text-center">{t.history.noResults}</p>
      ) : (
        <HistoryList tournaments={filtered} onDelete={handleDelete} />
      )}
    </div>
  )
}

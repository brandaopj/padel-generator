import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { Tournament } from '../../types'
import { useLanguage } from '../../context/LanguageContext'
import { ConfirmModal } from '../ui/ConfirmModal'
import { ShareButton } from '../ui/ShareButton'

function tournamentTitle(t: Tournament, autoTitle: { regular: (n: number) => string; fixedPairs: (n: number) => string; seeded: (n: number) => string }): string {
  if (t.clubName) return t.clubName
  const auto = {
    'regular': autoTitle.regular(t.pairs.length),
    'fixed-pairs': autoTitle.fixedPairs(t.pairs.length),
    'seeded': autoTitle.seeded(t.pairs.length),
  }
  return auto[t.mode]
}

const MODE_BADGE_CLASS: Record<string, string> = {
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
  const { t } = useLanguage()
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={e => { e.stopPropagation(); setOpen(true) }}
        aria-label={t.history.deleteTooltip}
        title={t.history.deleteTooltip}
        className="p-1.5 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-colors rounded"
      >
        <TrashIcon />
      </button>
      {open && (
        <ConfirmModal
          title={`${t.history.deleteTooltip}?`}
          description={t.confirm.clearPlayers.description}
          confirmLabel={t.history.delete}
          cancelLabel={t.confirm.cancel}
          onConfirm={() => { setOpen(false); onDelete() }}
          onCancel={() => setOpen(false)}
        />
      )}
    </>
  )
}

type Props = { tournament: Tournament; onDelete: (id: string) => void }

export function HistoryEntry({ tournament: tourney, onDelete }: Props) {
  const { lang, t } = useLanguage()
  const navigate = useNavigate()
  const title = tournamentTitle(tourney, t.history.autoTitle)
  const dateLocale = lang === 'pt' ? 'pt-PT' : 'en-GB'
  const date = new Date(tourney.date).toLocaleDateString(dateLocale, {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  return (
    <article
      data-testid={`history-entry-${tourney.id}`}
      onClick={() => navigate(`/history/${tourney.id}`)}
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md transition-all cursor-pointer"
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
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${MODE_BADGE_CLASS[tourney.mode]}`}>
            {t.modes[tourney.mode].label}
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400">
            {t.history.courts(tourney.courts)} · {t.history.pairs(tourney.pairs.length)}
          </span>
        </div>

        {/* Actions — stopPropagation so clicks here don't trigger card navigation */}
        <div className="flex items-center gap-1 shrink-0" onClick={e => e.stopPropagation()}>
          <ShareButton tournament={tourney} variant="icon" source="history" />
          <DeleteButton onDelete={() => onDelete(tourney.id)} />
          <Link
            to={`/history/${tourney.id}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-md text-xs font-medium hover:bg-blue-700 transition-colors"
          >
            {t.history.viewGames}
            <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d={ARROW_PATH} clipRule="evenodd" />
            </svg>
          </Link>
        </div>

      </div>
    </article>
  )
}

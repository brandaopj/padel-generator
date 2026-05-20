import { Calendar, Printer } from 'lucide-react'
import type { Tournament } from '../../types'
import { RoundCard } from './RoundCard'
import { useLanguage } from '../../context/LanguageContext'
import { ShareButton } from '../ui/ShareButton'

type Props = {
  tournament: Tournament | null
  onEditCourtName?: (court: number, name: string) => void
  showShare?: boolean
  onScoreChange?: (roundIdx: number, matchIdx: number, scores: [number | null, number | null]) => void
}

export function RoundsPanel({ tournament, onEditCourtName, showShare = false, onScoreChange }: Props) {
  const { lang, t } = useLanguage()

  if (!tournament) return null

  const dateLocale = lang === 'pt' ? 'pt-PT' : 'en-GB'

  return (
    <div data-testid="rounds-panel" className="space-y-8 print:space-y-4 animate-fade-in-up">
      <div className="print:pt-1">
        <div className="flex items-start justify-between gap-4 mb-3">
          <h2 className="text-3xl font-bold text-fg font-display leading-tight print:text-xl">
            {tournament.clubName || t.rounds.untitled}
          </h2>
          <div className="flex items-center gap-2 shrink-0 print:hidden">
            {showShare && <ShareButton tournament={tournament} source="rounds-panel" />}
            <button
              type="button"
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-surface2 text-fg2 rounded-md text-sm hover:bg-surface2/80 transition-colors"
            >
              <Printer className="w-4 h-4" />
              {t.print}
            </button>
          </div>
        </div>

        {/* Meta badges */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-fg3 print:hidden">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {new Date(tournament.date).toLocaleDateString(dateLocale)}
          </span>
          <span className="text-border">·</span>
          <span>{t.rounds.courts(tournament.courts)}</span>
          <span className="text-border">·</span>
          <span>{t.rounds.pairs(tournament.pairs.length)}</span>
          <span className="text-border">·</span>
          <span>{t.rounds.roundsCount(tournament.rounds.length)}</span>
        </div>

        {/* Print-only date */}
        <p className="hidden print:block text-sm text-fg2 mt-0.5">
          {new Date(tournament.date).toLocaleDateString(dateLocale)}
          {' · '}{t.rounds.courts(tournament.courts)} · {t.rounds.pairs(tournament.pairs.length)}
        </p>

        {tournament.seededWarning && (
          <p data-testid="seeded-warning" className="text-sm text-yellow-600 dark:text-yellow-400 mt-2 print:hidden">
            {t.rounds.unequalWarning(tournament.pairs.length)}
          </p>
        )}
      </div>

      {tournament.rounds.map((round, i) => (
        <RoundCard
          key={round.number}
          round={round}
          courtNames={tournament.courtNames}
          onEditCourtName={onEditCourtName}
          onScoreChange={onScoreChange ? (matchIdx, s) => onScoreChange(i, matchIdx, s) : undefined}
        />
      ))}
    </div>
  )
}

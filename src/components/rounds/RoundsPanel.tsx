import type { Tournament } from '../../types'
import { RoundCard } from './RoundCard'
import { useLanguage } from '../../context/LanguageContext'
import { ShareButton } from '../ui/ShareButton'

type Props = {
  tournament: Tournament | null
  onEditCourtName?: (court: number, name: string) => void
  showShare?: boolean
}

export function RoundsPanel({ tournament, onEditCourtName, showShare = false }: Props) {
  const { lang, t } = useLanguage()

  if (!tournament) return null

  const dateLocale = lang === 'pt' ? 'pt-PT' : 'en-GB'

  return (
    <div data-testid="rounds-panel" className="space-y-12 print:space-y-4 animate-fade-in-up">
      <div className="print:pt-1">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-xl font-bold text-fg font-display print:text-lg print:mb-0">
            {tournament.clubName || t.rounds.untitled}
          </h2>
          {showShare && (
            <div className="print:hidden shrink-0">
              <ShareButton tournament={tournament} source="rounds-panel" />
            </div>
          )}
        </div>
        <p className="text-sm text-fg2 mt-0.5">
          {new Date(tournament.date).toLocaleDateString(dateLocale)}
          <span className="print:hidden"> · {t.rounds.courts(tournament.courts)} · {t.rounds.pairs(tournament.pairs.length)}</span>
        </p>
        {tournament.seededWarning && (
          <p
            data-testid="seeded-warning"
            className="text-sm text-yellow-600 dark:text-yellow-400 mt-1 print:hidden"
          >
            {t.rounds.unequalWarning(tournament.pairs.length)}
          </p>
        )}
      </div>
      {tournament.rounds.map(round => (
        <RoundCard
          key={round.number}
          round={round}
          courtNames={tournament.courtNames}
          onEditCourtName={onEditCourtName}
        />
      ))}
    </div>
  )
}

import type { Round } from '../../types'
import { MatchCard } from './MatchCard'
import { useLanguage } from '../../context/LanguageContext'

type Props = {
  round: Round
  courtNames?: Record<number, string>
  onEditCourtName?: (court: number, name: string) => void
  onScoreChange?: (matchIdx: number, scores: [number | null, number | null]) => void
}

export function RoundCard({ round, courtNames, onEditCourtName, onScoreChange }: Props) {
  const { t } = useLanguage()

  return (
    <div
      data-testid={`round-${round.number}`}
      className="space-y-3 print:space-y-2"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-brand/10 flex items-center justify-center shrink-0">
            <span className="text-sm font-black text-brand leading-none">{round.number}</span>
          </div>
          <span className="text-lg font-bold text-fg font-display print:text-sm">
            {t.rounds.round(round.number)}
          </span>
        </div>
        <span className="text-xs font-bold tracking-widest text-fg3 uppercase">
          {t.rounds.matchCount(round.matches.length)}
        </span>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 print:grid-cols-2 print:gap-2">
        {round.matches.map((match, i) => (
          <MatchCard
            key={i}
            match={match}
            courtName={courtNames?.[match.court] ?? t.rounds.courtName(match.court)}
            onEditCourtName={onEditCourtName ? (name) => onEditCourtName(match.court, name) : undefined}
            onScoreChange={onScoreChange ? (s) => onScoreChange(i, s) : undefined}
          />
        ))}
      </div>
    </div>
  )
}

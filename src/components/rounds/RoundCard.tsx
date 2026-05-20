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
          <svg width="22" height="22" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="shrink-0">
            <circle cx="7" cy="7" r="6.5" fill="#F5C344"/>
            <path d="M1.5 7 Q7 2 12.5 7" stroke="rgba(0,0,0,0.22)" strokeWidth="1.3" strokeLinecap="round"/>
            <path d="M1.5 7 Q7 12 12.5 7" stroke="rgba(0,0,0,0.22)" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
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

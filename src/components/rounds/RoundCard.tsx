import type { Round } from '../../types'
import { MatchCard } from './MatchCard'

type Props = {
  round: Round
  courtNames?: Record<number, string>
  onEditCourtName?: (court: number, name: string) => void
}

export function RoundCard({ round, courtNames, onEditCourtName }: Props) {
  return (
    <div
      data-testid={`round-${round.number}`}
      className="space-y-3 print:break-inside-avoid break-inside-avoid"
    >
      <h3 className="font-semibold text-gray-700 dark:text-gray-300 text-sm uppercase tracking-wide print:text-base">
        Ronda {round.number}
      </h3>
      <div className="grid gap-3 sm:grid-cols-2 print:grid-cols-1">
        {round.matches.map((match, i) => (
          <MatchCard
            key={i}
            match={match}
            courtName={courtNames?.[match.court] ?? `Campo ${match.court}`}
            onEditCourtName={onEditCourtName ? (name) => onEditCourtName(match.court, name) : undefined}
          />
        ))}
      </div>
    </div>
  )
}

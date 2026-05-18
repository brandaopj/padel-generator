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
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center px-3 py-1 bg-lime-400 text-gray-900 rounded-full text-xs font-black uppercase tracking-widest shrink-0 print:bg-gray-200">
          Ronda {round.number}
        </span>
        <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
      </div>
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

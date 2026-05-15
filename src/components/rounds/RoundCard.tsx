import type { Round } from '../../types'
import { MatchCard } from './MatchCard'

type Props = { round: Round }

export function RoundCard({ round }: Props) {
  return (
    <div data-testid={`round-${round.number}`} className="space-y-2">
      <h3 className="font-semibold text-gray-700 dark:text-gray-300 text-sm uppercase tracking-wide">
        Ronda {round.number}
      </h3>
      <div className="grid gap-3 sm:grid-cols-2 print:grid-cols-1">
        {round.matches.map((match, i) => (
          <MatchCard key={i} match={match} />
        ))}
      </div>
    </div>
  )
}

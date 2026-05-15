import type { Round } from '../../types'
import { MatchCard } from './MatchCard'

type Props = { round: Round; courts: number }

export function RoundCard({ round, courts: _ }: Props) {
  return (
    <div data-testid={`round-${round.number}`} className="space-y-2">
      <h3 className="font-semibold text-gray-700 dark:text-gray-300 text-sm uppercase tracking-wide">
        Ronda {round.number}
      </h3>
      <div className="grid gap-2 sm:grid-cols-2">
        {round.matches.map((match, i) => (
          <MatchCard key={i} match={match} />
        ))}
      </div>
    </div>
  )
}

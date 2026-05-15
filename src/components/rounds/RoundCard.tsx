import type { Match, Round } from '../../types'
import { MatchCard } from './MatchCard'

type Props = { round: Round; courts: number }

export function RoundCard({ round, courts }: Props) {
  const slots: Match[][] = []
  for (let i = 0; i < round.matches.length; i += courts) {
    slots.push(round.matches.slice(i, i + courts))
  }

  const hasWaiting = slots.length > 1

  return (
    <div data-testid={`round-${round.number}`} className="space-y-3">
      <h3 className="font-semibold text-gray-700 dark:text-gray-300 text-sm uppercase tracking-wide">
        Ronda {round.number}
      </h3>

      {slots.map((slot, slotIdx) => (
        <div key={slotIdx} className="space-y-2">
          {hasWaiting && (
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Momento {slotIdx + 1}
            </p>
          )}
          <div className="grid gap-2 sm:grid-cols-2">
            {slot.map((match, i) => (
              <MatchCard key={i} match={match} />
            ))}
          </div>
          {slotIdx === 0 && hasWaiting && (
            <p className="text-xs text-amber-600 dark:text-amber-400 px-1">
              Em espera: {slots
                .slice(1)
                .flatMap(s => s.flatMap(m => [m.pair1, m.pair2]))
                .map(p => `${p[0]} / ${p[1]}`)
                .join(' · ')}
            </p>
          )}
        </div>
      ))}
    </div>
  )
}

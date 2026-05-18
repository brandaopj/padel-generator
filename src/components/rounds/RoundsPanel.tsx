import type { Tournament } from '../../types'
import { RoundCard } from './RoundCard'

type Props = {
  tournament: Tournament | null
  onEditCourtName?: (court: number, name: string) => void
}

export function RoundsPanel({ tournament, onEditCourtName }: Props) {
  if (!tournament) return null

  return (
    <div data-testid="rounds-panel" className="space-y-8 animate-fade-in-up">
      <div className="print:pt-2">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 print:text-2xl print:mb-1">
          {tournament.clubName || 'Torneio'}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          {new Date(tournament.date).toLocaleDateString('pt-PT')}
          <span className="print:hidden"> · {tournament.courts} campo(s) · {tournament.pairs.length} duplas</span>
        </p>
        {tournament.seededWarning && (
          <p
            data-testid="seeded-warning"
            className="text-sm text-yellow-600 dark:text-yellow-400 mt-1 print:hidden"
          >
            Tabelas de tamanhos diferentes — usados {tournament.pairs.length} pares.
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

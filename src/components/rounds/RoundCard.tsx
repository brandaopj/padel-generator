import type { Round } from '../../types'
import { MatchCard } from './MatchCard'
import { useLanguage } from '../../context/LanguageContext'

type Props = {
  round: Round
  courtNames?: Record<number, string>
  onEditCourtName?: (court: number, name: string) => void
}

export function RoundCard({ round, courtNames, onEditCourtName }: Props) {
  const { t } = useLanguage()

  return (
    <div
      data-testid={`round-${round.number}`}
      className="space-y-3 print:space-y-2"
    >
      <div className="flex items-center gap-4 print:gap-3 print:mb-1">
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-1 h-7 rounded-full bg-brand shrink-0 print:hidden" />
          <span className="text-xl font-bold tracking-tight text-fg font-display print:text-xs print:font-black print:uppercase print:tracking-widest print:bg-gray-200 print:text-gray-900 print:px-2 print:py-0.5 print:rounded-full">
            {t.rounds.round(round.number)}
          </span>
        </div>
        <div className="flex-1 h-px bg-border" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 print:grid-cols-2 print:gap-2">
        {round.matches.map((match, i) => (
          <MatchCard
            key={i}
            match={match}
            courtName={courtNames?.[match.court] ?? t.rounds.courtName(match.court)}
            onEditCourtName={onEditCourtName ? (name) => onEditCourtName(match.court, name) : undefined}
          />
        ))}
      </div>
    </div>
  )
}

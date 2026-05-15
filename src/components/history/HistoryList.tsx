import type { Tournament } from '../../types'
import { HistoryEntry } from './HistoryEntry'

type Props = { tournaments: Tournament[] }

export function HistoryList({ tournaments }: Props) {
  if (!tournaments.length) {
    return (
      <p
        data-testid="history-empty"
        className="text-center text-gray-400 dark:text-gray-600 py-16"
      >
        Nenhum torneio gerado ainda.
      </p>
    )
  }

  return (
    <ul data-testid="history-list" className="space-y-3">
      {tournaments.map(t => (
        <li key={t.id}>
          <HistoryEntry tournament={t} />
        </li>
      ))}
    </ul>
  )
}

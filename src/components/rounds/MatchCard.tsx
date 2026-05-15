import type { Match } from '../../types'

type Props = { match: Match }

export function MatchCard({ match }: Props) {
  return (
    <div
      data-testid="match-card"
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3"
    >
      <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
        Campo {match.court}
      </div>
      <div className="flex items-center gap-2 text-sm flex-wrap">
        <span className="font-medium text-gray-800 dark:text-gray-100">
          {match.pair1[0]} / {match.pair1[1]}
        </span>
        <span className="text-gray-400 dark:text-gray-500">vs</span>
        <span className="font-medium text-gray-800 dark:text-gray-100">
          {match.pair2[0]} / {match.pair2[1]}
        </span>
      </div>
      {/* Score line for printing */}
      <div className="mt-3 border-b border-dashed border-gray-300 dark:border-gray-600 print:border-gray-400" />
    </div>
  )
}

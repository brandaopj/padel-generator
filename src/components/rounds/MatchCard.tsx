import type { Match } from '../../types'

type Props = { match: Match }

export function MatchCard({ match }: Props) {
  return (
    <div
      data-testid="match-card"
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3"
    >
      <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
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
      <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 print:border-gray-300">
        <div className="flex items-end gap-2 text-xs text-gray-400 dark:text-gray-500 print:text-gray-600">
          <span className="shrink-0">Resultado:</span>
          <div className="flex-1 border-b-2 border-gray-200 dark:border-gray-600 print:border-gray-500 h-7" />
        </div>
      </div>
    </div>
  )
}

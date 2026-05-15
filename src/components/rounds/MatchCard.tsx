import type { Match, Pair } from '../../types'

function PlayerAvatar() {
  return (
    <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/40 print:bg-gray-100 flex items-center justify-center shrink-0">
      <svg
        className="w-4 h-4 text-blue-500 dark:text-blue-400 print:text-gray-500"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  )
}

function PairColumn({ pair }: { pair: Pair }) {
  return (
    <div className="flex flex-col gap-1.5 min-w-0">
      {pair.map((name, i) => (
        <div key={i} className="flex items-center gap-2 min-w-0">
          <PlayerAvatar />
          <span className="text-sm font-medium text-gray-800 dark:text-gray-100 break-words">{name}</span>
        </div>
      ))}
    </div>
  )
}

type Props = { match: Match }

export function MatchCard({ match }: Props) {
  return (
    <div
      data-testid="match-card"
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 print:p-4 print:border-gray-400"
    >
      <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
        Campo {match.court}
      </div>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
        <PairColumn pair={match.pair1} />
        <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 px-1 self-center">vs</span>
        <PairColumn pair={match.pair2} />
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

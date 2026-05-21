import type { PairStanding } from '../../utils/standings'
import { useLanguage } from '../../context/LanguageContext'

type Props = { standings: PairStanding[] }

export function StandingsTable({ standings }: Props) {
  const { t } = useLanguage()
  const s = t.rounds.standings

  return (
    <div data-testid="standings-table" className="rounded-xl border border-border overflow-hidden">
      <div className="px-4 py-3 bg-surface2 border-b border-border">
        <h3 className="text-sm font-bold text-fg tracking-wide">{s.title}</h3>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-xs font-semibold text-fg3 uppercase tracking-wider border-b border-border">
            <th className="text-left px-4 py-2 w-8">{s.pos}</th>
            <th className="text-left px-4 py-2">{s.team}</th>
            <th className="text-right px-3 py-2">{s.played}</th>
            <th className="text-right px-3 py-2">{s.won}</th>
            <th className="text-right px-3 py-2">{s.lost}</th>
            {standings.some(r => r.drawn > 0) && (
              <th className="text-right px-3 py-2">{s.drawn}</th>
            )}
            <th className="text-right px-3 py-2">{s.pointsFor}</th>
            <th className="text-right px-3 py-2">{s.pointsAgainst}</th>
            <th className="text-right px-4 py-2">{s.diff}</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((row, idx) => {
            const isFirst = idx === 0
            const isSameWinsAsPrev = idx > 0 && row.won === standings[idx - 1].won && row.diff === standings[idx - 1].diff
            return (
              <tr
                key={row.pair.join('\x00')}
                className={`border-b border-border last:border-0 transition-colors ${isFirst ? 'bg-brand/5' : 'hover:bg-surface2/50'}`}
              >
                <td className="px-4 py-2.5 font-bold tabular-nums">
                  {isFirst ? (
                    <span className="text-brand">1</span>
                  ) : (
                    <span className={isSameWinsAsPrev ? 'text-fg3' : 'text-fg2'}>{idx + 1}</span>
                  )}
                </td>
                <td className="px-4 py-2.5 font-medium text-fg">
                  {row.pair.join(' / ')}
                </td>
                <td className="px-3 py-2.5 text-right tabular-nums text-fg2">{row.played}</td>
                <td className="px-3 py-2.5 text-right tabular-nums font-semibold text-fg">{row.won}</td>
                <td className="px-3 py-2.5 text-right tabular-nums text-fg3">{row.lost}</td>
                {standings.some(r => r.drawn > 0) && (
                  <td className="px-3 py-2.5 text-right tabular-nums text-fg3">{row.drawn}</td>
                )}
                <td className="px-3 py-2.5 text-right tabular-nums text-fg2">{row.pointsFor}</td>
                <td className="px-3 py-2.5 text-right tabular-nums text-fg3">{row.pointsAgainst}</td>
                <td className={`px-4 py-2.5 text-right tabular-nums font-semibold ${row.diff > 0 ? 'text-green-600 dark:text-green-400' : row.diff < 0 ? 'text-red-500 dark:text-red-400' : 'text-fg3'}`}>
                  {row.diff > 0 ? `+${row.diff}` : row.diff}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

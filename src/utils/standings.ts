import type { Tournament, Pair } from '../types'

export type PairStanding = {
  pair: Pair
  played: number
  won: number
  lost: number
  drawn: number
  pointsFor: number
  pointsAgainst: number
  diff: number
}

export function allMatchesScored(tournament: Tournament): boolean {
  return tournament.rounds.every(round =>
    round.matches.every(m =>
      m.scores !== undefined && m.scores[0] !== null && m.scores[1] !== null
    )
  )
}

export function buildStandings(tournament: Tournament): PairStanding[] {
  const map = new Map<string, PairStanding>()

  function key(pair: Pair): string {
    return pair.join('\x00')
  }

  function getOrCreate(pair: Pair): PairStanding {
    const k = key(pair)
    if (!map.has(k)) map.set(k, { pair, played: 0, won: 0, lost: 0, drawn: 0, pointsFor: 0, pointsAgainst: 0, diff: 0 })
    return map.get(k)!
  }

  for (const round of tournament.rounds) {
    for (const match of round.matches) {
      if (!match.scores || match.scores[0] === null || match.scores[1] === null) continue
      const [s1, s2] = match.scores as [number, number]
      const a = getOrCreate(match.pair1)
      const b = getOrCreate(match.pair2)

      a.played++; b.played++
      a.pointsFor += s1; a.pointsAgainst += s2
      b.pointsFor += s2; b.pointsAgainst += s1
      a.diff = a.pointsFor - a.pointsAgainst
      b.diff = b.pointsFor - b.pointsAgainst

      if (s1 > s2) { a.won++; b.lost++ }
      else if (s2 > s1) { b.won++; a.lost++ }
      else { a.drawn++; b.drawn++ }
    }
  }

  return [...map.values()].sort((a, b) =>
    b.won - a.won ||
    b.diff - a.diff ||
    b.pointsFor - a.pointsFor ||
    a.pair.join('').localeCompare(b.pair.join(''))
  )
}

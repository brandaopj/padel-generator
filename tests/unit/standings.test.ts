import { describe, it, expect } from 'vitest'
import { allMatchesScored, buildStandings } from '../../src/utils/standings'
import type { Tournament } from '../../src/types'

function makeTournament(rounds: Tournament['rounds']): Tournament {
  return {
    id: 'test',
    date: new Date().toISOString(),
    clubName: 'Test',
    mode: 'regular',
    courts: 1,
    players: [],
    pairs: [],
    rounds,
  }
}

const A: [string, string] = ['Ana Costa', 'Bruno Silva']
const B: [string, string] = ['Carlos Mota', 'Diana Ferreira']
const C: [string, string] = ['Eduardo Pinto', 'Filipa Santos']
const D: [string, string] = ['Gonçalo Lima', 'Helena Cruz']

describe('allMatchesScored', () => {
  it('returns true when all matches have non-null scores', () => {
    const t = makeTournament([
      { number: 1, matches: [{ pair1: A, pair2: B, court: 1, scores: [6, 4] }] },
    ])
    expect(allMatchesScored(t)).toBe(true)
  })

  it('returns false when a match has no scores', () => {
    const t = makeTournament([
      { number: 1, matches: [{ pair1: A, pair2: B, court: 1 }] },
    ])
    expect(allMatchesScored(t)).toBe(false)
  })

  it('returns false when a match has null in scores tuple', () => {
    const t = makeTournament([
      { number: 1, matches: [{ pair1: A, pair2: B, court: 1, scores: [6, null] }] },
    ])
    expect(allMatchesScored(t)).toBe(false)
  })

  it('returns false when one round is fully scored but another is not', () => {
    const t = makeTournament([
      { number: 1, matches: [{ pair1: A, pair2: B, court: 1, scores: [6, 4] }] },
      { number: 2, matches: [{ pair1: C, pair2: D, court: 1 }] },
    ])
    expect(allMatchesScored(t)).toBe(false)
  })

  it('returns true for a tournament with no rounds', () => {
    expect(allMatchesScored(makeTournament([]))).toBe(true)
  })
})

describe('buildStandings', () => {
  it('ranks the winner first', () => {
    const t = makeTournament([
      { number: 1, matches: [{ pair1: A, pair2: B, court: 1, scores: [6, 3] }] },
    ])
    const result = buildStandings(t)
    expect(result[0].pair).toEqual(A)
    expect(result[1].pair).toEqual(B)
  })

  it('counts wins, losses, points correctly', () => {
    const t = makeTournament([
      { number: 1, matches: [{ pair1: A, pair2: B, court: 1, scores: [6, 4] }] },
    ])
    const [first, second] = buildStandings(t)
    expect(first.won).toBe(1)
    expect(first.lost).toBe(0)
    expect(first.pointsFor).toBe(6)
    expect(first.pointsAgainst).toBe(4)
    expect(first.diff).toBe(2)
    expect(second.won).toBe(0)
    expect(second.lost).toBe(1)
    expect(second.pointsFor).toBe(4)
    expect(second.diff).toBe(-2)
  })

  it('accumulates stats across multiple rounds', () => {
    const t = makeTournament([
      { number: 1, matches: [{ pair1: A, pair2: B, court: 1, scores: [6, 3] }] },
      { number: 2, matches: [{ pair1: A, pair2: C, court: 1, scores: [6, 2] }] },
    ])
    const standings = buildStandings(t)
    const a = standings.find(r => r.pair === A)!
    expect(a.played).toBe(2)
    expect(a.won).toBe(2)
    expect(a.pointsFor).toBe(12)
  })

  it('counts draws correctly', () => {
    const t = makeTournament([
      { number: 1, matches: [{ pair1: A, pair2: B, court: 1, scores: [6, 6] }] },
    ])
    const standings = buildStandings(t)
    expect(standings[0].drawn).toBe(1)
    expect(standings[1].drawn).toBe(1)
    expect(standings[0].won).toBe(0)
    expect(standings[0].lost).toBe(0)
  })

  it('uses point diff as tiebreaker when wins are equal', () => {
    // A beats C, B beats D, then A vs B and C vs D — end equal wins
    const t = makeTournament([
      {
        number: 1, matches: [
          { pair1: A, pair2: B, court: 1, scores: [6, 3] },
          { pair1: C, pair2: D, court: 2, scores: [6, 2] },
        ],
      },
      {
        number: 2, matches: [
          { pair1: A, pair2: D, court: 1, scores: [2, 6] },
          { pair1: B, pair2: C, court: 2, scores: [6, 2] },
        ],
      },
    ])
    const standings = buildStandings(t)
    // A: 1W 1L diff=1, B: 1W 1L diff=1, C: 1W 1L diff=-4, D: 1W 1L diff=2
    const d = standings.find(r => r.pair === D)!
    const a = standings.find(r => r.pair === A)!
    expect(standings.indexOf(d)).toBeLessThan(standings.indexOf(a))
  })

  it('skips matches without scores', () => {
    const t = makeTournament([
      { number: 1, matches: [{ pair1: A, pair2: B, court: 1 }] },
    ])
    const standings = buildStandings(t)
    // No scores → no rows
    expect(standings).toHaveLength(0)
  })

  it('returns an entry per unique pair', () => {
    const t = makeTournament([
      {
        number: 1, matches: [
          { pair1: A, pair2: B, court: 1, scores: [6, 4] },
          { pair1: C, pair2: D, court: 2, scores: [3, 6] },
        ],
      },
    ])
    expect(buildStandings(t)).toHaveLength(4)
  })
})

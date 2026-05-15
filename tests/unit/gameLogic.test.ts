import { describe, it, expect } from 'vitest'
import {
  shuffle,
  makePairs,
  makeSeededPairs,
  roundRobin,
  distribute,
  generateId,
} from '../../src/utils/gameLogic'
import type { Pair } from '../../src/types'

describe('shuffle', () => {
  it('returns a copy with the same elements', () => {
    const arr = ['A', 'B', 'C', 'D']
    const result = shuffle(arr)
    expect(result).toHaveLength(arr.length)
    expect([...result].sort()).toEqual([...arr].sort())
  })

  it('does not mutate the original array', () => {
    const arr = ['A', 'B', 'C']
    const copy = [...arr]
    shuffle(arr)
    expect(arr).toEqual(copy)
  })
})

describe('makePairs', () => {
  it('groups even list of players into pairs', () => {
    const players = ['A', 'B', 'C', 'D']
    const pairs = makePairs(players)
    expect(pairs).toHaveLength(2)
    pairs.forEach(p => expect(p).toHaveLength(2))
  })

  it('contains every player exactly once', () => {
    const players = ['A', 'B', 'C', 'D', 'E', 'F']
    const flat = makePairs(players).flat()
    expect(flat.sort()).toEqual([...players].sort())
  })
})

describe('makeSeededPairs', () => {
  it('pairs tableA and tableB by index after shuffling', () => {
    const tableA = ['A1', 'A2', 'A3']
    const tableB = ['B1', 'B2', 'B3']
    const pairs = makeSeededPairs(tableA, tableB)
    expect(pairs).toHaveLength(3)
    pairs.forEach(p => {
      expect(tableA).toContain(p[0])
      expect(tableB).toContain(p[1])
    })
  })

  it('trims to the shorter table when sizes differ', () => {
    const pairs = makeSeededPairs(['A1', 'A2', 'A3'], ['B1', 'B2'])
    expect(pairs).toHaveLength(2)
  })
})

describe('roundRobin', () => {
  it('returns empty array for fewer than 2 pairs', () => {
    expect(roundRobin([])).toEqual([])
    expect(roundRobin([['A', 'B']])).toEqual([])
  })

  it('generates N-1 rounds for even N pairs', () => {
    const pairs: Pair[] = [['A','B'],['C','D'],['E','F'],['G','H']]
    expect(roundRobin(pairs)).toHaveLength(3)
  })

  it('every pair plays every other pair exactly once', () => {
    const pairs: Pair[] = [['A','B'],['C','D'],['E','F'],['G','H']]
    const rounds = roundRobin(pairs)
    const matchups = rounds.flatMap(r =>
      r.matches.map(m => [m.pair1, m.pair2].map(p => pairs.indexOf(p)).sort().join('-'))
    )
    const n = pairs.length
    const expected = (n * (n - 1)) / 2
    expect(new Set(matchups).size).toBe(expected)
  })

  it('no pair plays twice in the same round', () => {
    const pairs: Pair[] = [['A','B'],['C','D'],['E','F'],['G','H']]
    const rounds = roundRobin(pairs)
    rounds.forEach(round => {
      const seen = new Set<Pair>()
      round.matches.forEach(m => {
        expect(seen.has(m.pair1)).toBe(false)
        expect(seen.has(m.pair2)).toBe(false)
        seen.add(m.pair1)
        seen.add(m.pair2)
      })
    })
  })
})

describe('distribute', () => {
  it('assigns court numbers between 1 and courts', () => {
    const pairs: Pair[] = [['A','B'],['C','D'],['E','F'],['G','H']]
    const rounds = roundRobin(pairs)
    const result = distribute(rounds, 2)
    result.forEach(round =>
      round.matches.forEach(m => {
        expect(m.court).toBeGreaterThanOrEqual(1)
        expect(m.court).toBeLessThanOrEqual(2)
      })
    )
  })

  it('cycles courts for matches within a round', () => {
    const pairs: Pair[] = [['A','B'],['C','D'],['E','F'],['G','H']]
    const rounds = roundRobin(pairs)
    const result = distribute(rounds, 2)
    expect(result[0].matches[0].court).toBe(1)
    expect(result[0].matches[1].court).toBe(2)
  })
})

describe('generateId', () => {
  it('returns a non-empty string', () => {
    expect(typeof generateId()).toBe('string')
    expect(generateId().length).toBeGreaterThan(0)
  })

  it('returns unique values', () => {
    const ids = new Set(Array.from({ length: 100 }, generateId))
    expect(ids.size).toBe(100)
  })
})

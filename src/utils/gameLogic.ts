import type { GameMode, Pair, Round, Match, Tournament } from '../types'

export function shuffle<T>(array: T[]): T[] {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export function makePairs(players: string[]): Pair[] {
  const shuffled = shuffle(players)
  const pairs: Pair[] = []
  for (let i = 0; i < shuffled.length - 1; i += 2) {
    pairs.push([shuffled[i], shuffled[i + 1]])
  }
  return pairs
}

export function makeSeededPairs(tableA: string[], tableB: string[]): Pair[] {
  const sA = shuffle(tableA)
  const sB = shuffle(tableB)
  const len = Math.min(sA.length, sB.length)
  return Array.from({ length: len }, (_, i) => [sA[i], sB[i]] as Pair)
}

export function roundRobin(pairs: Pair[]): Round[] {
  if (pairs.length < 2) return []

  const list: (Pair | null)[] = [...pairs]
  if (list.length % 2 !== 0) list.push(null)

  const n = list.length
  const rounds: Round[] = []

  for (let r = 0; r < n - 1; r++) {
    const matches: Match[] = []
    for (let i = 0; i < n / 2; i++) {
      const home = list[i]
      const away = list[n - 1 - i]
      if (home !== null && away !== null) {
        matches.push({ pair1: home, pair2: away, court: 0 })
      }
    }
    rounds.push({ number: r + 1, matches })
    // Rotate: fix index 0, move last element to position 1
    list.splice(1, 0, list.pop()!)
  }

  return rounds
}

export function distribute(rounds: Round[], courts: number): Round[] {
  return rounds.map(round => ({
    ...round,
    matches: round.matches.map((match, i) => ({
      ...match,
      court: (i % courts) + 1,
    })),
  }))
}

export function generateId(): string {
  return Math.random().toString(36).slice(2, 9)
}

export function generateTournament(inputs: {
  mode: GameMode
  clubName: string
  courts: number
  players: string[]
  pairs: Pair[]
  tableA: string[]
  tableB: string[]
  maxRounds?: number | null
}): Tournament {
  const { mode, clubName, courts, players, pairs: inputPairs, tableA, tableB, maxRounds } = inputs

  let finalPairs: Pair[]
  if (mode === 'regular') {
    finalPairs = makePairs(players)
  } else if (mode === 'fixed-pairs') {
    finalPairs = [...inputPairs]
  } else {
    finalPairs = makeSeededPairs(tableA, tableB)
  }

  const allRounds = distribute(roundRobin(finalPairs), courts)
  const rounds = maxRounds != null ? allRounds.slice(0, maxRounds) : allRounds
  const seededWarning = mode === 'seeded' && tableA.length !== tableB.length

  return {
    id: generateId(),
    date: new Date().toISOString(),
    clubName,
    mode,
    courts,
    players: mode === 'regular' ? [...players] : [],
    pairs: finalPairs,
    ...(mode === 'seeded' && { tableA: [...tableA], tableB: [...tableB] }),
    rounds,
    ...(seededWarning && { seededWarning: true }),
  }
}

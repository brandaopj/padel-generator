// src/types/index.ts
export type GameMode = 'regular' | 'fixed-pairs' | 'seeded'

export type Pair = [string, string]

export type Match = {
  pair1: Pair
  pair2: Pair
  court: number
  scores?: [number | null, number | null]
}

export type Round = {
  number: number
  matches: Match[]
}

export type Tournament = {
  id: string
  date: string           // ISO 8601
  clubName: string
  mode: GameMode
  courts: number
  players: string[]      // Regular: input players; empty for other modes
  pairs: Pair[]          // All modes: final generated pairs
  tableA?: string[]      // Seeded: original Table A
  tableB?: string[]      // Seeded: original Table B
  rounds: Round[]
  seededWarning?: boolean
  courtNames?: Record<number, string>
}

export type AppState = {
  mode: GameMode
  courts: number
  clubName: string
  players: string[]
  pairs: Pair[]
  tableA: string[]
  tableB: string[]
  generated: Tournament | null
  maxRounds: number | null
}

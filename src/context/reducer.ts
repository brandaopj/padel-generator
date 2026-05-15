import type { AppState, GameMode, Pair, Tournament } from '../types'

export type Action =
  | { type: 'SET_MODE'; payload: GameMode }
  | { type: 'SET_COURTS'; payload: number }
  | { type: 'SET_CLUB_NAME'; payload: string }
  | { type: 'SET_PLAYERS'; payload: string[] }
  | { type: 'SET_PAIRS'; payload: Pair[] }
  | { type: 'SET_TABLE_A'; payload: string[] }
  | { type: 'SET_TABLE_B'; payload: string[] }
  | { type: 'SET_GENERATED'; payload: Tournament | null }
  | { type: 'RESET' }

export const initialState: AppState = {
  mode: 'regular',
  courts: 2,
  clubName: '',
  players: [],
  pairs: [],
  tableA: [],
  tableB: [],
  generated: null,
}

function autoCourts(numPairs: number): number {
  return Math.max(1, Math.floor(numPairs / 2))
}

export function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_MODE':
      return { ...state, mode: action.payload, generated: null }
    case 'SET_COURTS':
      return { ...state, courts: action.payload }
    case 'SET_CLUB_NAME':
      return { ...state, clubName: action.payload }
    case 'SET_PLAYERS': {
      const players = action.payload
      const courts = autoCourts(Math.floor(players.length / 2))
      return { ...state, players, courts }
    }
    case 'SET_PAIRS': {
      const pairs = action.payload
      const courts = autoCourts(pairs.length)
      return { ...state, pairs, courts }
    }
    case 'SET_TABLE_A': {
      const tableA = action.payload
      const courts = autoCourts(Math.min(tableA.length, state.tableB.length))
      return { ...state, tableA, courts }
    }
    case 'SET_TABLE_B': {
      const tableB = action.payload
      const courts = autoCourts(Math.min(state.tableA.length, tableB.length))
      return { ...state, tableB, courts }
    }
    case 'SET_GENERATED':
      return { ...state, generated: action.payload }
    case 'RESET':
      return initialState
    default:
      return state
  }
}

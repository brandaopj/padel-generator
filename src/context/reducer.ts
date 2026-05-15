import type { AppState, GameMode, Pair, Tournament } from '../types'

export type Action =
  | { type: 'SET_MODE'; payload: GameMode }
  | { type: 'SET_COURTS'; payload: number }
  | { type: 'SET_CLUB_NAME'; payload: string }
  | { type: 'ADD_PLAYER'; payload: string }
  | { type: 'REMOVE_PLAYER'; payload: number }
  | { type: 'ADD_PAIR'; payload: Pair }
  | { type: 'REMOVE_PAIR'; payload: number }
  | { type: 'ADD_TABLE_A'; payload: string }
  | { type: 'REMOVE_TABLE_A'; payload: number }
  | { type: 'ADD_TABLE_B'; payload: string }
  | { type: 'REMOVE_TABLE_B'; payload: number }
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

export function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_MODE':
      // Switching mode resets inputs but preserves courts and clubName
      return { ...initialState, mode: action.payload, courts: state.courts, clubName: state.clubName }
    case 'SET_COURTS':
      return { ...state, courts: action.payload }
    case 'SET_CLUB_NAME':
      return { ...state, clubName: action.payload }
    case 'ADD_PLAYER':
      return { ...state, players: [...state.players, action.payload] }
    case 'REMOVE_PLAYER':
      return { ...state, players: state.players.filter((_, i) => i !== action.payload) }
    case 'ADD_PAIR':
      return { ...state, pairs: [...state.pairs, action.payload] }
    case 'REMOVE_PAIR':
      return { ...state, pairs: state.pairs.filter((_, i) => i !== action.payload) }
    case 'ADD_TABLE_A':
      return { ...state, tableA: [...state.tableA, action.payload] }
    case 'REMOVE_TABLE_A':
      return { ...state, tableA: state.tableA.filter((_, i) => i !== action.payload) }
    case 'ADD_TABLE_B':
      return { ...state, tableB: [...state.tableB, action.payload] }
    case 'REMOVE_TABLE_B':
      return { ...state, tableB: state.tableB.filter((_, i) => i !== action.payload) }
    case 'SET_GENERATED':
      return { ...state, generated: action.payload }
    case 'RESET':
      return initialState
    default:
      return state
  }
}

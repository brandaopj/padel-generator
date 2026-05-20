import type { AppState } from '../types'
import type { Translations } from '../i18n/translations'

export type ValidationResult = {
  errors: string[]
  warnings: string[]
}

export function validate(state: AppState, tv: Translations['validation']): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  if (state.courts < 1) errors.push(tv.minCourt)
  if (state.mode === 'regular') {
    if (state.players.length < 4) {
      errors.push(tv.minPlayersRegular(state.players.length))
    } else if (state.players.length % 4 !== 0) {
      const excess = state.players.length % 4
      const needed = 4 - excess
      errors.push(tv.multipleOf4(state.players.length, needed, excess))
    }
  }
  if (state.mode === 'fixed-pairs') {
    if (state.pairs.length < 2) errors.push(tv.minPairsFixed)
  }
  if (state.mode === 'seeded') {
    if (state.tableA.length < 2) errors.push(tv.minTableASeeded)
    if (state.tableB.length < 2) errors.push(tv.minTableBSeeded)
    if (state.tableA.length >= 2 && state.tableB.length >= 2 && state.tableA.length !== state.tableB.length) {
      warnings.push(tv.unequalTables(state.tableA.length, state.tableB.length, Math.min(state.tableA.length, state.tableB.length)))
    }
  }

  return { errors, warnings }
}

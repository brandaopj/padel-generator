import type { AppState } from '../types'

export type ValidationResult = {
  errors: string[]
  warnings: string[]
}

export function validate(state: AppState): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  if (state.courts < 1) {
    errors.push('É necessário pelo menos 1 campo')
  }

  if (state.mode === 'regular') {
    if (state.players.length < 4) {
      errors.push('Modo Regular requer pelo menos 4 jogadores')
    } else if (state.players.length % 4 !== 0) {
      errors.push('O número de jogadores deve ser múltiplo de 4 (4, 8, 12…)')
    }
  }

  if (state.mode === 'fixed-pairs') {
    if (state.pairs.length < 2) {
      errors.push('Modo Duplas Fixas requer pelo menos 2 duplas')
    }
  }

  if (state.mode === 'seeded') {
    if (state.tableA.length < 2) {
      errors.push('A Tabela A requer pelo menos 2 jogadores')
    }
    if (state.tableB.length < 2) {
      errors.push('A Tabela B requer pelo menos 2 jogadores')
    }
    if (
      state.tableA.length >= 2 &&
      state.tableB.length >= 2 &&
      state.tableA.length !== state.tableB.length
    ) {
      warnings.push(
        `As tabelas têm tamanhos diferentes (A: ${state.tableA.length}, B: ${state.tableB.length}). Serão usados ${Math.min(state.tableA.length, state.tableB.length)} pares.`
      )
    }
  }

  return { errors, warnings }
}

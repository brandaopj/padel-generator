import { describe, it, expect } from 'vitest'
import { validate } from '../../src/utils/validation'
import type { AppState } from '../../src/types'

const base: AppState = {
  mode: 'regular',
  courts: 2,
  clubName: '',
  players: [],
  pairs: [],
  tableA: [],
  tableB: [],
  generated: null,
}

describe('validate — Regular mode', () => {
  it('errors when fewer than 4 players', () => {
    const { errors } = validate({ ...base, players: ['A', 'B'] })
    expect(errors.some(e => e.includes('4'))).toBe(true)
  })

  it('errors when player count is odd', () => {
    const { errors } = validate({ ...base, players: ['A', 'B', 'C', 'D', 'E'] })
    expect(errors.some(e => e.toLowerCase().includes('par'))).toBe(true)
  })

  it('no errors for 4 players with 1 court', () => {
    const { errors } = validate({ ...base, players: ['A', 'B', 'C', 'D'], courts: 1 })
    expect(errors).toHaveLength(0)
  })
})

describe('validate — Duplas Fixas mode', () => {
  it('errors when fewer than 2 pairs', () => {
    const { errors } = validate({ ...base, mode: 'fixed-pairs', pairs: [['A', 'B']] })
    expect(errors.some(e => e.includes('2'))).toBe(true)
  })

  it('no errors for 2 pairs', () => {
    const { errors } = validate({
      ...base,
      mode: 'fixed-pairs',
      pairs: [['A', 'B'], ['C', 'D']],
    })
    expect(errors).toHaveLength(0)
  })
})

describe('validate — Cabeças de Série mode', () => {
  it('errors when table A has fewer than 2 players', () => {
    const { errors } = validate({
      ...base,
      mode: 'seeded',
      tableA: ['A1'],
      tableB: ['B1', 'B2'],
    })
    expect(errors.some(e => e.includes('A'))).toBe(true)
  })

  it('errors when table B has fewer than 2 players', () => {
    const { errors } = validate({
      ...base,
      mode: 'seeded',
      tableA: ['A1', 'A2'],
      tableB: ['B1'],
    })
    expect(errors.some(e => e.includes('B'))).toBe(true)
  })

  it('warns (non-blocking) when tables have different sizes', () => {
    const result = validate({
      ...base,
      mode: 'seeded',
      tableA: ['A1', 'A2', 'A3'],
      tableB: ['B1', 'B2'],
    })
    expect(result.errors).toHaveLength(0)
    expect(result.warnings.length).toBeGreaterThan(0)
  })

  it('no errors or warnings for equal-sized tables', () => {
    const result = validate({
      ...base,
      mode: 'seeded',
      tableA: ['A1', 'A2'],
      tableB: ['B1', 'B2'],
    })
    expect(result.errors).toHaveLength(0)
    expect(result.warnings).toHaveLength(0)
  })
})

describe('validate — courts', () => {
  it('errors when courts is 0', () => {
    const { errors } = validate({ ...base, players: ['A','B','C','D'], courts: 0 })
    expect(errors.some(e => e.includes('campo'))).toBe(true)
  })
})

import { describe, it, expect, beforeEach } from 'vitest'
import { useHistory } from '../../src/hooks/useHistory'
import type { Tournament } from '../../src/types'

function makeTournament(id: string, clubName = 'Club'): Tournament {
  return {
    id,
    date: new Date().toISOString(),
    clubName,
    mode: 'regular',
    courts: 2,
    players: ['A', 'B', 'C', 'D'],
    pairs: [['A', 'B'], ['C', 'D']],
    rounds: [],
  }
}

describe('useHistory', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('getAll returns empty array when localStorage is empty', () => {
    const { getAll } = useHistory()
    expect(getAll()).toEqual([])
  })

  it('save adds tournament to history', () => {
    const { save, getAll } = useHistory()
    save(makeTournament('t1'))
    expect(getAll()).toHaveLength(1)
  })

  it('save prepends newest tournament first', () => {
    const { save, getAll } = useHistory()
    save(makeTournament('t1'))
    save(makeTournament('t2'))
    const all = getAll()
    expect(all[0].id).toBe('t2')
    expect(all[1].id).toBe('t1')
  })

  it('getById returns the correct tournament', () => {
    const { save, getById } = useHistory()
    save(makeTournament('abc', 'My Club'))
    const t = getById('abc')
    expect(t?.clubName).toBe('My Club')
  })

  it('getById returns undefined when id not found', () => {
    const { getById } = useHistory()
    expect(getById('nonexistent')).toBeUndefined()
  })

  it('getAll returns empty array when localStorage contains invalid JSON', () => {
    localStorage.setItem('padel-history', 'not-json')
    const { getAll } = useHistory()
    expect(getAll()).toEqual([])
  })
})

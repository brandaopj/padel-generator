import type { Tournament } from '../types'

const KEY = 'padel-history'

export function useHistory() {
  function getAll(): Tournament[] {
    try {
      return JSON.parse(localStorage.getItem(KEY) ?? '[]') as Tournament[]
    } catch {
      return []
    }
  }

  function save(tournament: Tournament): void {
    const all = getAll()
    localStorage.setItem(KEY, JSON.stringify([tournament, ...all]))
  }

  function getById(id: string): Tournament | undefined {
    return getAll().find(t => t.id === id)
  }

  function update(tournament: Tournament): void {
    const all = getAll()
    const idx = all.findIndex(t => t.id === tournament.id)
    if (idx === -1) return
    all[idx] = tournament
    localStorage.setItem(KEY, JSON.stringify(all))
  }

  return { getAll, save, getById, update }
}

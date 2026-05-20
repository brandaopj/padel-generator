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
    try { localStorage.setItem(KEY, JSON.stringify([tournament, ...all])) } catch { /* quota exceeded */ }
    window.dispatchEvent(new CustomEvent('padel-history-change'))
  }

  function getById(id: string): Tournament | undefined {
    return getAll().find(t => t.id === id)
  }

  function update(tournament: Tournament): void {
    const all = getAll()
    const idx = all.findIndex(t => t.id === tournament.id)
    if (idx === -1) return
    all[idx] = tournament
    try { localStorage.setItem(KEY, JSON.stringify(all)) } catch { /* quota exceeded */ }
  }

  function remove(id: string): void {
    try { localStorage.setItem(KEY, JSON.stringify(getAll().filter(t => t.id !== id))) } catch { /* quota exceeded */ }
    window.dispatchEvent(new CustomEvent('padel-history-change'))
  }

  return { getAll, save, getById, update, remove }
}

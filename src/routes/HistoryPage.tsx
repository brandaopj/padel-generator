import { useCallback, useState } from 'react'
import type { Tournament } from '../types'
import { useHistory } from '../hooks/useHistory'
import { HistoryList } from '../components/history/HistoryList'

export function HistoryPage() {
  const { getAll, remove } = useHistory()
  const [tournaments, setTournaments] = useState<Tournament[]>(() => getAll())

  const handleDelete = useCallback((id: string) => {
    remove(id)
    setTournaments(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <div className="max-w-2xl mx-auto p-4 lg:p-8">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">Histórico</h1>
      <HistoryList tournaments={tournaments} onDelete={handleDelete} />
    </div>
  )
}

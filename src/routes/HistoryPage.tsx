import { useCallback, useState } from 'react'
import type { Tournament } from '../types'
import { useHistory } from '../hooks/useHistory'
import { useToast } from '../context/ToastContext'
import { useLanguage } from '../context/LanguageContext'
import { HistoryList } from '../components/history/HistoryList'
import { analytics } from '../analytics'

export function HistoryPage() {
  const { getAll, remove } = useHistory()
  const { showToast } = useToast()
  const { t } = useLanguage()
  const [tournaments, setTournaments] = useState<Tournament[]>(() => getAll())

  const handleDelete = useCallback((id: string) => {
    remove(id)
    setTournaments(prev => prev.filter(tourney => tourney.id !== id))
    showToast('info', t.toast.deleted)
    analytics.tournamentDeleted()
  }, [showToast, t.toast.deleted])

  return (
    <div className="max-w-2xl mx-auto p-4 lg:p-8">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">{t.history.title}</h1>
      <HistoryList tournaments={tournaments} onDelete={handleDelete} />
    </div>
  )
}

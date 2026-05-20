import { useParams, Link } from 'react-router-dom'
import type { Tournament } from '../types'
import { useHistory } from '../hooks/useHistory'
import { useLanguage } from '../context/LanguageContext'
import { RoundsPanel } from '../components/rounds/RoundsPanel'
import { ShareButton } from '../components/ui/ShareButton'
import { PrintButton } from '../components/ui/PrintButton'

export function TournamentDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { getById } = useHistory()
  const { t } = useLanguage()
  const tournament: Tournament | null = id ? (getById(id) ?? null) : null

  if (!tournament) {
    return (
      <div className="flex items-center justify-center h-64">
        <p data-testid="tournament-not-found" className="text-fg3">
          {t.history.notFound}
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6 print:hidden">
        <Link
          to="/history"
          className="text-sm text-brand hover:text-brand/80 hover:underline"
        >
          {t.history.back}
        </Link>
        <div className="flex items-center gap-2">
          <PrintButton />
          <ShareButton tournament={tournament} source="detail" />
        </div>
      </div>
      <RoundsPanel tournament={tournament} showPrint={false} />
    </div>
  )
}

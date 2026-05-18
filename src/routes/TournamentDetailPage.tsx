import { useParams, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import type { Tournament } from '../types'
import { useHistory } from '../hooks/useHistory'
import { RoundsPanel } from '../components/rounds/RoundsPanel'
import { PrintButton } from '../components/ui/PrintButton'

export function TournamentDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { getById } = useHistory()
  const [tournament, setTournament] = useState<Tournament | null>(null)

  useEffect(() => {
    if (id) setTournament(getById(id) ?? null)
  }, [id])

  if (!tournament) {
    return (
      <div className="flex items-center justify-center h-64">
        <p data-testid="tournament-not-found" className="text-gray-400">
          Torneio não encontrado.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-4 lg:p-8">
      <div className="flex items-center justify-between mb-6 print:hidden">
        <Link
          to="/history"
          className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
        >
          ← Histórico
        </Link>
        <PrintButton />
      </div>
      <RoundsPanel tournament={tournament} />
    </div>
  )
}

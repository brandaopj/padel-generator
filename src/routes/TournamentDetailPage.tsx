import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Save } from 'lucide-react'
import type { Tournament } from '../types'
import { useHistory } from '../hooks/useHistory'
import { useLanguage } from '../context/LanguageContext'
import { useToast } from '../context/ToastContext'
import { RoundsPanel } from '../components/rounds/RoundsPanel'
import { ShareButton } from '../components/ui/ShareButton'
import { PrintButton } from '../components/ui/PrintButton'

export function TournamentDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { getById, update } = useHistory()
  const { t } = useLanguage()
  const { showToast } = useToast()
  const [tournament, setTournament] = useState<Tournament | null>(() =>
    id ? (getById(id) ?? null) : null
  )
  const [hasChanges, setHasChanges] = useState(false)

  if (!tournament) {
    return (
      <div className="flex items-center justify-center h-64">
        <p data-testid="tournament-not-found" className="text-fg3">
          {t.history.notFound}
        </p>
      </div>
    )
  }

  function handleScoreChange(roundIdx: number, matchIdx: number, scores: [number | null, number | null]) {
    if (!tournament) return
    const rounds = tournament.rounds.map((round, ri) =>
      ri !== roundIdx ? round : {
        ...round,
        matches: round.matches.map((match, mi) =>
          mi !== matchIdx ? match : { ...match, scores }
        ),
      }
    )
    setTournament({ ...tournament, rounds })
    setHasChanges(true)
  }

  function handleEditCourtName(court: number, name: string) {
    if (!tournament) return
    const updated = { ...tournament, courtNames: { ...tournament.courtNames, [court]: name } }
    setTournament(updated)
    update(updated)
  }

  function handleSave() {
    if (!tournament) return
    update(tournament)
    setHasChanges(false)
    showToast('success', t.toast.scoresSaved, { duration: 2500 })
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
          {hasChanges && (
            <button
              type="button"
              data-testid="save-scores-button"
              onClick={handleSave}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-brand text-brand-on rounded-md text-sm font-medium hover:bg-brand/90 transition-colors"
            >
              <Save className="w-4 h-4" />
              {t.history.saveScores}
            </button>
          )}
          <PrintButton />
          <ShareButton tournament={tournament} source="detail" />
        </div>
      </div>
      <RoundsPanel
        tournament={tournament}
        showPrint={false}
        onScoreChange={handleScoreChange}
        onEditCourtName={handleEditCourtName}
      />
    </div>
  )
}

import type { Tournament } from '../types'
import type { ToastVariant } from '../context/ToastContext'

export function formatTournamentText(t: Tournament): string {
  const title = t.clubName || 'Torneio de Padel'
  const roundCount = t.rounds.length
  const matchCount = t.rounds.reduce((sum, r) => sum + r.matches.length, 0)

  const lines: string[] = [
    `🎾 ${title}`,
    `${roundCount} ronda${roundCount !== 1 ? 's' : ''} · ${matchCount} jogo${matchCount !== 1 ? 's' : ''}`,
    '',
  ]

  for (const round of t.rounds) {
    lines.push(`🏆 Ronda ${round.number}`)
    for (const match of round.matches) {
      const court = t.courtNames?.[match.court] ?? `Campo ${match.court}`
      lines.push(`${court}: ${match.pair1[0]} & ${match.pair1[1]} vs ${match.pair2[0]} & ${match.pair2[1]}`)
    }
    lines.push('')
  }

  return lines.join('\n').trim()
}

type ShowToast = (variant: ToastVariant, message: string, opts?: { duration?: number }) => void

export async function shareTournament(t: Tournament, showToast: ShowToast): Promise<void> {
  const text = formatTournamentText(t)
  const title = t.clubName || 'Torneio de Padel'

  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({ title, text })
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        showToast('error', 'Não foi possível partilhar')
      }
    }
  } else {
    try {
      await navigator.clipboard.writeText(text)
      showToast('success', 'Torneio copiado para a área de transferência', { duration: 3000 })
    } catch {
      showToast('error', 'Não foi possível copiar o torneio')
    }
  }
}

import type { Tournament } from '../types'
import type { ToastVariant } from '../context/ToastContext'

export function formatTournamentText(t: Tournament): string {
  const title = t.clubName || 'Padel'
  const roundCount = t.rounds.length
  const matchCount = t.rounds.reduce((sum, r) => sum + r.matches.length, 0)

  const lines: string[] = [
    `🎾 ${title}`,
    `${roundCount} round${roundCount !== 1 ? 's' : ''} · ${matchCount} match${matchCount !== 1 ? 'es' : ''}`,
    '',
  ]

  for (const round of t.rounds) {
    lines.push(`🏆 Round ${round.number}`)
    for (const match of round.matches) {
      const court = t.courtNames?.[match.court] ?? `Court ${match.court}`
      lines.push(`${court}: ${match.pair1[0]} & ${match.pair1[1]} vs ${match.pair2[0]} & ${match.pair2[1]}`)
    }
    lines.push('')
  }

  return lines.join('\n').trim()
}

type ShowToast = (variant: ToastVariant, message: string, opts?: { duration?: number }) => void

type ShareMessages = {
  shareCopied: string
  shareError: string
  copyError: string
}

export async function shareTournament(t: Tournament, showToast: ShowToast, msgs: ShareMessages): Promise<void> {
  const text = formatTournamentText(t)
  const title = t.clubName || 'Padel Tournament'

  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({ title, text })
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        showToast('error', msgs.shareError)
      }
    }
  } else {
    try {
      await navigator.clipboard.writeText(text)
      showToast('success', msgs.shareCopied, { duration: 3000 })
    } catch {
      showToast('error', msgs.copyError)
    }
  }
}

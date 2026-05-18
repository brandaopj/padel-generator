import { describe, it, expect, vi, beforeEach } from 'vitest'
import { formatTournamentText, shareTournament } from '../../src/utils/shareTournament'
import type { Tournament } from '../../src/types'

const base: Tournament = {
  id: 'test-id',
  date: '2026-04-21T21:30:00.000Z',
  clubName: 'Summer Cup',
  mode: 'fixed-pairs',
  courts: 2,
  players: [],
  pairs: [['Ana', 'Bruno'], ['Carlos', 'Diana']],
  rounds: [
    {
      number: 1,
      matches: [
        { pair1: ['Ana', 'Bruno'], pair2: ['Carlos', 'Diana'], court: 1 },
      ],
    },
  ],
}

describe('formatTournamentText', () => {
  it('includes the tournament name', () => {
    const text = formatTournamentText(base)
    expect(text).toContain('Summer Cup')
  })

  it('includes round and match counts', () => {
    const text = formatTournamentText(base)
    expect(text).toContain('1 round')
    expect(text).toContain('1 match')
  })

  it('includes player names', () => {
    const text = formatTournamentText(base)
    expect(text).toContain('Ana')
    expect(text).toContain('Bruno')
    expect(text).toContain('Carlos')
    expect(text).toContain('Diana')
  })

  it('uses custom court name when provided', () => {
    const t = { ...base, courtNames: { 1: 'Pista Central' } }
    const text = formatTournamentText(t)
    expect(text).toContain('Pista Central')
  })

  it('falls back to Court N when no court name', () => {
    const text = formatTournamentText(base)
    expect(text).toContain('Court 1')
  })

  it('uses clubName fallback when name is empty', () => {
    const t = { ...base, clubName: '' }
    const text = formatTournamentText(t)
    expect(text).toContain('🎾 Padel')
  })

  it('handles multiple rounds', () => {
    const t = {
      ...base,
      rounds: [
        { number: 1, matches: [{ pair1: ['A', 'B'] as [string,string], pair2: ['C', 'D'] as [string,string], court: 1 }] },
        { number: 2, matches: [{ pair1: ['A', 'C'] as [string,string], pair2: ['B', 'D'] as [string,string], court: 1 }] },
      ],
    }
    const text = formatTournamentText(t)
    expect(text).toContain('Round 1')
    expect(text).toContain('Round 2')
    expect(text).toContain('2 rounds')
    expect(text).toContain('2 matches')
  })
})

const msgs = {
  shareCopied: 'Copiado!',
  shareError: 'Erro ao partilhar',
  copyError: 'Erro ao copiar',
}

describe('shareTournament — clipboard fallback', () => {
  beforeEach(() => {
    Object.defineProperty(navigator, 'share', { value: undefined, configurable: true })
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
      configurable: true,
    })
  })

  it('copies text to clipboard and shows success toast', async () => {
    const showToast = vi.fn()
    await shareTournament(base, showToast, msgs)
    expect(navigator.clipboard.writeText).toHaveBeenCalled()
    expect(showToast).toHaveBeenCalledWith('success', 'Copiado!', { duration: 3000 })
  })

  it('shows error toast when clipboard write fails', async () => {
    vi.mocked(navigator.clipboard.writeText).mockRejectedValueOnce(new Error('denied'))
    const showToast = vi.fn()
    await shareTournament(base, showToast, msgs)
    expect(showToast).toHaveBeenCalledWith('error', 'Erro ao copiar')
  })
})

describe('shareTournament — Web Share API', () => {
  beforeEach(() => {
    Object.defineProperty(navigator, 'share', {
      value: vi.fn().mockResolvedValue(undefined),
      configurable: true,
    })
  })

  it('calls navigator.share when available', async () => {
    const showToast = vi.fn()
    await shareTournament(base, showToast, msgs)
    expect(navigator.share).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Summer Cup' })
    )
    expect(showToast).not.toHaveBeenCalled()
  })

  it('shows error toast on share failure (non-abort)', async () => {
    const err = new Error('failed')
    err.name = 'NotAllowedError'
    vi.mocked(navigator.share).mockRejectedValueOnce(err)
    const showToast = vi.fn()
    await shareTournament(base, showToast, msgs)
    expect(showToast).toHaveBeenCalledWith('error', 'Erro ao partilhar')
  })

  it('does not show error toast when user aborts share', async () => {
    const err = new Error('aborted')
    err.name = 'AbortError'
    vi.mocked(navigator.share).mockRejectedValueOnce(err)
    const showToast = vi.fn()
    await shareTournament(base, showToast, msgs)
    expect(showToast).not.toHaveBeenCalled()
  })
})

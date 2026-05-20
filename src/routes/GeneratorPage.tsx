import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useBlocker } from 'react-router-dom'
import { Clock } from 'lucide-react'
import { AppContext } from '../context/AppContext'
import { useToast } from '../context/ToastContext'
import { useLanguage } from '../context/LanguageContext'
import { ConfirmModal } from '../components/ui/ConfirmModal'
import { ModeSelector } from '../components/generator/ModeSelector'
import { PlayerInput } from '../components/generator/PlayerInput'
import { PairInput } from '../components/generator/PairInput'
import { SeededInput } from '../components/generator/SeededInput'
import { ValidationBanner } from '../components/generator/ValidationBanner'
import { EmptyState } from '../components/generator/EmptyState'
import { RoundsPanel } from '../components/rounds/RoundsPanel'
import { validate } from '../utils/validation'
import { generateTournament } from '../utils/gameLogic'
import { useHistory } from '../hooks/useHistory'
import { analytics } from '../analytics'

const EXAMPLE_PLAYERS = [
  'Ana Costa', 'Bruno Silva', 'Carlos Mota', 'Diana Ferreira',
  'Eduardo Pinto', 'Filipa Santos', 'Gonçalo Lima', 'Helena Cruz',
]

export function GeneratorPage() {
  const { state, dispatch } = useContext(AppContext)
  const { save, update } = useHistory()
  const { showToast } = useToast()
  const { t } = useLanguage()
  const { errors, warnings } = validate(state, t.validation)
  const [isStale, setIsStale] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [exampleKey, setExampleKey] = useState(0)
  const [mobileTab, setMobileTab] = useState<'config' | 'torneio'>('config')
  const hasGeneratedRef = useRef(false)
  const formRef = useRef<HTMLDivElement>(null)
  const roundsPanelRef = useRef<HTMLDivElement>(null)

  const blocker = useBlocker(isStale && state.generated !== null)

  const hasInputs =
    (state.mode === 'regular' && state.players.length > 0) ||
    (state.mode === 'fixed-pairs' && state.pairs.length > 0) ||
    (state.mode === 'seeded' && (state.tableA.length > 0 || state.tableB.length > 0))

  const totalPossibleRounds = useMemo(() => {
    let pairCount: number
    if (state.mode === 'regular') pairCount = Math.floor(state.players.length / 2)
    else if (state.mode === 'fixed-pairs') pairCount = state.pairs.length
    else pairCount = Math.min(state.tableA.length, state.tableB.length)
    if (pairCount < 2) return 0
    const n = pairCount % 2 === 0 ? pairCount : pairCount + 1
    return n - 1
  }, [state.mode, state.players.length, state.pairs.length, state.tableA.length, state.tableB.length])

  useEffect(() => {
    if (hasGeneratedRef.current) {
      setIsStale(true)
    }
  }, [state.players, state.pairs, state.tableA, state.tableB, state.mode, state.clubName])

  function handleEditCourtName(court: number, name: string) {
    if (!state.generated) return
    dispatch({ type: 'SET_COURT_NAME', payload: { court, name } })
    const updated = {
      ...state.generated,
      courtNames: { ...state.generated.courtNames, [court]: name },
    }
    update(updated)
    showToast('info', t.toast.courtUpdated, { duration: 2000 })
  }

  function handleLoadExample() {
    dispatch({ type: 'SET_MODE', payload: 'regular' })
    dispatch({ type: 'SET_PLAYERS', payload: EXAMPLE_PLAYERS })
    setExampleKey(k => k + 1)
    analytics.exampleLoaded()
  }

  function handleGenerate() {
    if (isGenerating) return
    setIsGenerating(true)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        try {
          const tournament = generateTournament({
            mode: state.mode,
            clubName: state.clubName,
            courts: state.courts,
            players: state.players,
            pairs: state.pairs,
            tableA: state.tableA,
            tableB: state.tableB,
            maxRounds: state.maxRounds,
          })
          dispatch({ type: 'SET_GENERATED', payload: tournament })
          save(tournament)
          hasGeneratedRef.current = true
          setIsStale(false)
          setMobileTab('torneio')
          const roundCount = tournament.rounds.length
          const matchCount = tournament.rounds.reduce((sum, r) => sum + r.matches.length, 0)
          showToast('success', t.toast.generated(roundCount, matchCount))
          analytics.tournamentGenerated({ mode: state.mode, rounds: roundCount, matches: matchCount, courts: tournament.courts })
        } finally {
          setIsGenerating(false)
        }
      })
    })
  }

  // Shared form fields (used in both mobile and sidebar)
  const formFields = (
    <>
      <div>
        <label
          htmlFor="club-name"
          className="block text-sm font-medium text-fg2 mb-1"
        >
          {t.generator.nameLabel}
        </label>
        <input
          id="club-name"
          data-testid="club-name-input"
          type="text"
          value={state.clubName}
          onChange={e => dispatch({ type: 'SET_CLUB_NAME', payload: e.target.value })}
          placeholder={t.generator.namePlaceholder}
          className="w-full rounded-md border border-bordermd px-3 py-2 text-sm bg-surface text-fg focus:outline-none focus:ring-2 focus:ring-brand"
        />
      </div>

      <ModeSelector
        value={state.mode}
        onChange={mode => { dispatch({ type: 'SET_MODE', payload: mode }); analytics.modeSelected(mode) }}
      />

      {state.mode === 'regular' && (
        <PlayerInput
          key={exampleKey}
          players={state.players}
          onChange={players => dispatch({ type: 'SET_PLAYERS', payload: players })}
        />
      )}

      {state.mode === 'fixed-pairs' && (
        <PairInput
          pairs={state.pairs}
          onChange={pairs => dispatch({ type: 'SET_PAIRS', payload: pairs })}
        />
      )}

      {state.mode === 'seeded' && (
        <SeededInput
          tableA={state.tableA}
          tableB={state.tableB}
          onChangeA={tableA => dispatch({ type: 'SET_TABLE_A', payload: tableA })}
          onChangeB={tableB => dispatch({ type: 'SET_TABLE_B', payload: tableB })}
        />
      )}

      {hasInputs && (
        <p className="text-xs text-fg3">
          {t.generator.courtsAuto(state.courts)}
        </p>
      )}

      {hasInputs && totalPossibleRounds > 1 && (
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label htmlFor="max-rounds" className="text-sm font-medium text-fg2">
              {t.generator.maxRoundsLabel}
            </label>
            <span className="text-sm text-fg3 tabular-nums">
              <span className="font-medium text-fg2">{state.maxRounds ?? totalPossibleRounds}</span>
              {' '}
              {state.maxRounds == null || state.maxRounds >= totalPossibleRounds
                ? t.generator.allRounds
                : t.generator.maxRoundsOf(totalPossibleRounds)}
            </span>
          </div>
          <input
            id="max-rounds"
            type="range"
            min={1}
            max={totalPossibleRounds}
            value={state.maxRounds ?? totalPossibleRounds}
            onChange={e => {
              const v = parseInt(e.target.value, 10)
              dispatch({ type: 'SET_MAX_ROUNDS', payload: v >= totalPossibleRounds ? null : v })
            }}
            className="w-full accent-brand"
          />
        </div>
      )}

      {hasInputs && <ValidationBanner errors={errors} warnings={warnings} />}

      {isStale && hasInputs && (
        <div className="flex items-start gap-2 rounded-md bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 px-3 py-2 text-xs text-amber-700 dark:text-amber-400">
          <span aria-hidden="true" className="shrink-0">↻</span>
          <span>{t.generator.stale}</span>
        </div>
      )}
    </>
  )

  // Shared generate button
  const generateButton = (
    <button
      data-testid="generate-button"
      onClick={handleGenerate}
      disabled={errors.length > 0 || isGenerating}
      className="w-full py-3 px-6 bg-brand text-brand-on rounded-lg text-sm font-semibold tracking-wide hover:bg-brand/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
    >
      {isGenerating ? (
        <>
          <svg className="w-4 h-4 animate-spin shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          {t.generator.generating}
        </>
      ) : state.generated ? (
        <>
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
          </svg>
          {t.generator.regenerate}
        </>
      ) : (
        t.generator.generate
      )}
    </button>
  )

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8 print:max-w-none print:p-0 pb-[120px] md:pb-8">

      {/* Single layout — CSS show/hide controls mobile tab switching; md+ is always 2-col */}
      <div className="md:grid md:grid-cols-[340px,1fr] md:gap-6 lg:gap-8 md:items-start">

        {/* Form sidebar — hidden on mobile when viewing torneio tab */}
        <aside
          ref={formRef}
          className={`space-y-5 print:hidden md:sticky md:top-24 ${state.generated && mobileTab === 'torneio' ? 'hidden md:block' : 'block'}`}
        >
          {formFields}
          {/* Generate button — sticky above tab bar on mobile; normal in md+ sidebar */}
          <div className={`sticky z-[15] -mx-4 px-4 pb-2 bg-canvas md:static md:mx-0 md:px-0 md:pb-0 md:bg-transparent ${state.generated ? 'bottom-[60px]' : 'bottom-0'}`}>
            {generateButton}
          </div>
        </aside>

        {/* Rounds panel — hidden on mobile when viewing config tab */}
        <div
          ref={roundsPanelRef}
          className={`min-w-0 ${!state.generated || mobileTab === 'config' ? 'hidden md:block' : 'block'}`}
        >
          {state.generated
            ? <RoundsPanel tournament={state.generated} onEditCourtName={handleEditCourtName} showShare />
            : <EmptyState onLoadExample={handleLoadExample} />
          }
        </div>
      </div>

      {blocker.state === 'blocked' && (
        <ConfirmModal
          title={t.generator.leaveGuardTitle}
          description={t.generator.leaveGuardDescription}
          confirmLabel={t.generator.leaveGuardConfirm}
          cancelLabel={t.generator.leaveGuardCancel}
          onConfirm={() => blocker.proceed()}
          onCancel={() => blocker.reset()}
        />
      )}

      {/* Mobile tab bar — only when a tournament has been generated, only on < md */}
      {state.generated && (
        <div className="fixed bottom-0 left-0 right-0 z-10 md:hidden print:hidden border-t border-border bg-surface/95 backdrop-blur-sm">
          <div className="flex">
            {/* History tab */}
            <Link
              to="/history"
              className="flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium text-fg2 hover:text-brand transition-colors"
            >
              <Clock className="w-4 h-4" />
              <span>{t.history.title}</span>
            </Link>
            <div className="w-px bg-border" aria-hidden="true" />
            {/* Config tab */}
            <button
              type="button"
              onClick={() => setMobileTab('config')}
              className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors ${mobileTab === 'config' ? 'text-brand' : 'text-fg2 hover:text-brand'}`}
            >
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
              </svg>
              <span>{t.generator.configTab}</span>
            </button>
            <div className="w-px bg-border" aria-hidden="true" />
            {/* Torneio tab */}
            <button
              type="button"
              onClick={() => setMobileTab('torneio')}
              className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors ${mobileTab === 'torneio' ? 'text-brand' : 'text-fg2 hover:text-brand'}`}
            >
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 1a.75.75 0 01.75.75v.5h4.5a.75.75 0 010 1.5h-.5v1.5a5.25 5.25 0 01-4 5.101V12h1.25a.75.75 0 010 1.5H8A.75.75 0 018 12h1.25v-1.649A5.25 5.25 0 015.25 5.25V3.75h-.5a.75.75 0 010-1.5h4.5v-.5A.75.75 0 0110 1zM6.75 3.75v1.5a3.75 3.75 0 007.5 0v-1.5h-7.5zM7 14.25a.75.75 0 000 1.5h6a.75.75 0 000-1.5H7z" clipRule="evenodd" />
              </svg>
              <span>{t.generator.resultsTab}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

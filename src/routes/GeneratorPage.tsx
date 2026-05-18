import { useContext, useEffect, useRef, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { useToast } from '../context/ToastContext'
import { useLanguage } from '../context/LanguageContext'
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
  const hasGeneratedRef = useRef(false)
  const roundsPanelRef = useRef<HTMLDivElement>(null)

  const hasInputs =
    (state.mode === 'regular' && state.players.length > 0) ||
    (state.mode === 'fixed-pairs' && state.pairs.length > 0) ||
    (state.mode === 'seeded' && (state.tableA.length > 0 || state.tableB.length > 0))

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
          })
          dispatch({ type: 'SET_GENERATED', payload: tournament })
          save(tournament)
          hasGeneratedRef.current = true
          setIsStale(false)
          const roundCount = tournament.rounds.length
          const matchCount = tournament.rounds.reduce((sum, r) => sum + r.matches.length, 0)
          showToast('success', t.toast.generated(roundCount, matchCount))
          setTimeout(() => {
            roundsPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
          }, 50)
        } finally {
          setIsGenerating(false)
        }
      })
    })
  }

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-8 print:max-w-none print:p-0">
      <div className="flex flex-col lg:flex-row gap-8 items-start print:block">

        {/* Form panel — sticky on desktop */}
        <div className="lg:w-96 shrink-0 print:hidden">
          <div className="lg:sticky lg:top-24 space-y-5">
            <div>
              <label
                htmlFor="club-name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
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
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <ModeSelector
              value={state.mode}
              onChange={mode => dispatch({ type: 'SET_MODE', payload: mode })}
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
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t.generator.courtsAuto(state.courts)}
              </p>
            )}

            {hasInputs && <ValidationBanner errors={errors} warnings={warnings} />}

            {isStale && hasInputs && (
              <div className="flex items-start gap-2 rounded-md bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 px-3 py-2 text-xs text-amber-700 dark:text-amber-400">
                <span aria-hidden="true" className="shrink-0">↻</span>
                <span>{t.generator.stale}</span>
              </div>
            )}

            <button
              data-testid="generate-button"
              onClick={handleGenerate}
              disabled={errors.length > 0 || isGenerating}
              className="w-full py-3 px-6 bg-blue-600 text-white rounded-lg text-sm font-semibold tracking-wide hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
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
          </div>
        </div>

        {/* Rounds panel — hidden on mobile when empty */}
        <div
          ref={roundsPanelRef}
          className={`flex-1 min-w-0${!state.generated ? ' hidden lg:block' : ''}`}
        >
          {state.generated
            ? <RoundsPanel tournament={state.generated} onEditCourtName={handleEditCourtName} />
            : <EmptyState onLoadExample={handleLoadExample} />
          }
        </div>

      </div>
    </div>
  )
}

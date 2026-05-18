import { useContext, useEffect, useRef, useState } from 'react'
import { AppContext } from '../context/AppContext'
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
  const { errors, warnings } = validate(state)
  const [showSuccess, setShowSuccess] = useState(false)
  const [isStale, setIsStale] = useState(false)
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
  }

  function handleLoadExample() {
    dispatch({ type: 'SET_MODE', payload: 'regular' })
    dispatch({ type: 'SET_PLAYERS', payload: EXAMPLE_PLAYERS })
    setExampleKey(k => k + 1)
  }

  function handleGenerate() {
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
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
    setTimeout(() => {
      roundsPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }, 50)
  }

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-8 print:max-w-none print:p-0">
      <div className="flex flex-col lg:flex-row gap-8 items-start">

        {/* Form panel — sticky on desktop */}
        <div className="lg:w-96 shrink-0 print:hidden">
          <div className="lg:sticky lg:top-24 space-y-5">
            <div>
              <label
                htmlFor="club-name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Nome do torneio
              </label>
              <input
                id="club-name"
                data-testid="club-name-input"
                type="text"
                value={state.clubName}
                onChange={e => dispatch({ type: 'SET_CLUB_NAME', payload: e.target.value })}
                placeholder="Ex: Torneio de Verão 2026"
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
                Campos calculados automaticamente:{' '}
                <span className="font-medium text-gray-700 dark:text-gray-300">{state.courts}</span>
              </p>
            )}

            {hasInputs && <ValidationBanner errors={errors} warnings={warnings} />}

            {isStale && hasInputs && (
              <div className="flex items-start gap-2 rounded-md bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 px-3 py-2 text-xs text-amber-700 dark:text-amber-400">
                <span aria-hidden="true" className="shrink-0">↻</span>
                <span>Os resultados podem não refletir as alterações atuais.</span>
              </div>
            )}

            {showSuccess && (
              <div
                role="status"
                aria-live="polite"
                data-testid="success-banner"
                className="flex items-center gap-2 rounded-lg bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 px-4 py-3 text-sm text-green-700 dark:text-green-300"
              >
                <span aria-hidden="true">✓</span>
                <span>Torneio gerado com sucesso!</span>
              </div>
            )}

            <button
              data-testid="generate-button"
              onClick={handleGenerate}
              disabled={errors.length > 0}
              className="w-full py-3 px-6 bg-blue-600 text-white rounded-lg text-sm font-semibold tracking-wide hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {state.generated ? 'Regenerar Torneio' : 'Gerar Torneio'}
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

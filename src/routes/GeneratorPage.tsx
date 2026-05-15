import { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import { ModeSelector } from '../components/generator/ModeSelector'
import { PlayerInput } from '../components/generator/PlayerInput'
import { PairInput } from '../components/generator/PairInput'
import { SeededInput } from '../components/generator/SeededInput'
import { ValidationBanner } from '../components/generator/ValidationBanner'
import { RoundsPanel } from '../components/rounds/RoundsPanel'
import { PrintButton } from '../components/ui/PrintButton'
import { validate } from '../utils/validation'
import { generateTournament } from '../utils/gameLogic'
import { useHistory } from '../hooks/useHistory'

export function GeneratorPage() {
  const { state, dispatch } = useContext(AppContext)
  const { save } = useHistory()
  const { errors, warnings } = validate(state)

  const hasInputs =
    state.players.length > 0 ||
    state.pairs.length > 0 ||
    state.tableA.length > 0 ||
    state.tableB.length > 0

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
  }

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-8">
      <div className="flex flex-col lg:flex-row gap-8 items-start">

        {/* Form panel */}
        <div className="lg:w-96 shrink-0 space-y-5 relative z-10">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nome do clube
            </label>
            <input
              data-testid="club-name-input"
              type="text"
              value={state.clubName}
              onChange={e => dispatch({ type: 'SET_CLUB_NAME', payload: e.target.value })}
              placeholder="Ex: Clube de Padel Lisboa"
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <ModeSelector
            value={state.mode}
            onChange={mode => dispatch({ type: 'SET_MODE', payload: mode })}
          />

{state.mode === 'regular' && (
            <PlayerInput
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

          {hasInputs && <ValidationBanner errors={errors} warnings={warnings} />}

          <button
            data-testid="generate-button"
            onClick={handleGenerate}
            disabled={errors.length > 0}
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Gerar Torneio
          </button>
        </div>

        {/* Rounds panel */}
        <div className="flex-1 min-w-0">
          {state.generated && (
            <div className="flex justify-end mb-4 print:hidden">
              <PrintButton />
            </div>
          )}
          <RoundsPanel tournament={state.generated} />
        </div>

      </div>
    </div>
  )
}

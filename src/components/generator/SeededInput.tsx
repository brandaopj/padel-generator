import { useState } from 'react'

type TableProps = {
  label: string
  players: string[]
  testPrefix: string
  onAdd: (name: string) => void
  onRemove: (index: number) => void
}

function TableInput({ label, players, testPrefix, onAdd, onRemove }: TableProps) {
  const [name, setName] = useState('')

  function handleAdd() {
    const trimmed = name.trim()
    if (!trimmed) return
    onAdd(trimmed)
    setName('')
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label} ({players.length})
      </label>
      <div className="flex gap-1">
        <input
          data-testid={`${testPrefix}-input`}
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          placeholder="Nome"
          className="flex-1 min-w-0 rounded-md border border-gray-300 dark:border-gray-600 px-2 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          data-testid={`${testPrefix}-add`}
          onClick={handleAdd}
          className="px-2 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors"
        >
          +
        </button>
      </div>
      <ul className="space-y-1">
        {players.map((player, i) => (
          <li
            key={i}
            className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded px-2 py-1 text-sm"
          >
            <span data-testid={`${testPrefix}-${i}`} className="text-gray-800 dark:text-gray-100 truncate">
              {player}
            </span>
            <button
              data-testid={`${testPrefix}-remove-${i}`}
              onClick={() => onRemove(i)}
              className="text-red-500 hover:text-red-700 ml-1 shrink-0 leading-none"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

type Props = {
  tableA: string[]
  tableB: string[]
  onAddA: (name: string) => void
  onRemoveA: (index: number) => void
  onAddB: (name: string) => void
  onRemoveB: (index: number) => void
}

export function SeededInput({ tableA, tableB, onAddA, onRemoveA, onAddB, onRemoveB }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <TableInput label="Tabela A" players={tableA} testPrefix="table-a" onAdd={onAddA} onRemove={onRemoveA} />
      <TableInput label="Tabela B" players={tableB} testPrefix="table-b" onAdd={onAddB} onRemove={onRemoveB} />
    </div>
  )
}

import { useState } from 'react'

type Props = {
  players: string[]
  onAdd: (name: string) => void
  onRemove: (index: number) => void
}

export function PlayerInput({ players, onAdd, onRemove }: Props) {
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
        Jogadores ({players.length})
      </label>
      <div className="flex gap-2">
        <input
          data-testid="player-input"
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          placeholder="Nome do jogador"
          className="flex-1 rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          data-testid="player-add"
          onClick={handleAdd}
          className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors"
        >
          Adicionar
        </button>
      </div>
      <ul className="space-y-1">
        {players.map((player, i) => (
          <li
            key={i}
            className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded px-3 py-1.5 text-sm"
          >
            <span data-testid={`player-${i}`} className="text-gray-800 dark:text-gray-100">
              {player}
            </span>
            <button
              data-testid={`player-remove-${i}`}
              onClick={() => onRemove(i)}
              aria-label={`Remover ${player}`}
              className="text-red-500 hover:text-red-700 ml-2 leading-none"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

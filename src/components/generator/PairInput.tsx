import { useState } from 'react'
import type { Pair } from '../../types'

type Props = {
  pairs: Pair[]
  onAdd: (pair: Pair) => void
  onRemove: (index: number) => void
}

export function PairInput({ pairs, onAdd, onRemove }: Props) {
  const [p1, setP1] = useState('')
  const [p2, setP2] = useState('')

  function handleAdd() {
    const t1 = p1.trim()
    const t2 = p2.trim()
    if (!t1 || !t2) return
    onAdd([t1, t2])
    setP1('')
    setP2('')
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Duplas ({pairs.length})
      </label>
      <div className="flex gap-2">
        <input
          data-testid="pair-input-1"
          type="text"
          value={p1}
          onChange={e => setP1(e.target.value)}
          placeholder="Jogador 1"
          className="flex-1 rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          data-testid="pair-input-2"
          type="text"
          value={p2}
          onChange={e => setP2(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          placeholder="Jogador 2"
          className="flex-1 rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          data-testid="pair-add"
          onClick={handleAdd}
          className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors"
        >
          +
        </button>
      </div>
      <ul className="space-y-1">
        {pairs.map((pair, i) => (
          <li
            key={i}
            className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded px-3 py-1.5 text-sm"
          >
            <span data-testid={`pair-${i}`} className="text-gray-800 dark:text-gray-100">
              {pair[0]} / {pair[1]}
            </span>
            <button
              data-testid={`pair-remove-${i}`}
              onClick={() => onRemove(i)}
              aria-label={`Remover dupla ${pair[0]} / ${pair[1]}`}
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

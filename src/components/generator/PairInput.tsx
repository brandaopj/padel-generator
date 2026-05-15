import { useState } from 'react'
import type { Pair } from '../../types'

type Props = {
  pairs: Pair[]
  onChange: (pairs: Pair[]) => void
}

function parsePairs(text: string): Pair[] {
  return text
    .split('\n')
    .map(line => {
      const parts = line.split('/')
      if (parts.length !== 2) return null
      const [p1, p2] = parts.map(p => p.trim())
      if (!p1 || !p2) return null
      return [p1, p2] as Pair
    })
    .filter((p): p is Pair => p !== null)
}

export function PairInput({ pairs, onChange }: Props) {
  const [raw, setRaw] = useState(() => pairs.map(p => `${p[0]} / ${p[1]}`).join('\n'))

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const text = e.target.value
    setRaw(text)
    onChange(parsePairs(text))
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Duplas ({pairs.length})
      </label>
      <textarea
        data-testid="pair-input"
        value={raw}
        onChange={handleChange}
        rows={6}
        placeholder={'Uma dupla por linha\nEx:\nAna / Bruno\nCarlos / Diana'}
        className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
      />
      <p className="text-xs text-gray-400 dark:text-gray-500">Formato: Jogador1 / Jogador2</p>
    </div>
  )
}

import { useState } from 'react'

type Props = {
  players: string[]
  onChange: (players: string[]) => void
}

function parseNames(text: string): string[] {
  return text.split('\n').map(n => n.trim()).filter(Boolean)
}

export function PlayerInput({ players, onChange }: Props) {
  const [raw, setRaw] = useState(() => players.join('\n'))

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const text = e.target.value
    setRaw(text)
    onChange(parseNames(text))
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Jogadores ({players.length})
      </label>
      <textarea
        data-testid="player-input"
        value={raw}
        onChange={handleChange}
        rows={6}
        placeholder={'Um nome por linha\nEx:\nJoão\nMaria\nPedro\nAna'}
        className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
      />
    </div>
  )
}

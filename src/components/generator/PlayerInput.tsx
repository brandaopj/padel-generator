import { useEffect, useRef, useState } from 'react'
import { ClearButton } from '../ui/ClearButton'
import { useLanguage } from '../../context/LanguageContext'

type Props = {
  players: string[]
  onChange: (players: string[]) => void
}

function parseNames(text: string): string[] {
  return text.split('\n').map(n => n.trim()).filter(Boolean)
}

export function PlayerInput({ players, onChange }: Props) {
  const { t } = useLanguage()
  const [raw, setRaw] = useState(() => players.join('\n'))
  const prevLenRef = useRef(players.length)

  useEffect(() => {
    if (players.length === 0 && prevLenRef.current > 0) setRaw('')
    prevLenRef.current = players.length
  }, [players])

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const text = e.target.value
    setRaw(text)
    onChange(parseNames(text))
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label
          htmlFor="player-textarea"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {t.playerInput.label(players.length)}
        </label>
        {players.length > 0 && (
          <ClearButton
            label={t.playerInput.clearAll}
            modalTitle={t.confirm.clearPlayers.title}
            modalDescription={t.confirm.clearPlayers.description}
            cancelLabel={t.confirm.cancel}
            onConfirm={() => { setRaw(''); onChange([]) }}
          />
        )}
      </div>
      <textarea
        id="player-textarea"
        data-testid="player-input"
        value={raw}
        onChange={handleChange}
        rows={6}
        placeholder={t.playerInput.placeholder}
        className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-base sm:text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y min-h-36 sm:min-h-44 lg:min-h-52"
      />
    </div>
  )
}

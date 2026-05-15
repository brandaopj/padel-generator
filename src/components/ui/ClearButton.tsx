import { useState } from 'react'

type Props = { label: string; onConfirm: () => void }

export function ClearButton({ label, onConfirm }: Props) {
  const [confirming, setConfirming] = useState(false)

  if (confirming) {
    return (
      <span className="flex items-center gap-1 text-xs">
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="px-2 py-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={() => { onConfirm(); setConfirming(false) }}
          className="px-2 py-1 text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 font-medium transition-colors"
        >
          Apagar
        </button>
      </span>
    )
  }

  return (
    <button
      type="button"
      onClick={() => setConfirming(true)}
      className="px-2 py-1 text-xs text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors"
    >
      {label}
    </button>
  )
}

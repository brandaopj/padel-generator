import { useState } from 'react'

function TrashIcon() {
  return (
    <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
        clipRule="evenodd"
      />
    </svg>
  )
}

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
          className="flex items-center gap-1 px-2 py-1 text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 font-medium transition-colors"
        >
          <TrashIcon />
          Apagar
        </button>
      </span>
    )
  }

  return (
    <button
      type="button"
      onClick={() => setConfirming(true)}
      className="flex items-center gap-1 px-2 py-1 text-xs text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors"
    >
      <TrashIcon />
      {label}
    </button>
  )
}

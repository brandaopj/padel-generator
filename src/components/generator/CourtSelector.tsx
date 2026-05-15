type Props = { value: number; onChange: (courts: number) => void }

export function CourtSelector({ value, onChange }: Props) {
  return (
    <div className="flex items-center gap-3">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Campos</label>
      <div className="flex items-center gap-2">
        <button
          data-testid="courts-decrement"
          onClick={() => onChange(Math.max(1, value - 1))}
          disabled={value <= 1}
          className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center text-lg disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          −
        </button>
        <span data-testid="courts-value" className="w-8 text-center font-semibold text-gray-800 dark:text-gray-100">
          {value}
        </span>
        <button
          data-testid="courts-increment"
          onClick={() => onChange(value + 1)}
          className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center text-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          +
        </button>
      </div>
    </div>
  )
}

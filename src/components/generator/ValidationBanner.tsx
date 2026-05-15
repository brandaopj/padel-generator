type Props = {
  errors: string[]
  warnings: string[]
}

export function ValidationBanner({ errors, warnings }: Props) {
  if (!errors.length && !warnings.length) return null

  return (
    <div role="alert" aria-live="polite" className="space-y-2">
      {errors.map((err, i) => (
        <div
          key={i}
          data-testid="validation-error"
          className="flex items-start gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md px-3 py-2 text-sm text-red-700 dark:text-red-400"
        >
          <span aria-hidden="true" className="shrink-0">⚠</span>
          <span>{err}</span>
        </div>
      ))}
      {warnings.map((warn, i) => (
        <div
          key={i}
          data-testid="validation-warning"
          className="flex items-start gap-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md px-3 py-2 text-sm text-yellow-700 dark:text-yellow-400"
        >
          <span aria-hidden="true" className="shrink-0">ℹ</span>
          <span>{warn}</span>
        </div>
      ))}
    </div>
  )
}

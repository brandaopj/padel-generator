type Props = { dark: boolean; onToggle: () => void }

export function DarkModeToggle({ dark, onToggle }: Props) {
  return (
    <button
      data-testid="dark-mode-toggle"
      onClick={onToggle}
      aria-label={dark ? 'Activar modo claro' : 'Activar modo escuro'}
      className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
    >
      {dark ? '☀️' : '🌙'}
    </button>
  )
}

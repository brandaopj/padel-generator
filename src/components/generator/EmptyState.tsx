type Props = { onLoadExample: () => void }

export function EmptyState({ onLoadExample }: Props) {
  return (
    <div
      data-testid="rounds-empty"
      className="flex flex-col items-center justify-center h-full min-h-[360px] gap-6 py-12 text-center"
    >
      <svg
        className="w-20 h-20 text-gray-200 dark:text-gray-700"
        viewBox="0 0 80 96"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <ellipse cx="40" cy="36" rx="26" ry="30" stroke="currentColor" strokeWidth="3.5" />
        <path d="M34 64 L34 88 Q34 92 40 92 Q46 92 46 88 L46 64 Z" fill="currentColor" opacity="0.4" />
        <line x1="16" y1="24" x2="64" y2="24" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
        <line x1="14" y1="36" x2="66" y2="36" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
        <line x1="16" y1="48" x2="64" y2="48" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
        <line x1="28" y1="8" x2="28" y2="64" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
        <line x1="40" y1="6" x2="40" y2="66" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
        <line x1="52" y1="8" x2="52" y2="64" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
      </svg>

      <div className="space-y-1">
        <p className="text-base font-medium text-gray-500 dark:text-gray-400">
          Os teus jogos vão aparecer aqui
        </p>
        <p className="text-sm text-gray-400 dark:text-gray-500">
          Preenche o formulário e clica em Gerar Torneio
        </p>
      </div>

      <button
        type="button"
        onClick={onLoadExample}
        className="px-4 py-2 text-sm text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
      >
        Carregar Exemplo (8 Jogadores)
      </button>
    </div>
  )
}

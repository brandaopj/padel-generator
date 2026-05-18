import { useEffect } from 'react'

type Props = { onClose: () => void }

const MODES = [
  {
    label: 'Modo Regular',
    description:
      'Os jogadores são introduzidos individualmente na lista. O algoritmo sorteia pares completamente aleatórios a cada ronda, garantindo que jogas com parceiros e adversários diferentes ao longo do torneio (formato americano/social).',
  },
  {
    label: 'Duplas Fixas (Fixed Pairs)',
    description:
      "Ideal para torneios onde as equipas já estão fechadas. Introduz os nomes no formato 'Jogador 1 / Jogador 2'. O algoritmo gera um calendário Round-Robin onde cada dupla defronta todas as outras duplas exatamente uma vez.",
  },
  {
    label: 'Semeado (Seeded)',
    description:
      'Para jogos equilibrados por nível. Introduzes duas listas independentes (Tabela A — Avançados; Tabela B — Iniciantes). O sistema faz um shuffle independente e emparelha a posição 1 da Tabela A com a posição 1 da Tabela B, criando duplas equilibradas de forma automática antes de gerar o calendário.',
  },
]

const TABLE_ROWS = [
  { mode: 'Regular', input: '1 Jogador por linha', ideal: 'Confraternizações / Sociais' },
  { mode: 'Fixed Duplas', input: 'Jogador 1 / Jogador 2', ideal: 'Torneios Competitivos' },
  { mode: 'Seeded', input: 'Duas tabelas (A e B)', ideal: 'Níveis Mistos (Prós + Amadores)' },
]

export function HowItWorksModal({ onClose }: Props) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in-up"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Como Funciona?"
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Como Funciona?</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Mode sections */}
        <div className="p-6 space-y-6">
          {MODES.map(mode => (
            <div key={mode.label}>
              <h3 className="flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-gray-100 mb-2">
                <svg className="w-3.5 h-3.5 text-blue-500 shrink-0" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
                  <path d="M6 0L7.5 4.5H12L8.25 7.25L9.75 12L6 9.25L2.25 12L3.75 7.25L0 4.5H4.5L6 0Z" />
                </svg>
                {mode.label}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{mode.description}</p>
            </div>
          ))}

          {/* Summary table */}
          <div className="mt-2 overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50 text-left">
                  <th className="px-4 py-2.5 font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">Modo</th>
                  <th className="px-4 py-2.5 font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">Entrada de Dados</th>
                  <th className="px-4 py-2.5 font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">Ideal Para</th>
                </tr>
              </thead>
              <tbody>
                {TABLE_ROWS.map((row, i) => (
                  <tr key={row.mode} className={i < TABLE_ROWS.length - 1 ? 'border-b border-gray-100 dark:border-gray-700' : ''}>
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">{row.mode}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{row.input}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{row.ideal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

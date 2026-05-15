import type { GameMode } from '../types'

export const MODES: { value: GameMode; label: string; description: string }[] = [
  {
    value: 'regular',
    label: 'Regular',
    description: 'Duplas sorteadas aleatoriamente a partir de uma lista de jogadores',
  },
  {
    value: 'fixed-pairs',
    label: 'Duplas Fixas',
    description: 'Duplas pré-definidas — os pares não mudam entre rondas',
  },
  {
    value: 'seeded',
    label: 'Cabeças de Série',
    description: 'Tabela A vs Tabela B — pareados por posição após baralhar cada tabela',
  },
]

export const MODE_LABELS: Record<GameMode, string> = Object.fromEntries(
  MODES.map(m => [m.value, m.label])
) as Record<GameMode, string>

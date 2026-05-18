import type { GameMode } from '../types'

export const MODES: {
  value: GameMode
  label: string
  description: string
  iconPath: string
  iconFillRule?: 'evenodd' | 'nonzero'
}[] = [
  {
    value: 'regular',
    label: 'Regular',
    description: 'Duplas sorteadas aleatoriamente a partir de uma lista de jogadores',
    iconPath: 'M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z',
    iconFillRule: 'evenodd',
  },
  {
    value: 'fixed-pairs',
    label: 'Duplas Fixas',
    description: 'Duplas pré-definidas — os pares não mudam entre rondas',
    iconPath:
      'M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z',
  },
  {
    value: 'seeded',
    label: 'Cabeças de Série',
    description: 'Tabela A vs Tabela B — pareados por posição após baralhar cada tabela',
    iconPath:
      'M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z',
    iconFillRule: 'evenodd',
  },
]

export const MODE_LABELS: Record<GameMode, string> = Object.fromEntries(
  MODES.map(m => [m.value, m.label])
) as Record<GameMode, string>

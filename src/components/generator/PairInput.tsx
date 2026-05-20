import type { Pair } from '../../types'
import { useLanguage } from '../../context/LanguageContext'
import { ChipInput } from './ChipInput'

type Props = {
  pairs: Pair[]
  onChange: (pairs: Pair[]) => void
}

function pairsToStrings(pairs: Pair[]): string[] {
  return pairs.map(([p1, p2]) => `${p1} / ${p2}`)
}

function parsePairStrings(strings: string[]): Pair[] {
  return strings
    .map(s => {
      const parts = s.split('/')
      if (parts.length !== 2) return null
      const [p1, p2] = parts.map(p => p.trim())
      if (!p1 || !p2) return null
      return [p1, p2] as Pair
    })
    .filter((p): p is Pair => p !== null)
}

export function PairInput({ pairs, onChange }: Props) {
  const { t } = useLanguage()

  return (
    <>
      <ChipInput
        items={pairsToStrings(pairs)}
        onChange={(strings) => onChange(parsePairStrings(strings))}
        label={t.pairInput.label(pairs.length)}
        addPlaceholder={t.pairInput.placeholder}
        testId="pair-input"
        clearLabel={t.pairInput.clearAll}
        clearModalTitle={t.confirm.clearPairs.title}
        clearModalDescription={t.confirm.clearPairs.description}
        cancelLabel={t.confirm.cancel}
        parse={(text) => text.split('\n').map(s => s.trim()).filter(Boolean)}
      />
      <p className="text-xs text-fg3 mt-1">{t.pairInput.format}</p>
    </>
  )
}

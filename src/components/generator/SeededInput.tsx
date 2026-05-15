import { useState } from 'react'

function parseNames(text: string): string[] {
  return text.split('\n').map(n => n.trim()).filter(Boolean)
}

type TableProps = {
  label: string
  players: string[]
  testPrefix: string
  onChange: (players: string[]) => void
}

function TableTextarea({ label, players, testPrefix, onChange }: TableProps) {
  const [raw, setRaw] = useState(() => players.join('\n'))

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const text = e.target.value
    setRaw(text)
    onChange(parseNames(text))
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label} ({players.length})
      </label>
      <textarea
        data-testid={`${testPrefix}-input`}
        value={raw}
        onChange={handleChange}
        rows={5}
        placeholder={'Um nome por linha'}
        className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-2 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
      />
    </div>
  )
}

type Props = {
  tableA: string[]
  tableB: string[]
  onChangeA: (players: string[]) => void
  onChangeB: (players: string[]) => void
}

export function SeededInput({ tableA, tableB, onChangeA, onChangeB }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <TableTextarea label="Tabela A" players={tableA} testPrefix="table-a" onChange={onChangeA} />
      <TableTextarea label="Tabela B" players={tableB} testPrefix="table-b" onChange={onChangeB} />
    </div>
  )
}

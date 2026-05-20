import { useEffect, useRef, useState } from 'react'
import { ClearButton } from '../ui/ClearButton'
import { useLanguage } from '../../context/LanguageContext'

function parseNames(text: string): string[] {
  return text.split('\n').map(n => n.trim()).filter(Boolean)
}

type TableProps = {
  label: string
  players: string[]
  testPrefix: string
  clearLabel: string
  modalTitle: string
  modalDescription: string
  cancelLabel: string
  placeholder: string
  onChange: (players: string[]) => void
}

function TableTextarea({ label, players, testPrefix, clearLabel, modalTitle, modalDescription, cancelLabel, placeholder, onChange }: TableProps) {
  const [raw, setRaw] = useState(() => players.join('\n'))
  const prevLenRef = useRef(players.length)
  const inputId = `${testPrefix}-textarea`

  useEffect(() => {
    if (players.length === 0 && prevLenRef.current > 0) setRaw('')
    prevLenRef.current = players.length
  }, [players])

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const text = e.target.value
    setRaw(text)
    onChange(parseNames(text))
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-fg2"
        >
          {label}
        </label>
        {players.length > 0 && (
          <ClearButton
            label={clearLabel}
            modalTitle={modalTitle}
            modalDescription={modalDescription}
            cancelLabel={cancelLabel}
            onConfirm={() => { setRaw(''); onChange([]) }}
          />
        )}
      </div>
      <textarea
        id={inputId}
        data-testid={`${testPrefix}-input`}
        value={raw}
        onChange={handleChange}
        rows={5}
        placeholder={placeholder}
        className="w-full rounded-md border border-bordermd px-2 py-2 text-base sm:text-sm bg-surface text-fg focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent resize-y min-h-28 sm:min-h-36 lg:min-h-44"
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
  const { t } = useLanguage()

  return (
    <div className="grid grid-cols-2 gap-3">
      <TableTextarea
        label={t.seededInput.tableA(tableA.length)}
        players={tableA}
        testPrefix="table-a"
        clearLabel={t.seededInput.clear}
        modalTitle={t.confirm.clearTable.title}
        modalDescription={t.confirm.clearTable.description}
        cancelLabel={t.confirm.cancel}
        placeholder={t.seededInput.placeholder}
        onChange={onChangeA}
      />
      <TableTextarea
        label={t.seededInput.tableB(tableB.length)}
        players={tableB}
        testPrefix="table-b"
        clearLabel={t.seededInput.clear}
        modalTitle={t.confirm.clearTable.title}
        modalDescription={t.confirm.clearTable.description}
        cancelLabel={t.confirm.cancel}
        placeholder={t.seededInput.placeholder}
        onChange={onChangeB}
      />
    </div>
  )
}

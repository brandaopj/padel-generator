import { useLanguage } from '../../context/LanguageContext'
import { ChipInput } from './ChipInput'

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

function TableChipInput({
  label,
  players,
  testPrefix,
  clearLabel,
  modalTitle,
  modalDescription,
  cancelLabel,
  placeholder,
  onChange,
}: TableProps) {
  return (
    <ChipInput
      items={players}
      onChange={onChange}
      label={label}
      addPlaceholder={placeholder}
      testId={`${testPrefix}-input`}
      clearLabel={clearLabel}
      clearModalTitle={modalTitle}
      clearModalDescription={modalDescription}
      cancelLabel={cancelLabel}
      parse={(text) => text.split('\n').map(n => n.trim()).filter(Boolean)}
    />
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
      <TableChipInput
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
      <TableChipInput
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

import { useLanguage } from '../../context/LanguageContext'
import { ChipInput } from './ChipInput'

type Props = {
  players: string[]
  onChange: (players: string[]) => void
}

export function PlayerInput({ players, onChange }: Props) {
  const { t } = useLanguage()
  return (
    <ChipInput
      items={players}
      onChange={onChange}
      label={t.playerInput.label(players.length)}
      addPlaceholder={t.playerInput.placeholder}
      testId="player-input"
      clearLabel={t.playerInput.clearAll}
      clearModalTitle={t.confirm.clearPlayers.title}
      clearModalDescription={t.confirm.clearPlayers.description}
      cancelLabel={t.confirm.cancel}
      parse={(text) => text.split('\n').map(n => n.trim()).filter(Boolean)}
    />
  )
}

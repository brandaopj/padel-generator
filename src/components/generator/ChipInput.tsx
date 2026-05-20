import { useRef } from 'react'
import { ClearButton } from '../ui/ClearButton'
import { useLanguage } from '../../context/LanguageContext'

const COURT_COLORS = [
  '--color-court1',
  '--color-court2',
  '--color-court3',
  '--color-court4',
  '--color-court5',
  '--color-court6',
]

function getAvatarStyle(name: string): React.CSSProperties {
  const hash = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  const colorVar = COURT_COLORS[hash % COURT_COLORS.length]
  return {
    background: `color-mix(in oklab, var(${colorVar}) 15%, var(--color-surface))`,
    color: `var(${colorVar})`,
  }
}

function initials(name: string): string {
  return name
    .split(/[\s/]+/)
    .filter(Boolean)
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

type ChipInputProps = {
  items: string[]
  onChange: (items: string[]) => void
  label: string
  addPlaceholder: string
  testId: string
  clearLabel: string
  clearModalTitle: string
  clearModalDescription: string
  cancelLabel: string
  parse: (text: string) => string[]
}

export function ChipInput({
  items,
  onChange,
  label,
  addPlaceholder,
  testId,
  clearLabel,
  clearModalTitle,
  clearModalDescription,
  cancelLabel,
  parse,
}: ChipInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const { t } = useLanguage()

  function removeItem(item: string) {
    const idx = items.indexOf(item)
    if (idx === -1) return
    const next = [...items]
    next.splice(idx, 1)
    onChange(next)
  }

  function handleInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    const input = e.currentTarget
    if (e.key === 'Enter') {
      e.preventDefault()
      const value = input.value.trim()
      if (value) {
        onChange([...items, value])
        input.value = ''
      }
    } else if (e.key === 'Backspace' && input.value === '') {
      e.preventDefault()
      if (items.length > 0) {
        onChange(items.slice(0, -1))
      }
    }
  }

  function handleInputPaste(e: React.ClipboardEvent<HTMLInputElement>) {
    e.preventDefault()
    const text = e.clipboardData.getData('text')
    const parsed = parse(text)
    if (parsed.length > 0) {
      const combined = [...items]
      for (const p of parsed) {
        if (!combined.includes(p)) combined.push(p)
      }
      onChange(combined)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  function handleContainerClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) {
      inputRef.current?.focus()
    }
  }

  function handleBridgeChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const parsed = parse(e.target.value)
    onChange(parsed)
  }

  return (
    <div className="space-y-1.5">
      {/* Header row */}
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-sm font-medium text-fg2">{label}</label>
        <div className="flex items-center gap-1.5">
          {items.length > 0 && (
            <span className="text-[10px] font-bold text-brand bg-brand/10 px-2 py-0.5 rounded-full tabular-nums">
              {items.length} ✓
            </span>
          )}
          {items.length > 0 && (
            <ClearButton
              label={clearLabel}
              modalTitle={clearModalTitle}
              modalDescription={clearModalDescription}
              cancelLabel={cancelLabel}
              onConfirm={() => onChange([])}
            />
          )}
        </div>
      </div>

      {/* Chip container */}
      <div
        className="relative flex flex-wrap gap-1.5 rounded-lg border border-bordermd bg-surface p-2 min-h-[80px] cursor-text"
        onClick={handleContainerClick}
      >
        {items.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="inline-flex items-center gap-1 rounded-full bg-surface2 border border-border pl-0.5 pr-1 py-0.5 text-sm text-fg max-w-[200px]"
          >
            <span
              className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center text-[9px] font-bold"
              style={getAvatarStyle(item)}
            >
              {initials(item)}
            </span>
            <span className="truncate">{item}</span>
            <button
              type="button"
              onClick={() => removeItem(item)}
              className="shrink-0 ml-0.5 text-fg3 hover:text-fg transition-colors"
              aria-label={`Remove ${item}`}
            >
              <svg
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
              >
                <line x1="2" y1="2" x2="8" y2="8" />
                <line x1="8" y1="2" x2="2" y2="8" />
              </svg>
            </button>
          </span>
        ))}

        {/* Inline add input */}
        <input
          ref={inputRef}
          type="text"
          placeholder={addPlaceholder}
          className="flex-1 min-w-[120px] bg-transparent text-sm text-fg outline-none placeholder:text-fg3 py-1 px-1"
          onKeyDown={handleInputKeyDown}
          onPaste={handleInputPaste}
        />
      </div>

      {/* Hint text */}
      <p className="text-[10px] text-fg3">{t.generator.chipHint}</p>

      {/* Hidden textarea bridge for e2e tests */}
      <textarea
        data-testid={testId}
        value={items.join('\n')}
        onChange={handleBridgeChange}
        tabIndex={-1}
        aria-hidden="true"
        style={{
          position: 'absolute',
          opacity: 0,
          pointerEvents: 'none',
          width: 1,
          height: 1,
          overflow: 'hidden',
        }}
      />
    </div>
  )
}

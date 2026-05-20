import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useLanguage } from '../../context/LanguageContext'

type Props = {
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmModal({ title, description, confirmLabel = 'OK', cancelLabel, onConfirm, onCancel }: Props) {
  const { t } = useLanguage()
  const resolvedCancelLabel = cancelLabel ?? t.confirm.cancel

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onCancel() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onCancel])

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-sm bg-surface rounded-xl shadow-2xl border border-border p-6 animate-scale-in"
        onClick={e => e.stopPropagation()}
      >
        <h2
          id="confirm-modal-title"
          className="text-base font-semibold text-fg mb-2"
        >
          {title}
        </h2>
        {description && (
          <p className="text-sm text-fg3 mb-5">{description}</p>
        )}
        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-fg2 bg-surface2 hover:bg-surface2 rounded-lg transition-colors"
          >
            {resolvedCancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}

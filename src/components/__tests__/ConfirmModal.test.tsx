import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'

afterEach(cleanup)
import { LanguageProvider } from '../../context/LanguageContext'
import { ConfirmModal } from '../ui/ConfirmModal'

// ConfirmModal always renders when mounted (the parent controls visibility).
// Wrap with LanguageProvider because it calls useLanguage() for default cancel label.
function renderModal(props: {
  title?: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm?: () => void
  onCancel?: () => void
}) {
  const {
    title = 'Are you sure?',
    onConfirm = vi.fn(),
    onCancel = vi.fn(),
    ...rest
  } = props
  return render(
    <LanguageProvider>
      <ConfirmModal
        title={title}
        onConfirm={onConfirm}
        onCancel={onCancel}
        {...rest}
      />
    </LanguageProvider>
  )
}

describe('ConfirmModal', () => {
  it('renders when mounted', () => {
    renderModal({})
    // a11y check: modal uses role="dialog" and aria-modal="true"
    expect(screen.getByRole('dialog')).toBeDefined()
  })

  it('has aria-modal="true" for screen reader containment', () => {
    renderModal({})
    // a11y: modal should trap focus context for assistive technology
    const dialog = screen.getByRole('dialog')
    expect(dialog.getAttribute('aria-modal')).toBe('true')
  })

  it('has aria-labelledby pointing to the title heading', () => {
    renderModal({ title: 'My Modal Title' })
    const dialog = screen.getByRole('dialog')
    const labelledById = dialog.getAttribute('aria-labelledby')
    expect(labelledById).toBeTruthy()
    const titleEl = document.getElementById(labelledById!)
    expect(titleEl?.textContent).toBe('My Modal Title')
  })

  it('displays the title', () => {
    renderModal({ title: 'Delete entry?' })
    expect(screen.getByText('Delete entry?')).toBeDefined()
  })

  it('displays the description when provided', () => {
    renderModal({ description: 'This cannot be undone.' })
    expect(screen.getByText('This cannot be undone.')).toBeDefined()
  })

  it('does not render a description paragraph when description is omitted', () => {
    renderModal({ description: undefined })
    expect(screen.queryByText(/cannot be undone/i)).toBeNull()
  })

  it('calls onConfirm when the confirm button is clicked', () => {
    const onConfirm = vi.fn()
    renderModal({ confirmLabel: 'Yes, delete', onConfirm })
    fireEvent.click(screen.getByRole('button', { name: 'Yes, delete' }))
    expect(onConfirm).toHaveBeenCalledTimes(1)
  })

  it('calls onCancel when the cancel button is clicked', () => {
    const onCancel = vi.fn()
    renderModal({ cancelLabel: 'No, keep it', onCancel })
    fireEvent.click(screen.getByRole('button', { name: 'No, keep it' }))
    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it('calls onCancel when backdrop is clicked', () => {
    const onCancel = vi.fn()
    renderModal({ onCancel })
    fireEvent.click(screen.getByRole('dialog'))
    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it('calls onCancel when Escape key is pressed', () => {
    const onCancel = vi.fn()
    renderModal({ onCancel })
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it('uses a default cancel label from translations when cancelLabel is not provided', () => {
    renderModal({ cancelLabel: undefined })
    // Should fall back to t.confirm.cancel ("Cancelar" in PT or "Cancel" in EN)
    expect(screen.getByRole('button', { name: /cancelar|cancel/i })).toBeDefined()
  })

  it('uses provided confirmLabel', () => {
    renderModal({ confirmLabel: 'Confirm' })
    expect(screen.getByRole('button', { name: 'Confirm' })).toBeDefined()
  })
})

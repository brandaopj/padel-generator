import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, act, cleanup } from '@testing-library/react'
import { LanguageProvider } from '../../context/LanguageContext'
import { ToastProvider, useToast } from '../../context/ToastContext'

// Ensure DOM is cleaned between tests (createPortal renders to document.body)
afterEach(cleanup)

// Helper component that fires showToast so we can test the rendered output
function ToastTrigger({
  variant,
  message,
  persistent,
  action,
}: {
  variant: 'success' | 'error' | 'info'
  message: string
  persistent?: boolean
  action?: { label: string; onClick: () => void }
}) {
  const { showToast } = useToast()
  return (
    <button
      type="button"
      onClick={() => showToast(variant, message, { persistent, action })}
      data-testid="trigger"
    >
      Show
    </button>
  )
}

function renderToast(props: {
  variant?: 'success' | 'error' | 'info'
  message?: string
  persistent?: boolean
  action?: { label: string; onClick: () => void }
}) {
  const { variant = 'success', message = 'Test message', ...rest } = props
  return render(
    <LanguageProvider>
      <ToastProvider>
        <ToastTrigger variant={variant} message={message} {...rest} />
      </ToastProvider>
    </LanguageProvider>
  )
}

describe('Toast', () => {
  it('does not render any alert before showToast is called', () => {
    renderToast({})
    expect(screen.queryByRole('alert')).toBeNull()
  })

  it('renders the message text after showToast is called', () => {
    renderToast({ message: 'Tournament generated!' })
    fireEvent.click(screen.getByTestId('trigger'))
    expect(screen.getByText('Tournament generated!')).toBeDefined()
  })

  it('uses role="alert" for screen reader announcements', () => {
    // a11y check: toast must use role="alert" so assistive tech announces it
    renderToast({ message: 'Hello' })
    fireEvent.click(screen.getByTestId('trigger'))
    const alerts = screen.getAllByRole('alert')
    expect(alerts.length).toBeGreaterThan(0)
  })

  it('success variant renders inside a notification region', () => {
    renderToast({ variant: 'success', message: 'Saved!' })
    fireEvent.click(screen.getByTestId('trigger'))
    // a11y check: toast container has role="region" for landmark navigation
    expect(screen.getByRole('region')).toBeDefined()
  })

  it('error variant is persistent by default (no auto-dismiss)', () => {
    renderToast({ variant: 'error', message: 'Something failed' })
    fireEvent.click(screen.getByTestId('trigger'))
    const alert = screen.getByRole('alert')
    expect(alert.textContent).toContain('Something failed')
    // Persistent toasts show a close/dismiss button
    const closeBtn = screen.getByRole('button', { name: /fechar|close/i })
    expect(closeBtn).toBeDefined()
  })

  it('persistent toast has a dismiss button with accessible label', () => {
    renderToast({ variant: 'success', message: 'Persistent!', persistent: true })
    fireEvent.click(screen.getByTestId('trigger'))
    // a11y check: dismiss button should have an accessible aria-label
    const closeBtn = screen.getByRole('button', { name: /fechar|close/i })
    expect(closeBtn).toBeDefined()
  })

  it('clicking the dismiss button removes the toast', () => {
    vi.useFakeTimers()
    renderToast({ variant: 'error', message: 'Dismissable error' })
    fireEvent.click(screen.getByTestId('trigger'))
    const closeBtn = screen.getByRole('button', { name: /fechar|close/i })
    fireEvent.click(closeBtn)
    // After the 250ms leave animation completes the toast is removed from DOM
    act(() => { vi.advanceTimersByTime(300) })
    expect(screen.queryByRole('alert')).toBeNull()
    vi.useRealTimers()
  })

  it('success variant uses green styling', () => {
    renderToast({ variant: 'success', message: 'Yay!' })
    fireEvent.click(screen.getByTestId('trigger'))
    const alert = screen.getByRole('alert')
    expect(alert.className).toContain('green')
  })

  it('error variant uses red styling', () => {
    renderToast({ variant: 'error', message: 'Oops!' })
    fireEvent.click(screen.getByTestId('trigger'))
    const alert = screen.getByRole('alert')
    expect(alert.className).toContain('red')
  })

  it('info variant uses blue styling', () => {
    renderToast({ variant: 'info', message: 'FYI' })
    fireEvent.click(screen.getByTestId('trigger'))
    const alert = screen.getByRole('alert')
    expect(alert.className).toContain('blue')
  })

  it('renders an action button when action is provided', () => {
    const actionClick = vi.fn()
    renderToast({
      variant: 'success',
      message: 'Deleted',
      persistent: true,
      action: { label: 'Undo', onClick: actionClick },
    })
    fireEvent.click(screen.getByTestId('trigger'))
    const undoBtn = screen.getByRole('button', { name: 'Undo' })
    expect(undoBtn).toBeDefined()
    fireEvent.click(undoBtn)
    expect(actionClick).toHaveBeenCalledTimes(1)
  })
})

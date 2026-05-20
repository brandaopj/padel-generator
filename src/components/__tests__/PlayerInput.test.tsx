import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'

afterEach(cleanup)
import { LanguageProvider } from '../../context/LanguageContext'
import { PlayerInput } from '../generator/PlayerInput'

// Wrap component with LanguageProvider since PlayerInput uses useLanguage()
function renderPlayerInput(props: { players: string[]; onChange: (p: string[]) => void }) {
  return render(
    <LanguageProvider>
      <PlayerInput {...props} />
    </LanguageProvider>
  )
}

describe('PlayerInput', () => {
  it('renders a textarea', () => {
    renderPlayerInput({ players: [], onChange: vi.fn() })
    // a11y check: textarea should be labelled (for screen readers)
    const textarea = screen.getByRole('textbox')
    expect(textarea).toBeDefined()
  })

  it('chip input has an accessible label', () => {
    renderPlayerInput({ players: [], onChange: vi.fn() })
    expect(screen.getByText(/jogadores|players/i)).toBeDefined()
  })

  it('displays current players as chips', () => {
    renderPlayerInput({ players: ['Alice', 'Bob'], onChange: vi.fn() })
    expect(screen.getByText('Alice')).toBeDefined()
    expect(screen.getByText('Bob')).toBeDefined()
  })

  it('calls onChange with parsed names when bridge textarea changes', () => {
    const onChange = vi.fn()
    renderPlayerInput({ players: [], onChange })
    const bridge = screen.getByTestId('player-input')
    fireEvent.change(bridge, { target: { value: 'Alice\nBob\nCarlos' } })
    expect(onChange).toHaveBeenCalledWith(['Alice', 'Bob', 'Carlos'])
  })

  it('parses and trims names, ignoring blank lines', () => {
    const onChange = vi.fn()
    renderPlayerInput({ players: [], onChange })
    const bridge = screen.getByTestId('player-input')
    fireEvent.change(bridge, { target: { value: '  Alice  \n\n  Bob  ' } })
    expect(onChange).toHaveBeenCalledWith(['Alice', 'Bob'])
  })

  it('does not show the clear button when players list is empty', () => {
    renderPlayerInput({ players: [], onChange: vi.fn() })
    // a11y check: clear button should not be in the DOM when there's nothing to clear
    expect(screen.queryByText(/apagar tudo|clear all/i)).toBeNull()
  })

  it('shows the clear button when players list is non-empty', () => {
    renderPlayerInput({ players: ['Alice'], onChange: vi.fn() })
    expect(screen.getByText(/apagar tudo|clear all/i)).toBeDefined()
  })

  it('clicking clear button opens confirmation modal', () => {
    const onChange = vi.fn()
    renderPlayerInput({ players: ['Alice'], onChange })
    const clearBtn = screen.getByText(/apagar tudo|clear all/i)
    fireEvent.click(clearBtn)
    // Modal should now be visible with a dialog role
    expect(screen.getByRole('dialog')).toBeDefined()
  })

  it('confirming the modal calls onChange with empty array', () => {
    const onChange = vi.fn()
    renderPlayerInput({ players: ['Alice'], onChange })
    // Open modal
    fireEvent.click(screen.getByText(/apagar tudo|clear all/i))
    // Both the trigger button and the modal confirm button share the same label;
    // the confirm button is the last one in the DOM (inside the portal).
    const buttons = screen.getAllByRole('button', { name: /apagar tudo|clear all/i })
    const confirmBtn = buttons[buttons.length - 1]
    fireEvent.click(confirmBtn)
    expect(onChange).toHaveBeenCalledWith([])
  })
})

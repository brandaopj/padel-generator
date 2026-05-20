import { test, expect, type Page } from '@playwright/test'

async function generateTournament(page: Page, name = 'Torneio Teste') {
  await page.getByTestId('club-name-toggle').click()
  await page.getByTestId('club-name-input').fill(name)
  await page.getByTestId('player-input').fill('Ana\nBruno\nCarlos\nDiana')
  await page.getByTestId('generate-button').click()
  await expect(page.getByTestId('rounds-panel')).toBeVisible()
}

async function navigateToHistory(page: Page) {
  const openMenuBtn = page.getByLabel('Open menu')
  if (await openMenuBtn.isVisible()) {
    await openMenuBtn.click()
  }
  await page.getByRole('link', { name: 'Histórico' }).first().click()
}

test.describe('History page', () => {
  test.beforeEach(async ({ page, context }) => {
    await context.addInitScript(() => {
      localStorage.clear()
      localStorage.setItem('padel-lang', 'pt')
    })
    await page.goto('/')
  })

  test('shows generated tournament in history list', async ({ page }) => {
    await generateTournament(page, 'Torneio Histórico')
    await navigateToHistory(page)

    await expect(page.getByTestId('history-list')).toBeVisible()
    await expect(page.locator('[data-testid^="history-entry-"]').first()).toContainText('Torneio Histórico')
  })

  test('shows empty state when no tournaments exist', async ({ page }) => {
    await page.goto('/history')
    await expect(page.getByTestId('history-empty')).toBeVisible()
  })

  test('deletes tournament from history and shows undo toast', async ({ page }) => {
    await generateTournament(page, 'Torneio Apagar')
    await navigateToHistory(page)

    await expect(page.getByTestId('history-list')).toBeVisible()
    await expect(page.locator('[data-testid^="history-entry-"]')).toHaveCount(1)

    await page.getByRole('button', { name: 'Apagar torneio' }).click()
    await page.getByRole('button', { name: 'Apagar' }).click()

    // Entry disappears immediately (optimistic)
    await expect(page.locator('[data-testid^="history-entry-"]')).toHaveCount(0)
    await expect(page.getByTestId('history-empty')).toBeVisible()
    // Undo toast appears
    await expect(page.getByRole('alert').filter({ hasText: 'Desfazer' })).toBeVisible()
  })

  test('undo delete restores tournament', async ({ page }) => {
    await generateTournament(page, 'Torneio Cancelar')
    await navigateToHistory(page)

    await expect(page.getByTestId('history-list')).toBeVisible()
    await page.getByRole('button', { name: 'Apagar torneio' }).click()
    await page.getByRole('button', { name: 'Apagar' }).click()
    // Entry removed, undo button visible
    await expect(page.locator('[data-testid^="history-entry-"]')).toHaveCount(0)
    await page.getByRole('alert').getByRole('button', { name: 'Desfazer' }).click()

    // Entry restored
    await expect(page.locator('[data-testid^="history-entry-"]')).toHaveCount(1)
  })

  test('reuse players loads mode and players into generator', async ({ page }) => {
    await generateTournament(page, 'Torneio Template')
    await navigateToHistory(page)

    await expect(page.getByTestId('history-list')).toBeVisible()
    await page.getByRole('button', { name: 'Usar jogadores' }).click()

    // Navigated back to generator
    await expect(page).toHaveURL('/')
    // Players are pre-filled (the textarea should contain the names we set)
    await expect(page.getByTestId('player-input')).toContainText('Ana')
    await expect(page.getByTestId('player-input')).toContainText('Bruno')
    // Toast appears
    await expect(page.getByRole('alert').filter({ hasText: 'Jogadores carregados' })).toBeVisible()
  })
})

test.describe('History page count badge', () => {
  test.beforeEach(async ({ page, context }) => {
    await context.addInitScript(() => {
      localStorage.clear()
      localStorage.setItem('padel-lang', 'pt')
      const tournaments = [
        {
          id: 'test-1',
          date: '2025-01-01T10:00:00.000Z',
          clubName: 'Torneio Regular',
          mode: 'regular',
          courts: 1,
          players: ['Ana', 'Bruno', 'Carlos', 'Diana'],
          pairs: [['Ana', 'Bruno'], ['Carlos', 'Diana']],
          rounds: [],
        },
        {
          id: 'test-2',
          date: '2025-01-02T10:00:00.000Z',
          clubName: 'Torneio Pares',
          mode: 'fixed-pairs',
          courts: 1,
          players: [],
          pairs: [['Eva', 'Filipe'], ['Gina', 'Hugo']],
          rounds: [],
        },
        {
          id: 'test-3',
          date: '2025-01-03T10:00:00.000Z',
          clubName: 'Torneio Regular 2',
          mode: 'regular',
          courts: 1,
          players: ['Ana', 'Bruno', 'Carlos', 'Diana'],
          pairs: [['Ana', 'Bruno'], ['Carlos', 'Diana']],
          rounds: [],
        },
      ]
      localStorage.setItem('padel-history', JSON.stringify(tournaments))
    })
    await page.goto('/history')
  })

  test('count badge updates when filter is applied', async ({ page }) => {
    // Badge should show total count (3)
    const badge = page.locator('h1 + span')
    await expect(badge).toHaveText('3')

    // Apply mode filter to "Pares fixos" (fixed-pairs) — only 1 match
    const modeSelect = page.getByRole('combobox', { name: 'Todos' })
    await modeSelect.selectOption('fixed-pairs')
    await expect(badge).toHaveText('1')

    // Clear the filter back to "all"
    await modeSelect.selectOption('all')
    await expect(badge).toHaveText('3')
  })
})

test.describe('Tournament detail page', () => {
  test.beforeEach(async ({ page, context }) => {
    await context.addInitScript(() => {
      localStorage.clear()
      localStorage.setItem('padel-lang', 'pt')
    })
    await page.goto('/')
  })

  test('shows tournament details and rounds', async ({ page }) => {
    await generateTournament(page, 'Torneio Detalhe')
    await navigateToHistory(page)
    await expect(page.getByTestId('history-list')).toBeVisible()
    await page.locator('[data-testid^="history-entry-"]').first().click()

    await expect(page.getByTestId('rounds-panel')).toBeVisible()
    await expect(page.locator('text=Torneio Detalhe')).toBeVisible()
    await expect(page.locator('text=← Histórico')).toBeVisible()
  })

  test('back link navigates to history', async ({ page }) => {
    await generateTournament(page)
    await navigateToHistory(page)
    await expect(page.getByTestId('history-list')).toBeVisible()
    await page.locator('[data-testid^="history-entry-"]').first().click()

    await expect(page.locator('text=← Histórico')).toBeVisible()
    await page.click('text=← Histórico')
    await expect(page.getByTestId('history-list')).toBeVisible()
  })

  test('shows not-found message for invalid id', async ({ page }) => {
    await page.goto('/history/invalid-id-that-does-not-exist')
    await expect(page.getByTestId('tournament-not-found')).toBeVisible()
  })
})

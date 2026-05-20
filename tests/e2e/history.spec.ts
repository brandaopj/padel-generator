import { test, expect } from '@playwright/test'

async function generateTournament(page: any, name = 'Torneio Teste') {
  await page.getByTestId('club-name-input').fill(name)
  await page.getByTestId('player-input').fill('Ana\nBruno\nCarlos\nDiana')
  await page.getByTestId('generate-button').click()
  await expect(page.getByTestId('rounds-panel')).toBeVisible()
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
    await page.click('text=Histórico')

    await expect(page.getByTestId('history-list')).toBeVisible()
    await expect(page.locator('[data-testid^="history-entry-"]').first()).toContainText('Torneio Histórico')
  })

  test('shows empty state when no tournaments exist', async ({ page }) => {
    await page.goto('/history')
    await expect(page.getByTestId('history-empty')).toBeVisible()
  })

  test('deletes tournament from history and shows undo toast', async ({ page }) => {
    await generateTournament(page, 'Torneio Apagar')
    await page.click('text=Histórico')

    await expect(page.getByTestId('history-list')).toBeVisible()
    await expect(page.locator('[data-testid^="history-entry-"]')).toHaveCount(1)

    await page.getByRole('button', { name: 'Apagar torneio' }).click()

    // Entry disappears immediately (optimistic)
    await expect(page.locator('[data-testid^="history-entry-"]')).toHaveCount(0)
    await expect(page.getByTestId('history-empty')).toBeVisible()
    // Undo toast appears
    await expect(page.getByRole('alert').filter({ hasText: 'Desfazer' })).toBeVisible()
  })

  test('undo delete restores tournament', async ({ page }) => {
    await generateTournament(page, 'Torneio Cancelar')
    await page.click('text=Histórico')

    await expect(page.getByTestId('history-list')).toBeVisible()
    await page.getByRole('button', { name: 'Apagar torneio' }).click()
    // Entry removed, undo button visible
    await expect(page.locator('[data-testid^="history-entry-"]')).toHaveCount(0)
    await page.getByRole('alert').getByRole('button', { name: 'Desfazer' }).click()

    // Entry restored
    await expect(page.locator('[data-testid^="history-entry-"]')).toHaveCount(1)
  })

  test('reuse players loads mode and players into generator', async ({ page }) => {
    await generateTournament(page, 'Torneio Template')
    await page.click('text=Histórico')

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
    await page.click('text=Histórico')
    await expect(page.getByTestId('history-list')).toBeVisible()
    await page.locator('[data-testid^="history-entry-"]').first().click()

    await expect(page.getByTestId('rounds-panel')).toBeVisible()
    await expect(page.locator('text=Torneio Detalhe')).toBeVisible()
    await expect(page.locator('text=← Histórico')).toBeVisible()
  })

  test('back link navigates to history', async ({ page }) => {
    await generateTournament(page)
    await page.click('text=Histórico')
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

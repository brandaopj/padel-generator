import { test, expect, type Page } from '@playwright/test'

async function navigateToHistory(page: Page) {
  const openMenuBtn = page.getByLabel('Open menu')
  if (await openMenuBtn.isVisible()) {
    await openMenuBtn.click()
  }
  await page.getByRole('link', { name: 'Histórico' }).first().click()
}

test.describe('Regular mode', () => {
  test.beforeEach(async ({ page, context }) => {
    await context.addInitScript(() => {
      localStorage.clear()
      localStorage.setItem('padel-lang', 'pt')
    })
    await page.goto('/')
  })

  test('generates rounds for 8 players on 2 courts', async ({ page }) => {
    await page.getByTestId('club-name-toggle').click()
    await page.getByTestId('club-name-input').fill('Clube Teste')
    await expect(page.getByTestId('mode-regular')).toHaveAttribute('aria-selected', 'true')

    const players = ['Ana', 'Bruno', 'Carlos', 'Diana', 'Eva', 'Filipe', 'Gina', 'Hugo']
    await page.getByTestId('player-input').fill(players.join('\n'))

    await expect(page.getByTestId('validation-error')).toHaveCount(0)
    await expect(page.getByTestId('generate-button')).toBeEnabled()

    await page.getByTestId('generate-button').click()

    await expect(page.getByTestId('rounds-panel')).toBeVisible()
    // 4 pairs → N-1 = 3 rounds
    await expect(page.getByTestId('round-1')).toBeVisible()
    await expect(page.getByTestId('round-2')).toBeVisible()
    await expect(page.getByTestId('round-3')).toBeVisible()
    // Each round: 2 matches on 2 courts
    const round1 = page.getByTestId('round-1')
    await expect(round1.getByTestId('match-card')).toHaveCount(2)
  })

  test('generate button is disabled for fewer than 4 players', async ({ page }) => {
    await page.getByTestId('player-input').fill('Ana\nBruno')

    await expect(page.getByTestId('validation-error').first()).toBeVisible()
    await expect(page.getByTestId('generate-button')).toBeDisabled()
  })

  test('generate button is disabled for player count not a multiple of 4', async ({ page }) => {
    await page.getByTestId('player-input').fill('Ana\nBruno\nCarlos\nDiana\nEva\nFilipe')

    await expect(page.getByTestId('validation-error').first()).toContainText('adiciona')
    await expect(page.getByTestId('generate-button')).toBeDisabled()
  })

  test('generated tournament appears in history', async ({ page }) => {
    await page.getByTestId('club-name-toggle').click()
    await page.getByTestId('club-name-input').fill('Clube Histórico')
    await page.getByTestId('player-input').fill('Ana\nBruno\nCarlos\nDiana')
    await page.getByTestId('generate-button').click()
    await expect(page.getByTestId('rounds-panel')).toBeVisible()

    await navigateToHistory(page)
    await expect(page.getByTestId('history-list')).toBeVisible()
    await expect(page.locator('[data-testid^="history-entry-"]').first()).toContainText('Clube Histórico')
  })

  test('history entry links to tournament detail page', async ({ page }) => {
    await page.getByTestId('club-name-toggle').click()
    await page.getByTestId('club-name-input').fill('Clube Link')
    await page.getByTestId('player-input').fill('Ana\nBruno\nCarlos\nDiana')
    await page.getByTestId('generate-button').click()

    await navigateToHistory(page)
    await page.locator('[data-testid^="history-entry-"]').first().click()

    await expect(page.getByTestId('rounds-panel')).toBeVisible()
    await expect(page.locator('text=Clube Link')).toBeVisible()
    await expect(page.locator('text=← Histórico')).toBeVisible()
  })
})

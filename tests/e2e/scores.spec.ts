import { test, expect, type Page } from '@playwright/test'

async function generateTournament(page: Page, name = 'Score Test') {
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

test.describe('Scores and standings', () => {
  test.beforeEach(async ({ page, context }) => {
    await context.addInitScript(() => {
      localStorage.clear()
      localStorage.setItem('padel-lang', 'pt')
    })
    await page.goto('/')
  })

  test('standings table appears in generator view when all scores filled', async ({ page }) => {
    await generateTournament(page)

    // 4 players → 2 pairs → 1 round → 1 match
    await expect(page.getByTestId('standings-table')).not.toBeAttached()

    await page.getByLabel('Score da dupla 1').fill('6')
    await page.getByLabel('Score da dupla 2').fill('4')

    await expect(page.getByTestId('standings-table')).toBeVisible()
  })

  test('standings table does not appear when scores are partial', async ({ page }) => {
    // 8 players → 4 pairs → 3 rounds (6 matches total)
    await page.getByTestId('player-input').fill('Ana\nBruno\nCarlos\nDiana\nEva\nFilipe\nGina\nHugo')
    await page.getByTestId('generate-button').click()
    await expect(page.getByTestId('rounds-panel')).toBeVisible()

    // Fill only the first match — others remain empty
    await page.getByLabel('Score da dupla 1').first().fill('6')
    await page.getByLabel('Score da dupla 2').first().fill('4')

    await expect(page.getByTestId('standings-table')).not.toBeAttached()
  })

  test('save button hidden initially on history detail page', async ({ page }) => {
    await generateTournament(page)
    await navigateToHistory(page)
    await page.locator('[data-testid^="history-entry-"]').first().click()

    await expect(page.getByTestId('rounds-panel')).toBeVisible()
    await expect(page.getByTestId('save-scores-button')).not.toBeAttached()
  })

  test('save button appears when a score is changed in history detail', async ({ page }) => {
    await generateTournament(page)
    await navigateToHistory(page)
    await page.locator('[data-testid^="history-entry-"]').first().click()

    await page.getByLabel('Score da dupla 1').fill('6')

    await expect(page.getByTestId('save-scores-button')).toBeVisible()
  })

  test('saving scores shows success toast and hides the save button', async ({ page }) => {
    await generateTournament(page)
    await navigateToHistory(page)
    await page.locator('[data-testid^="history-entry-"]').first().click()

    await page.getByLabel('Score da dupla 1').fill('6')
    await page.getByLabel('Score da dupla 2').fill('3')
    await page.getByTestId('save-scores-button').click()

    await expect(page.getByRole('alert').filter({ hasText: 'Resultados guardados' })).toBeVisible()
    await expect(page.getByTestId('save-scores-button')).not.toBeAttached()
  })

  test('scores persist after saving and navigating away', async ({ page }) => {
    await generateTournament(page)
    await navigateToHistory(page)
    await page.locator('[data-testid^="history-entry-"]').first().click()

    await page.getByLabel('Score da dupla 1').fill('6')
    await page.getByLabel('Score da dupla 2').fill('3')
    await page.getByTestId('save-scores-button').click()

    // Navigate away and back
    await page.getByRole('link', { name: 'Histórico' }).first().click()
    await page.locator('[data-testid^="history-entry-"]').first().click()

    await expect(page.getByLabel('Score da dupla 1')).toHaveValue('6')
    await expect(page.getByLabel('Score da dupla 2')).toHaveValue('3')
  })

  test('standings table appears on history detail page after all scores saved', async ({ page }) => {
    await generateTournament(page)
    await navigateToHistory(page)
    await page.locator('[data-testid^="history-entry-"]').first().click()

    await page.getByLabel('Score da dupla 1').fill('6')
    await page.getByLabel('Score da dupla 2').fill('3')
    await page.getByTestId('save-scores-button').click()

    await expect(page.getByTestId('standings-table')).toBeVisible()
  })
})

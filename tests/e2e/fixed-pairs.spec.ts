import { test, expect } from '@playwright/test'

test.describe('Duplas Fixas mode', () => {
  test.beforeEach(async ({ page, context }) => {
    await context.addInitScript(() => {
      localStorage.clear()
      localStorage.setItem('padel-lang', 'pt')
    })
    await page.goto('/')
    await page.getByTestId('mode-fixed-pairs').click()
  })

  test('generates rounds for 4 fixed pairs', async ({ page }) => {
    await page.getByTestId('club-name-toggle').click()
    await page.getByTestId('club-name-input').fill('Club Fixas')

    const pairs = [['Ana', 'Bruno'], ['Carlos', 'Diana'], ['Eva', 'Filipe'], ['Gina', 'Hugo']]
    await page.getByTestId('pair-input').fill(pairs.map(([p1, p2]) => `${p1} / ${p2}`).join('\n'))

    await expect(page.getByTestId('validation-error')).toHaveCount(0)
    await expect(page.getByTestId('generate-button')).toBeEnabled()

    await page.getByTestId('generate-button').click()

    await expect(page.getByTestId('rounds-panel')).toBeVisible()
    await expect(page.getByTestId('round-1')).toBeVisible()
    await expect(page.getByTestId('round-2')).toBeVisible()
    await expect(page.getByTestId('round-3')).toBeVisible()
  })

  test('generate button is disabled for fewer than 2 pairs', async ({ page }) => {
    await page.getByTestId('pair-input').fill('Ana / Bruno')

    await expect(page.getByTestId('validation-error').first()).toBeVisible()
    await expect(page.getByTestId('generate-button')).toBeDisabled()
  })

  test('pairs appear in textarea after adding', async ({ page }) => {
    await page.getByTestId('pair-input').fill('Ana / Bruno')

    await expect(page.getByTestId('pair-input')).toHaveValue('Ana / Bruno')
  })

  test('can remove a pair by editing the textarea', async ({ page }) => {
    await page.getByTestId('pair-input').fill('Ana / Bruno\nCarlos / Diana')
    await page.getByTestId('pair-input').fill('Carlos / Diana')

    await expect(page.getByTestId('pair-input')).toHaveValue('Carlos / Diana')
    await expect(page.getByTestId('generate-button')).toBeDisabled()
  })
})

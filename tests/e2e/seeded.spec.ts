import { test, expect } from '@playwright/test'

test.describe('Cabeças de Série mode', () => {
  test.beforeEach(async ({ page, context }) => {
    await context.addInitScript(() => {
      localStorage.clear()
      localStorage.setItem('padel-lang', 'pt')
    })
    await page.goto('/')
    await page.getByTestId('mode-seeded').click()
  })

  test('generates rounds for equal-sized tables', async ({ page }) => {
    await page.getByTestId('club-name-input').fill('Club Seeded')

    await page.getByTestId('table-a-input').fill('A1\nA2\nA3\nA4')
    await page.getByTestId('table-b-input').fill('B1\nB2\nB3\nB4')

    await expect(page.getByTestId('validation-error')).toHaveCount(0)
    await expect(page.getByTestId('generate-button')).toBeEnabled()

    await page.getByTestId('generate-button').click()

    await expect(page.getByTestId('rounds-panel')).toBeVisible()
    await expect(page.getByTestId('round-1')).toBeVisible()
    await expect(page.getByTestId('round-3')).toBeVisible()
    await expect(page.getByTestId('seeded-warning')).toHaveCount(0)
  })

  test('shows non-blocking warning for unequal table sizes', async ({ page }) => {
    await page.getByTestId('table-a-input').fill('A1\nA2\nA3')
    await page.getByTestId('table-b-input').fill('B1\nB2')

    await expect(page.getByTestId('validation-warning').first()).toBeVisible()
    await expect(page.getByTestId('generate-button')).toBeEnabled()

    await page.getByTestId('generate-button').click()

    await expect(page.getByTestId('rounds-panel')).toBeVisible()
    await expect(page.getByTestId('seeded-warning')).toBeVisible()
  })

  test('generate button is disabled when a table has fewer than 2 players', async ({ page }) => {
    await page.getByTestId('table-a-input').fill('A1')
    await page.getByTestId('table-b-input').fill('B1')

    await expect(page.getByTestId('validation-error').first()).toBeVisible()
    await expect(page.getByTestId('generate-button')).toBeDisabled()
  })
})

import { test, expect } from '@playwright/test'

test.describe('Duplas Fixas mode', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
    await page.reload()
    await page.getByTestId('mode-fixed-pairs').click()
  })

  test('generates rounds for 4 fixed pairs', async ({ page }) => {
    await page.getByTestId('club-name-input').fill('Club Fixas')

    const pairs = [['Ana', 'Bruno'], ['Carlos', 'Diana'], ['Eva', 'Filipe'], ['Gina', 'Hugo']]
    for (const [p1, p2] of pairs) {
      await page.getByTestId('pair-input-1').fill(p1)
      await page.getByTestId('pair-input-2').fill(p2)
      await page.getByTestId('pair-add').click()
    }

    await expect(page.getByTestId('validation-error')).toHaveCount(0)
    await expect(page.getByTestId('generate-button')).toBeEnabled()

    await page.getByTestId('generate-button').click()

    await expect(page.getByTestId('rounds-panel')).toBeVisible()
    await expect(page.getByTestId('round-1')).toBeVisible()
    await expect(page.getByTestId('round-2')).toBeVisible()
    await expect(page.getByTestId('round-3')).toBeVisible()
  })

  test('generate button is disabled for fewer than 2 pairs', async ({ page }) => {
    await page.getByTestId('pair-input-1').fill('Ana')
    await page.getByTestId('pair-input-2').fill('Bruno')
    await page.getByTestId('pair-add').click()

    await expect(page.getByTestId('validation-error').first()).toBeVisible()
    await expect(page.getByTestId('generate-button')).toBeDisabled()
  })

  test('pairs appear in list after adding', async ({ page }) => {
    await page.getByTestId('pair-input-1').fill('Ana')
    await page.getByTestId('pair-input-2').fill('Bruno')
    await page.getByTestId('pair-add').click()

    await expect(page.getByTestId('pair-0')).toContainText('Ana / Bruno')
  })

  test('can remove a pair', async ({ page }) => {
    await page.getByTestId('pair-input-1').fill('Ana')
    await page.getByTestId('pair-input-2').fill('Bruno')
    await page.getByTestId('pair-add').click()
    await page.getByTestId('pair-remove-0').click()

    await expect(page.getByTestId('pair-0')).toHaveCount(0)
  })
})

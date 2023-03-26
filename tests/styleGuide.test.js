import { test, expect } from '@playwright/test'

// the style-guide page is for development; it should not be published
test.describe('Style guide / Junk Drawer', () => {
  test('should 404 on the /blog/style-guide URL', async ({ page }) => {
    await page.goto('/blog/style-guide')
    const heading = await page.getByRole('heading', { name: 'Error: 404' })
    expect(await heading.isVisible()).toBeTruthy()
  })

  test('should 404 on the pre-2021 URL', async ({ page }) => {
    await page.goto('/style-guide')
    const heading = await page.getByRole('heading', { name: 'Error: 404' })
    expect(await heading.isVisible()).toBeTruthy()
  })
})

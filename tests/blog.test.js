import { expect, test } from '@playwright/test'

test.describe('Blog index page', () => {
  // this covers that new articles were definitely picked up by the static adapter
  // the <PostList /> component is responsible for things like this
  test('should have a link to a newer article', async ({ page }) => {
    await page.goto('/blog')
    await page.locator('.post-link').first().click()

    // ugh this is brittle, but this is a markup pattern on an article page that isn't on the blog index
    const headline = await page.locator('article h1').textContent()
    expect(headline).not.toContain('Error:')
  })
})

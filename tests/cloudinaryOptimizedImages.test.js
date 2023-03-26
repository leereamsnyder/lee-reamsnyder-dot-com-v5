import { test, expect } from '@playwright/test'

test.describe('Cloudinary optimized rewrites for images', () => {
  test('should successfully request an auto-optimized image', async ({ page }) => {
    page.on('response', (res) => {
      expect(res.status()).toBe(200)
    })

    await page.goto('/cloudinary-auto-optimized/images/blog/a-bit-more-ge-nasty-toaster.jpeg')
  })

  test('should successfully request an on-demand resized + optimized image', async ({ page }) => {
    page.on('response', (res) => {
      expect(res.status()).toBe(200)
    })

    await page.goto(
      '/cloudinary-resized-n-optimized/256/images/blog/a-bit-more-ge-nasty-toaster.jpeg'
    )
  })
})

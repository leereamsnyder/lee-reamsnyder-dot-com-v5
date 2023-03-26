import { test, expect } from '@playwright/test'

test.describe('Favicon file', () => {
  test('should successfully request root /favicon.ico file that should just always be there', async ({
    page,
  }) => {
    page.on('response', (res) => {
      expect(res.status()).toBe(200)
    })

    await page.goto('/favicon.ico')
  })

  // saw a lot of 404s in the logs from Netlify on this file
  // I think some things assume it should be there
  // like for sure I saw it get requested when you pull up the iOS Share sheet
  test('should successfully request root /apple-touch-icon-precomposed.png file that should just always be there', async ({
    page,
  }) => {
    page.on('response', (res) => {
      expect(res.status()).toBe(200)
    })

    await page.goto('/apple-touch-icon-precomposed.png')
  })
})

import { test, expect } from '@playwright/test'

test.describe('Build-time generated social media (og:image) images', () => {
  test('blog article should have og:image metadata', async ({ page }) => {
    // worth calling out that I only generate the last 4–5 years of blog posts
    // so this won't last forever…
    await page.goto('blog/row-stack-space-layout-components')
    const metaTag = await page.locator('meta[property="og:image"]')
    await expect(metaTag).toHaveAttribute(
      'content',
      // full URL for the public site, matching the pattern for the blog post
      'https://www.leereamsnyder.com/og-image-generator/blog/row-stack-space-layout-components/og-image.jpg'
    )

    expect(await page.locator('meta[property="og:image:width"]')).toHaveCount(1)
    expect(await page.locator('meta[property="og:image:height"]')).toHaveCount(1)

    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
      'content',
      'summary_large_image'
    )
  })

  test('should be able to load a pre-generated image', async ({ page, context }) => {
    page.on('response', (res) => {
      expect(res.status()).toBe(200)
    })
    await page.goto('/og-image-generator/blog/row-stack-space-layout-components/og-image.jpg')
  })

  test('should NOT find an og:image tag for a very old blog post', async ({ page }) => {
    await page.goto('/blog/50-jokes-about-state-flags')
    await expect(page.locator('meta[property="og:image"]')).toHaveCount(0)

    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary')
  })

  test('should find the URL for the generated image for the home page', async ({ page }) => {
    await page.goto('/')
    const metaTag = await page.locator('meta[property="og:image"]')
    await expect(metaTag).toHaveAttribute(
      'content',
      // full URL for the public site
      // should not have a // double slash eg /og-image-generator//og-image.jpg
      'https://www.leereamsnyder.com/og-image-generator/og-image.jpg'
    )

    expect(await page.locator('meta[property="og:image:width"]')).toHaveCount(1)
    expect(await page.locator('meta[property="og:image:height"]')).toHaveCount(1)

    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
      'content',
      'summary_large_image'
    )
  })

  test('should successfully load the og:image for the home page', async ({ page }) => {
    page.on('response', (res) => {
      expect(res.status()).toBe(200)
    })

    await page.goto('/og-image-generator/og-image.jpg')
  })
})

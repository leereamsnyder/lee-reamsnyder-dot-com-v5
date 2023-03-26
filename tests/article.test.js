import { test, expect } from '@playwright/test'

test.describe('Article / Post', () => {
  test('reading time should be at least 1 min, even for a very short article', async ({ page }) => {
    await page.goto('/blog/black-lives-matter')
    await expect(page.locator('.reading-time')).toHaveText('1 min read')
  })

  // see #360
  // I first noticed the problem on /blog/i-whupped-hades-ass
  // but that sometimes takes forever to load (videos, probably)
  // so the all-text /blog/hades-build-guide works better for testing
  test('should use monospaced font for italicized elements in .intro', async ({ page }) => {
    await page.goto('/blog/hades-build-guide')
    const introItalic = await page.locator('.intro em')
    await expect(async () => {
      const fontFamily = await introItalic.evaluate((el) => window.getComputedStyle(el).fontFamily)
      expect(fontFamily).toContain('monospace')
    }).toPass()
  })

  // see https://github.com/leereamsnyder/leereamsnyder.com/issues/245
  // the SvelteKit router after next.84 started trying to handle all links as if they were SvelteKit routes
  // but links to static assets like images on the "Hades" post would end up as a 404
  // which is a PITA (see issue & discussion here https://github.com/sveltejs/kit/issues/1295)
  //
  // The fix I put in was for my md -> html conversion to have an additional transformation
  // that added rel="external" to EVERY link automatically, because that was safe
  //
  // after next.277, it appears to be resolved
  // so I've removed the markdown conversion
  test('should find that links in markdown content do NOT have rel="external"', async ({
    page,
  }) => {
    // previous versions of this test used the /blog/i-whupped-hades-ass post
    // but the tests were flaky… I'm thinking because that post has a ton of videos
    // the load event might take a while
    // whereas the build guide is nearly all text
    await page.goto('/blog/hades-build-guide')
    const victoryLink = await page.getByRole('link', { name: '57' }).first()
    expect(await victoryLink.getAttribute('rel')).toBeNull()

    page.on('response', (res) => {
      if (res.url().endsWith('-clear.jpg')) {
        expect(res.status()).toBe(200)
      }
    })

    await victoryLink.click()
  })

  test('should see youtube-lite markup instead of full YouTube iframes initially', async ({
    page,
  }) => {
    await page.goto('/blog/random-appreciation-wednesday-tinted-windows')

    // must scope this to articles, as netlify deploy previews can have an additional iframe from netlify
    // for their collab tooling in there
    await expect(page.locator('article iframe')).toHaveCount(0)

    const liteVideo = await page.locator('lite-youtube')
    await expect(liteVideo).toHaveCount(1)

    const videoid = await liteVideo.getAttribute('videoid')

    await expect(videoid).toBeDefined()

    await liteVideo.scrollIntoViewIfNeeded()

    await expect(liteVideo).toBeVisible()

    await liteVideo.getByRole('button').click()

    // now the iframe is there
    const iframe = await page.locator('article iframe')
    await expect(iframe).toHaveCount(1)
    const iframeSrc = await iframe.getAttribute('src')
    expect(iframeSrc).toBeDefined()
    expect(iframeSrc).toContain(videoid)
    expect(iframeSrc).toContain('youtube-nocookie.com')
  })
})

// @ts-check
import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test.describe('Home page', () => {
  // good smoke test that it built at all
  test('should have the correct H1 element', async ({ page }) => {
    await page.getByRole('heading', { name: 'Ahoy-hoy! I like to build web sites.' })
  })

  test('should have pre-rendered dithered images', async ({ page }) => {
    const asideImages = await page.getByTestId('aside-images')
    await asideImages.scrollIntoViewIfNeeded()

    const firstImage = await asideImages.getByRole('img').first()
    await expect(firstImage).toBeVisible()

    const naturalWidth = await firstImage.evaluate((img) => img.naturalWidth)
    await expect(naturalWidth).toBeGreaterThan(0)
  })

  test('should be able to navigate to /blog', async ({ page }) => {
    await page.getByRole('link', { name: 'Blog' }).click()

    // these are unique elements on the /blog page
    await page.getByRole('heading', { name: 'Latest posts' })
    await page.getByText('Looking for more?')
  })

  // at one point SvelteKit's router would try to process ALL links
  // so you had to flag certain ones with rel=external to make sure that didn't happen
  // that isn't really a problem anymore, but it's still good to have in the markup
  test('should have external links to social media', async ({ page }) => {
    const nav = page.getByRole('navigation')
    const instagramLinkRel = await nav.getByRole('link', { name: 'Instagram' }).getAttribute('rel')
    expect(instagramLinkRel).toBe('external')

    const twitterLinkRel = await nav.getByRole('link', { name: 'Twitter' }).getAttribute('rel')
    expect(twitterLinkRel).toBe('external')

    const githubLinkRel = await nav.getByRole('link', { name: 'GitHub' }).getAttribute('rel')
    expect(githubLinkRel).toBe('external')
  })

  // Sveltekit next.528 had an issue (in dev at least)
  // where you couldn't navigate back to the home page with the client-side router
  // without a 500 error
  // this makes sure that navigation works hunky-dory
  test('should be able to navigate away, then back to the home page', async ({ page }) => {
    await page.getByRole('link', { name: 'Contact' }).click()
    await page.getByLabel('Message')
    await page.getByRole('link', { name: 'Home' }).first().click()
    await page.getByRole('heading', { name: 'Ahoy-hoy! I like to build web sites.' })
  })

  // see #312
  // and https://github.com/leereamsnyder/leereamsnyder.com/commit/8259ffc813faad20c4e9067be8c1216e4507e04f
  // the 100vw on the main grid layout introduced horizontal scrollbars when there's a vertical one
  // b/c of 100vw not reducing itself when there's a scrollbar ( ._.)
  test('should not have a horizontal scroll bar', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(document.body.scrollWidth, 0))
    const scrollX = await page.evaluate(() => window.scrollX)
    // when you can scroll horizontally this is like 15ish on macOS
    expect(scrollX).toBe(0)
  })

  // sveltekit 193 introduced a bug where the scroll position of a page would not pop to 0
  // if you clicked a link
  test('should navigate back to the top of the page when clicking a link', async ({ page }) => {
    // /contact should be nice because there's no images; should be pretty speedy
    const wayDownLink = await page.getByRole('link', { name: 'Contact' })
    await wayDownLink.scrollIntoViewIfNeeded()
    await expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(0)
    await wayDownLink.click()

    await page.getByRole('heading', { name: 'Send me a message' })

    // https://playwright.dev/docs/test-assertions#retrying
    // this is how you "poll" something a few times
    await expect(async () => {
      const scrollY = await page.evaluate(() => window.scrollY)
      expect(scrollY).toBe(0)
    }).toPass()
  })

  test('should have SVG icons with battle-tested markup', async ({ page }) => {
    for (const svg of await page.locator('svg').all()) {
      // aria-hidden prevents SVGs from being treated as images in screen readers
      // (they're usually decorative)
      const ariaHidden = await svg.getAttribute('aria-hidden')
      expect(ariaHidden).toBe('true')

      // IE + Edge (for a while) liked to make SVGs focusable, which we don't really want
      const focusable = await svg.getAttribute('focusable')
      expect(focusable).toBe('false')
    }
  })

  // SvelteKit has the capability to detect certain files and preload them
  // and they've said it might be nice at some point to preload fonts
  // but I'm VERY fussy about how I'm preloading fonts and also I have a ton of them
  // so I'm detecting here that SvelteKit hasn't increased or possibly duplicated the fonts
  // getting preloaded
  test('should preload the correct number of high-priority font files', async ({ page }) => {
    await expect(await page.locator('link[rel="preload"][as="font"]')).toHaveCount(3)
  })
})

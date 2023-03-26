import { test, expect } from '@playwright/test'

// service Worker bits are experimental and only work in chromium right now, apparently
test.use({ browserName: 'chromium' })

test.describe('Netlify 404 and Offline pages', () => {
  // see https://github.com/leereamsnyder/leereamsnyder.com/issues/335
  //     https://github.com/leereamsnyder/leereamsnyder.com/issues/405
  //     https://github.com/leereamsnyder/leereamsnyder.com/issues/406
  // the 404.html file builds with relative links to js/css/service-worker
  // but if that file got served up as the 404 response to /whatever/does/not/exist
  // those relative links (which are fine at the root) are broken
  //
  // at one point I had a script to change the relative paths/attributes/imports to absolute
  // however now I have a Netlify Edge Function checking for */_app/whatever requests
  // and redirecting them to the "right" resource at /app/whatever
  test('should render root /404 page a-ok', async ({ page }) => {
    await page.goto('/404')

    expect(await page.getByRole('heading', { name: '404' })).toHaveCount(1)

    const anySvg = await page.locator('svg').first()
    await anySvg.scrollIntoViewIfNeeded()

    // little janky, but if CSS files didn't load, the SVGs will be HUUUUGE
    expect(await anySvg.evaluate((svg) => svg.clientWidth)).toBeLessThan(75)
  })

  // noted the same issue as 404s with the /offline page
  // which might get served up from anywhere if you lose connectivity
  // so the CSS/JS files need to be handled in the same manner
  test('should render root /offline page a-ok', async ({ page, context }) => {
    await page.goto('/offline')

    expect(await page.getByRole('heading', { name: 'offline' })).toHaveCount(1)

    const image = await page.getByTestId('offline-image').first()

    expect((await image.boundingBox()).height).toBeGreaterThan(0)

    // https://playwright.dev/docs/test-assertions#retrying
    // this is how you "poll" something a few times
    await expect(async () => {
      // here we're checking that the image loaded successfully
      const imgNaturalHeight = await image.evaluate((img) => img.naturalHeight)
      expect(imgNaturalHeight).toBeGreaterThan(0)
    }).toPass()

    const anySvg = await page.locator('svg').first()
    await anySvg.scrollIntoViewIfNeeded()

    // little janky, but if CSS files didn't load, the SVGs will be HUUUUGE
    await expect(await anySvg.evaluate((svg) => svg.clientWidth)).toBeLessThan(75)
  })

  test('should render deeper 404 pages a-ok', async ({ page, context }) => {
    page.on('response', (res) => {
      if (res.url().endsWith('/come/on/fhqwgads')) {
        expect(res.status()).toBe(404)
      }
    })

    await page.goto('/come/on/fhqwgads')

    // I briefly considered using Netlify edge functions to handle all rewrites
    // eg /blog/_app/something -> /_app/something
    // but that was getting invoked on root /_app/something requests even though the path was "*/_app/*"
    // so I abandoned thinking I could work with two wildcards
    for (const link of await page.locator('link[rel="stylesheet"]').all()) {
      const href = await link.getAttribute('href')

      expect(href.startsWith('./')).toBeFalsy()
      expect(href.startsWith('/')).toBeTruthy()
    }

    expect(await page.getByRole('heading', { name: '404' })).toHaveCount(1)

    const anySvg = await page.locator('svg').first()
    await anySvg.scrollIntoViewIfNeeded()

    // little janky, but if CSS files didn't load, the SVGs will be HUUUUGE
    await expect(await anySvg.evaluate((svg) => svg.clientWidth)).toBeLessThan(75)
  })

  test('should render deeper offline pages a-ok', async ({ page, context }) => {
    await context.setOffline(false)

    // service workers are scoped to directories based on where they're installed
    // so we have to start at a "valid" URL so the service worker gets installed correctly at the site root level
    page.goto('/')

    await context.waitForEvent('serviceworker')

    // this is how you wait for a service worker to get registered
    await page.evaluate(async () => {
      const registration = await window.navigator.serviceWorker.getRegistration()
      if (registration.active?.state === 'activated') return
      await new Promise((resolve) =>
        window.navigator.serviceWorker.addEventListener('controllerchange', resolve)
      )
    })

    await context.setOffline(true)

    await page.goto('/blog/whatever/pretty/deep/doesnt/matter')

    expect(await page.getByRole('heading', { name: 'offline' })).toHaveCount(1)

    // for the offline.html file, I really do need the references to be absolute
    // because even if Netlify is fixing /whatever/_app/* for the 404 page
    // (a practice I briefly considered, then rejected)
    // the offline page uhhhh obviously cannot make _new_ network requests
    // because—Hello, McFly!—you're offline!
    // so these _have_ to be the absolute /_app/ files that WILL be cached by the service worker
    for (const link of await page.locator('link[rel="stylesheet"]').all()) {
      const href = await link.getAttribute('href')

      expect(href.startsWith('./')).toBeFalsy()
      expect(href.startsWith('/')).toBeTruthy()
    }

    // uhhh so this is weird
    // because it seems like Chromium, even when the context is still "offline"
    // still tries to make network requests for css/js/etc files
    // and succeeds!!
    // like I can see them hitting the network at netlify dev!
    // wtf!
    // so this is maybe not the most reliable test here?
    // like I was seeing a clear difference in behavior between Chromium and regular Chrome on this

    const anySvg = await page.locator('svg').first()
    await anySvg.scrollIntoViewIfNeeded()

    // little janky, but if CSS files didn't load, the SVGs will be HUUUUGE
    expect(await anySvg.evaluate((svg) => svg.clientWidth)).toBeLessThan(75)

    await context.setOffline(false)
  })

  // ah, so THIS has been the source of all the /blog/_app/* 404s
  // if you have have a trailing slash, the relative link to '../_app/*' points to '/blog/_app/*'
  // hence, all the 404s
  // I currently have an Edge Function watching for these and rewriting
  // (this should become a simple _redirect line item)
  test('should render deeper /blog/something/ urls with a trailing slash ok', async ({ page }) => {
    await page.goto('/blog/im-now-on-mastodon/')

    const h1 = await page.getByRole('heading').first()

    // "kansas" (as in NewKansas) would only be there if the css loaded
    // this is a little brittle as it depends on the font stack, but it's _probably_(?) better than
    // these other tests where I'm looking at SVG width…
    // anyway yeah if the CSS 404s, you won't get this
    await expect(
      await h1.evaluate((el) => window.getComputedStyle(el).fontFamily.toLowerCase())
    ).toContain('kansas')

    // Also if the scripts loaded, I have a component that navigates you
    // to the url without the trailing slash
    // which I had clearly never tested on Netlify properly until now, apparently ¯\_(ツ)_/¯
    await page.waitForURL('/blog/im-now-on-mastodon')
  })

  // see #411
  // this is a quick-and-dirty test of the max-width interaction in BodyContent/Prose
  // I had set a max-width on .prose > *, and that overrode max-width: 100% on img elements, causing a scrollbar
  test('should not have a horizontal scroll bar at small widths', async ({ page, context }) => {
    await page.setViewportSize({ width: 320, height: 700 })
    await page.goto('/404')

    await page.evaluate(() => window.scrollTo(document.body.scrollWidth, 0))
    const scrollX = await page.evaluate(() => window.scrollX)

    await expect(scrollX).toBe(0)
  })

  // @todo could probably use a service worker offline functionality set of tests
  // but that's tricky b/c SvelteKit uses SPA navigation instead of initiating a full-page HTML request
  // see #405
})

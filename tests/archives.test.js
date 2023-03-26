import { expect, test } from '@playwright/test'

test.describe('Archives section', () => {
  // somewhere in the update from next.84 -> next.119, the sveltekit parser
  // for static output doesn't seem to catch href="" attributes on anchors unless
  // they're the very first attribute ¯\_(ツ)_/¯
  // if that happens, MANY pages weren't getting rendered
  //
  // in more recent versions, this is no longer the case
  // but it's good to test that the archives pages were picked up anyway
  test('should have monthly archive pages', async ({ page }) => {
    await page.goto('/archives')
    await page.getByRole('link', { name: '2021 March' }).click()
    const title = await page.getByRole('heading', { name: 'All posts from 2021 March' })

    await expect(title).toHaveCount(1)
  })

  // somewhere in the update to next.395, SvelteKit's adapter-static
  // stopped auto-generating the /archives/YYYY pages
  // which kinda makes some sense because I never _actually_ linked to them anywhere
  // and they were just assumed to maybe exist by the existence of deeper /archives/YYYY/MM pages
  // so I've added a link eg "Back to 2021" to the month pages
  // which gives some navigation to those
  // so they'll get picked up by the crawler
  test('should have yearly archive pages', async ({ page }) => {
    await page.goto('/archives/2021')
    await expect(await page.getByRole('heading', { name: '2021 Archives' })).toHaveCount(1)
  })

  // related to the above
  // this covers that an older article was definitely picked up by the static adapter
  // like, the parser might catch the newest 10–20 from the home page or blog
  // but the archives has everything
  test('should have a link to an older article', async ({ page }) => {
    await page.goto('/archives')
    await page.getByRole('link', { name: '2014 May' }).click()
    await page.getByRole('link', { name: 'Andrew W.K.' }).click()
    await expect(
      await page.getByRole('heading', { name: 'Andrew W.K. on negativity' })
    ).toHaveCount(1)
  })
})

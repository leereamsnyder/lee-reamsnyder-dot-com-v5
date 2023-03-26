import { expect, test } from '@playwright/test'

test.describe('Feeds', () => {
  test('JSON feed should not have links to localhost:5173', async ({ request }) => {
    const feed = await request.get('/feed.json')

    expect(feed.ok()).toBeTruthy()

    const json = await feed.json()
    const [item] = json.items
    const { id, url } = item

    expect(id).not.toContain('localhost:5173')
    expect(url).not.toContain('localhost:5173')
  })
})

/* global Response */
import { buildFeed } from '$lib/data/index'

export const prerender = true

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function GET({ params }) {
  const feed = await buildFeed()

  return new Response(feed.json1(), {
    headers: { 'content-type': 'application/json' },
  })
}

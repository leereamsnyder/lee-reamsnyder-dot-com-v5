import { json, error } from '@sveltejs/kit'
import { getContentForPathname } from '$lib/data'

export const prerender = true

/** @type {import('./$types').RequestHandler} */
export const GET = async ({ request, params, url }) => {
  const pageData = await getContentForPathname(`/blog/${params.slug}`)
  if (!pageData) {
    throw error(404, `Post not found for ${url.pathname}`)
  }

  const { title, description, hero, heroHeight, heroWidth } = pageData

  return json({ title, description, hero, heroHeight, heroWidth })
}

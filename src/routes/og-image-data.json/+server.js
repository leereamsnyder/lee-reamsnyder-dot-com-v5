import { json } from '@sveltejs/kit'

export const prerender = true

/** @type {import('./$types').RequestHandler} */
export const GET = async ({ request, params, url }) => {
  return json({
    title: 'Lee Reamsnyder',
    description: 'Professional DIVeloper',
  })
}

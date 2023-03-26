import { error } from '@sveltejs/kit'
import { getContentForPathname } from '$lib/data'
import markdownToHtml from '$lib/data/markdownToHtml'

/** @type {import('@sveltejs/kit').PageServerLoad} */
export async function load({ url, params }) {
  // @todo if it turns out you use only the blog entries as a source from markdown
  // you could simplify this lookup to use the params.slug and match by end of file name
  try {
    const content = await getContentForPathname(url.pathname, {
      lookUpPrevNext: true,
      prevNextFilter: ({ path }) => path.startsWith('/blog/'),
      prevNextSort: (a, b) => a.date - b.date,
    })

    if (content) {
      const { body, ...rest } = content
      const html = markdownToHtml(body)

      return {
        post: {
          ...rest,
          html,
        },
      }
    } else {
      throw error(500, `Not able to find post data for ${url.pathname}`)
    }
  } catch (e) {
    throw error(404, e.message)
  }
}

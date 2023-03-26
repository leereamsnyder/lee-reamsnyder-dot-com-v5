import markdownToHtml from '$lib/data/markdownToHtml'
import { getChildFiles } from '../../lib/data'

/** @type {import('./$types').PageServerLoad} */
export async function load() {
  const workFiles = await getChildFiles('/work', { limit: 0 })

  const entries = []
  for (const { body, ...rest } of workFiles) {
    entries.push({
      ...rest,
      html: markdownToHtml(body),
    })
  }

  return { entries }
}

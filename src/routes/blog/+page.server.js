import { getChildFiles } from '../../lib/data'

/** @type {import('./$types').PageServerLoad} */
export async function load() {
  const latestBlogPosts = await getChildFiles('/blog', { limit: 20 })

  const posts = []
  for (const { title, path, date, description, hero, heroWidth, heroHeight } of latestBlogPosts) {
    posts.push({
      title,
      path,
      date,
      description,
      hero,
      heroWidth,
      heroHeight,
    })
  }

  return { posts }
}

import { getChildFiles } from '../lib/data/index'

/** @type {import('./$types').PageServerLoad} */
export async function load() {
  const latestBlogPosts = await getChildFiles('/blog', { limit: 5 })
  const favoriteBlogPosts = await getChildFiles('/blog', {
    filter: (data) => data.favorite,
    limit: 4,
  })

  const posts = []
  for (const { title, path, date, description, favorite, hero, heroWidth, heroHeight } of [
    ...latestBlogPosts,
    ...favoriteBlogPosts,
  ]) {
    posts.push({
      title,
      path,
      date,
      description,
      favorite,
      hero,
      heroWidth,
      heroHeight,
    })
  }

  return { posts }
}

import { dev } from '$app/environment'
import getResponsiveImageAttributes from '$lib/utils/getResponsiveImageAttributes'
import absolutify from 'absolutify'
import { Feed } from 'feed'
import fm from 'front-matter'
import { DateTime } from 'luxon'
import { join } from 'path'
import readingTime from 'reading-time'
import slug from 'slug'
import markdownToHtml from './markdownToHtml'
import readAllGlob from './readAllGlob'

const cwd = process.cwd()

/**
 * strips out process.cwd and /content from a file path
 * @param {string} path
 * @return {string}
 */
function getRelativeContentPath(path) {
  return path.replace(join(cwd, 'content'), '')
}

async function readAllMarkdownFiles() {
  const rawFiles = await readAllGlob('content/**/*.md')
  return rawFiles.map(({ path, content }) => {
    return {
      content,
      path: getRelativeContentPath(path),
    }
  })
}

/**
 * @typedef ContentFileData
 * @property {string} path - The url path of the file, derived from the file's location and name
 * @property {string} url - The complete URL for this page
 * @property {string} body - The un-parsed markdown content of the file
 * @property {string} title - The title of the document
 * @property {boolean} titleUsesFancyWords - If the title has longish words, this is true
 * @property {Date} date - The date of the document as a JS Date. For blog posts, this comes from the file name
 * @property {string} readingTime - how long the document will take to read
 * @property {string} [description] - The description of the document
 * @property {string} [link] - An external URL to link to
 * @property {string} [hero] - The primary "hero" image for the document
 * @property {number} [heroWidth] - The raw pixel width of the hero image
 * @property {number} [heroHeight] - The raw pixel height of the hero image
 * @property {string} [heroSrcset] - A srcset attribute for responsive sizes
 * @property {string} [subtitle] - The title attribute for the hero image; put a little joke there!
 * @property {boolean} [favorite] - Some posts that I think have stood the test of time have been marked as a 'favorite'
 * @property {'Photography' | 'Article' | 'Movie' | 'Images' | 'Link' | 'Quote' | 'Text' | 'Music' | 'Project'} [category] - The legacy Tumblr-y document category
 * @property {string[]} [tags] - The list of tags for the document
 * @property {Modification[]} [modified] - A list of updates to the update since initial publication; used sparsely
 * @property {string} [notes] - personal notes about the document; especially why it is no longer published
 * @property {PreviousOrNextPost} [previous] - The previous post
 * @property {PreviousOrNextPost} [next] - The next post
 *
 * @typedef Modification
 * @property {string} changes - The description of the change
 * @property {Date} date - The date of the modification
 *
 * @typedef PreviousOrNextPost
 * @property {string} title - The title of the previous or next post
 * @property {string} path - the URL for the previous or next post
 */

/**
 * opens and parses metadata for all content files
 * and returns a list of processed file objects
 *
 * @return {Promise<ContentFileData[]>}
 */
async function getAllMarkdownDataFromDisk() {
  const files = await readAllMarkdownFiles()
  const data = []

  const host = process.env.URL || (dev ? 'http://localhost:5173' : 'https://www.leereamsnyder.com')

  for (let { content, path } of files) {
    const { attributes, body } = fm(content)

    const { draft, published, title, description, modified, hero } = attributes
    let titleUsesFancyWords = false

    if (draft) {
      // console.log('skipping draft', path)
      continue
    }
    if (published === false) {
      // console.log('skipping unpublished', path)
      continue
    }
    if (description && description.length > 150) {
      // console.warn(
      //   `The description for ${path} is too long. Keep it under 150 characters, if you can`
      // )
    }
    if (title && title.length > 55) {
      // console.warn(`keep the title for ${path} under 55 characters`)
    }

    if (title.split(' ').some((word) => word.length > 10)) {
      // console.warn('big words detected', {title, path})
      titleUsesFancyWords = true
    }

    // if (/[\(\)\"“]/g.test(title)) {
    //   console.warn(
    //     'Heads up! Your title contains characters that sometimes break weirdly in the Satori SVG -> png OG cards',
    //     { title, path }
    //   )
    // }

    let date = attributes.date
    if (date) {
      date = fixFrontMatterDate(date)
    } else {
      const [dateInFilename] = path.match(/\d{4}-\d{2}-\d{2}/) || []
      if (dateInFilename) {
        path = path.replace(`${dateInFilename}-`, '')
        date = DateTime.fromISO(dateInFilename)
          // see #243
          // using midnight as the publish time doesn't make much logical sense
          // and you end up with it being very possible that the dates will change between server-render and client-render
          // noon makes more logical sense as a published time
          .set({ hour: 12 })
          .toJSDate()
      } else {
        // fall back to "now" just so everything has SOME date
        date = new Date()
      }
    }

    const readingTimeStats = readingTime(body)

    path = path.replace(/\.md$/, '')
    const fileName = path.split('/').pop()
    const urlSafeFilename = slug(fileName)
    if (fileName !== urlSafeFilename) {
      console.log('🚨URL-unsafe file name', {
        path,
        fileName,
        suggestedUpdate: urlSafeFilename,
      })
    }
    const url = `${host}${path}`

    let heroWidth
    let heroHeight
    let heroSrcset
    if (hero) {
      // don't need a calculated "sizes" attribute for the srcset
      // as that'll just be "100vw" for these
      const { height, width, srcset } = getResponsiveImageAttributes(hero)
      heroWidth = width
      heroHeight = height
      heroSrcset = srcset
    }

    data.push({
      ...attributes,
      path,
      url,
      title,
      titleUsesFancyWords,
      description,
      body,
      date,
      hero,
      heroWidth,
      heroHeight,
      heroSrcset,
      readingTime: Math.ceil(readingTimeStats.minutes),
      modified: modified?.map(({ date, ...rest }) => {
        return { ...rest, date: fixFrontMatterDate(date) }
      }),
    })
  }

  return data
}

// preload all the content data once
const cachedMarkdownData = getAllMarkdownDataFromDisk()

/**
 * in dev mode, reads the latest markdown files from disk every time
 * in prod mode, serves up a cached response
 * returns a list of processed file objects
 *
 * @return {Promise<ContentFileData[]>}
 */
async function getAllMarkdownData() {
  if (dev) {
    return getAllMarkdownDataFromDisk()
  } else {
    return cachedMarkdownData
  }
}

/**
 * get the children documents given a path of the parent eg "/blog"
 *
 * @param {string} parentPath - parent path eg "/blog"
 * @param {GetChildFilesOptions} [options] - options
 *
 * @typedef GetChildFilesOptions
 * @property {function(ContentFileData): boolean} [filter] - optional function to further filter files before sorting and limiting
 * @property {function(ContentFileData, ContentFileData): number} [sort] - how to sort the filtered files. defaults to by date, newest first
 * @property {number} [limit] - how many files to return; defaults to 20
 */
export async function getChildFiles(
  parentPath,
  { filter, sort = (a, b) => b.date - a.date, limit = 20 } = {}
) {
  const allFiles = await getAllMarkdownData()

  let childFiles = allFiles.filter(({ path }) =>
    // note trailing slash to avoid loading parentPath index file
    path.startsWith(`${parentPath}/`)
  )

  if (filter) {
    childFiles = childFiles.filter(filter)
  }

  // @todo a nicer API here might be sortBy eg "date" and sortDirection eg "ASC" | "DESC"
  if (sort) {
    childFiles = childFiles.sort(sort)
  }

  if (limit) {
    childFiles = childFiles.slice(0, limit)
  }

  return childFiles
}

/**
 * get a single file's data, given the path for the file (eg "/blog/the-medium-place")
 *
 * @param {string} pathname
 * @param {GetContentForPathnameOptions} [options] - options
 *
 * @typedef GetContentForPathnameOptions
 * @property {boolean} [lookUpPrevNext] - whether to look up prev/next data
 * @property {function(ContentFileData): boolean} [prevNextFilter] - how to filter all files for prev/next
 * @property {function(ContentFileData, ContentFileData): number} [prevNextSort] - how to sort the filtered files
 */
export async function getContentForPathname(
  pathname,
  { lookUpPrevNext, prevNextFilter, prevNextSort } = {
    lookUpPrevNext: false,
    prevNextFilter: () => true,
    prevNextSort: () => 0,
  }
) {
  const allFiles = await getAllMarkdownData()
  if (lookUpPrevNext) {
    const allPosts = allFiles.filter(prevNextFilter).sort(prevNextSort)

    const currentContentIndex = allPosts.findIndex((file) => file.path === pathname)
    const content = allPosts[currentContentIndex]
    const previous = allPosts[currentContentIndex - 1]
    if (previous) {
      const { title, path } = previous
      content.previous = { title, path }
    }
    const next = allPosts[currentContentIndex + 1]
    if (next) {
      const { title, path } = next
      content.next = { title, path }
    }

    return content
  } else {
    return allFiles.find((file) => file.path === pathname)
  }
}

export async function buildFeed() {
  const siteUrl = 'https://www.leereamsnyder.com'
  const latestBlogPosts = await getChildFiles('/blog', { limit: 20 })

  const feed = new Feed({
    title: 'Lee Reamsnyder | Feed',
    description: 'The blog and portfolio for Lee J. Reamsnyder',
    siteUrl,
    author: {
      name: 'Lee J. Reamsnyder',
      email: 'lee@leereamsnyder.com',
      link: 'https://www.leereamsnyder.com/',
    },
    id: siteUrl,
    link: siteUrl,
    feedLinks: {
      rss: `${siteUrl}/rss.xml`,
      json: `${siteUrl}/feed.json`,
    },
    copyright: `Copyright 2006–${new Date().getFullYear()} Lee J. Reamsnyder`,
  })

  for (const { title, url, date, link, description, body } of latestBlogPosts) {
    feed.addItem({
      title,
      date,
      url,
      description,
      content: absolutify(markdownToHtml(body), siteUrl),
      link: link || url,
      id: url,
      guid: url,
    })
  }

  return feed
}

/**
 * if a front-matter "date" property doesn't have a time, these end up midnight UTC
 * which ends up being 1 day off when converted to local time
 *
 * @param {Date} date
 * @return {Date}
 */
function fixFrontMatterDate(date) {
  if (date.getUTCHours() === 0 && date.getUTCMinutes() === 0 && date.getUTCSeconds() === 0) {
    // luxon can take an ISO date "YYYY-MM-DD" and will by default
    // set that to that date, midnight LOCAL time
    date = DateTime.fromISO(date.toISOString().substr(0, 10))
      // then we set it to noon local time, which makes more sense as a published time
      .set({ hour: 12 })
      .toJSDate()
  }
  return date
}

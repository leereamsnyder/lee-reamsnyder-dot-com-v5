import { OPTIMIZED_IMAGE_PREFIX } from '$lib/Env'
import getResponsiveImageAttributes from '$lib/utils/getResponsiveImageAttributes'
import hljs from 'highlight.js'
import { Remarkable } from 'remarkable'
import { linkify } from 'remarkable/dist/cjs/linkify.js'
import { Plugin as RemarkablySimpleTags } from 'remarkably-simple-tags'

const rst = new RemarkablySimpleTags()
// replaces {@youtube:ID LABEL} with <lite-youtube> custom component
rst.register('youtube', (params) => {
  const [videoId, label] = params
  return `<lite-youtube videoid="${videoId}"${label ? ` playlabel="${label}"` : ''}></lite-youtube>`
})

const renderer = new Remarkable({
  html: true,
  typographer: true,
  highlight: function (code, language) {
    if (language && hljs.getLanguage(language)) {
      try {
        return hljs.highlight(code, { language }).value
      } catch (err) {
        console.error('failed to highlight', { language, code, err })
      }
    }

    try {
      return hljs.highlightAuto(code).value
    } catch (err) {
      console.error('failed to highlightAuto', { code, err })
    }

    return '' // use external default escaping
  },
})
  .use(
    headerLinks({
      levels: [2, 3],
    })
  )
  .use(linkify)
  .use(rst.hook)
  .use(cloudinaryReroutedImages)

/**
 * converts markdown strings to HTML strings
 * @param {string} md - the markdown source string
 * @return {string} the HTML from source
 */
export default function markdownToHtml(md) {
  return renderer.render(md)
}

/*
  custom accessible header anchors
  strongly influenced by https://amberwilson.co.uk/blog/are-your-anchor-links-accessible/
*/
function headerLinks(options) {
  const appliedOptions = {
    levels: [1, 2, 3, 4, 5, 6],
    anchorClassName: 'header-anchor',
    ...options,
  }

  return function (remarkable) {
    const originalOpen = remarkable.renderer.rules.heading_open
    remarkable.renderer.rules.heading_open = function (tokens, idx) {
      const { hLevel } = tokens[idx]

      // Only anchorize supported header levels
      // the extra span seems necessary for Safari reader mode
      // if you have links in headers, they disappear
      // but then having a span around the content seems to clue Safari back in to grab it
      // ¯\_(ツ)_/¯
      if (appliedOptions.levels.indexOf(hLevel) !== -1) {
        const { content } = tokens[idx + 1]
        const slug = slugify(content)
        const id = `${slug}`
        const href = `#${slug}`

        return `<h${hLevel} id="${id}"><a href="${href}" class="${appliedOptions.anchorClassName}"><span>`
      }

      return originalOpen(tokens, idx)
    }

    const originalClose = remarkable.renderer.rules.heading_close
    remarkable.renderer.rules.heading_close = function (tokens, idx) {
      const { hLevel } = tokens[idx]

      // Only anchorize supported header levels
      if (appliedOptions.levels.indexOf(hLevel) !== -1) {
        return `</span></a></h${hLevel}>`
      }

      return originalClose(tokens, idx)
    }
  }
}

// Marked.js Slugger: https://github.com/markedjs/marked/blob/master/src/Slugger.js
class Slugger {
  constructor() {
    this.seen = {}
  }

  /**
   * Convert string to unique id
   */
  slug(value) {
    let slug = value
      .toLowerCase()
      .trim()
      .replace(/[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,./:;<=>?@[\]^`{|}~]/g, '')
      .replace(/\s/g, '-')

    if (Object.prototype.hasOwnProperty.call(this.seen, slug)) {
      const originalSlug = slug
      do {
        this.seen[originalSlug]++
        slug = originalSlug + '-' + this.seen[originalSlug]
      } while (Object.prototype.hasOwnProperty.call(this.seen, slug))
    }
    this.seen[slug] = 0

    return slug
  }
}

function slugify(str) {
  return new Slugger().slug(str)
}

function cloudinaryReroutedImages(remarkable) {
  const originalImageRule = remarkable.renderer.rules.image
  remarkable.renderer.rules.image = (tokens, i, opt, env) => {
    const { src, title, alt } = tokens[i]
    // only working with root-relative images
    // this makes sure external ones don't get processed
    if (src.startsWith('/')) {
      const { width, height, srcset, sizes } = getResponsiveImageAttributes(src)

      const cloudinaryOptimizedSrc = `${OPTIMIZED_IMAGE_PREFIX}${src}`

      const newImg = `<img src="${cloudinaryOptimizedSrc}" loading="lazy" width="${width}" height="${height}" alt="${alt}"${
        title ? ` title="${title}"` : ''
      }${srcset ? ` srcset="${srcset}" sizes="${sizes}"` : ''}>`

      return newImg
    } else {
      return originalImageRule(tokens, i, opt, env)
    }
  }
}

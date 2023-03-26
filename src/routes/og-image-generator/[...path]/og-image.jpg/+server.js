/* global Response */
import { Resvg } from '@resvg/resvg-js'
import { error } from '@sveltejs/kit'
import { readFileSync } from 'fs'
import satori from 'satori'
import { html as toReactNode } from 'satori-html'
import sharp from 'sharp'
import OgCard from './OgCard.svelte'

export const prerender = true

// Initial inspiration from https://geoffrich.net/posts/svelte-social-image/

// https://blog.hootsuite.com/social-media-image-sizes-guide/#Quick_social_media_image_sizes
const height = 630
const width = 1200

// we need to load the logo image as a Buffer; more on that later
const logo = readFileSync(`${process.cwd()}/src/lib/assets/plane-logo@1x.png`)

// satori needs fonts to render anything, and it can work with a Buffer from fs
const newKansasBlack = readFileSync(
  `${process.cwd()}/src/lib/assets/fonts/kansasnew-black-webfont.woff`
)
const concourseRegular = readFileSync(
  `${process.cwd()}/src/lib/assets/fonts/concourse_t4_regular.woff`
)
const concourseSmallCaps = readFileSync(
  `${process.cwd()}/src/lib/assets/fonts/concourse_c4_regular.woff`
)

/** @type {import('./$types').RequestHandler} */
export const GET = async ({ request, params, fetch }) => {
  const { path } = params

  // pages where you want to pre-generate an og:image file
  // must have a dedicated ${path}/og-image-data.json server route
  //
  // this appears to be the only way to make adapter-static happy
  // as EVERYTHING has to be pre-renderable
  const dataPath = `${path === '' ? '' : '/'}${path}/og-image-data.json`

  console.log('Building Social Media Image', { path, dataPath })

  const response = await fetch(dataPath, {
    headers: {
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    throw error(response.status, `Error retrieving page data at ${dataPath}`)
  }

  const data = await response.json()

  const { title, description, hero, heroHeight, heroWidth } = data

  // ok so images
  // Satori _can_ fetch images (eg src={`${url.origin}${hero}`})
  // but it uses global.fetch
  // and unfortunately during a SvelteKit build + prerender
  // using global.fetch is a no-no; you're supposed to use SvelteKit’s event.fetch
  // BUT I am clever and remembered that you can encode an image as a base46 string
  // so here we're loading images from the file system with sharp
  // and then converting them to a base64 string
  let heroBase64
  if (hero) {
    // load file from location in static directory
    const heroJpg = await sharp(`${process.cwd()}/static${hero}`)
      .resize(null, 550, { withoutEnlargement: true }) // resize to max possible height; this makes subsequent actions much faster
      .jpeg({ quality: 40 }) // force to jpeg + kinda trash quality; it's good enough for this and makes the base64 string much smaller
      .toBuffer()

    // h/t https://github.com/lovell/sharp/issues/1337
    heroBase64 = `data:image/jpg;base64,${heroJpg.toString('base64')}`
  }

  // populate your OgCard svelte component and render to an html string
  // note: Satori only works with a subset of CSS and styles have to be inline'd
  const result = OgCard.render({
    title,
    description,
    heroHeight,
    heroWidth,
    hero: heroBase64 ?? undefined,
    // as with the hero images, the logo needs to be base64'd
    // so we don't do any fetch() requests during the build script
    logo: `data:image/png;base64,${logo.toString('base64')}`,
  })

  // satori needs a React representation of the html to work
  // thankfully satori-html does just that
  // Geoff's article indicated that this could work with Svelte's output CSS
  // in a <style> tag but that didn't work for me here…
  const element = toReactNode(`${result.html}<style>${result.css.code}</style>`)

  // this renders the react tree as an SVG
  const svg = await satori(element, {
    fonts: [
      {
        name: 'ConcourseCaps',
        weight: 400,
        style: 'normal',
        data: concourseSmallCaps,
      },
      {
        name: 'Concourse',
        weight: 400,
        style: 'normal',
        data: concourseRegular,
      },
      {
        name: 'NewKansas',
        weight: 900,
        style: 'normal',
        data: newKansasBlack,
      },
    ],
    height,
    width,
  })

  // and this takes the SVG and converts it to a png
  const resvg = new Resvg(svg, {
    fitTo: {
      mode: 'width',
      value: width,
    },
  })
  const png = resvg.render().asPng()

  // the png files are pretty massive tho (like 400kb+)
  // so let's convert from png to jpg
  // which tend to be closer to like 70kb
  const jpg = sharp(png).jpeg({ quality: 70, progressive: true })

  return new Response(jpg, {
    headers: {
      'content-type': 'image/jpg',
    },
  })
}

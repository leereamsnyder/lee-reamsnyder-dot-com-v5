/* global Response */
import canvas from 'canvas'
import canvasDither from 'canvas-dither'
const { createCanvas, loadImage } = canvas
const { atkinson } = canvasDither

export const prerender = true

/** @type {import('./$types').RequestHandler} */
export async function GET({ params, host }) {
  const [outputWidth, ...imagePathParts] = params.parts.split('/')
  const imageFilePath = imagePathParts.join('/')

  const img = await loadImage(`static/${imageFilePath}`)
  const aspectRatio = img.width / img.height
  const width = parseInt(outputWidth, 10)
  const height = width / aspectRatio

  const canvas = createCanvas(width, height)
  const context = canvas.getContext('2d')
  context.drawImage(img, 0, 0, width, height)

  const imageData = context.getImageData(0, 0, width, height)
  const dithered = atkinson(imageData)
  context.putImageData(dithered, 0, 0)

  const buffer = canvas.toBuffer('image/png', {
    compressionLevel: 9,
  })

  return new Response(buffer, {
    headers: {
      'Content-Type': 'image/png',
      'cache-control': 'no-store',
    },
  })
}

import imageSize from 'image-size'
import { join } from 'path'
import { dev } from '$app/environment'
import { RESIZED_IMAGE_PREFIX } from '$lib/Env'

// instead of getting too clever with math, a bunch of multiples of 256 and 320 seems like
// it covers a bunch of common screen sizes
// as of 2021-06-03 the largest image I have is 2484px
const stockSizes = [256, 320, 512, 640, 768, 960, 1024, 1280, 1600, 1920, 2048, 2240, 2560]

export default function getResponsiveImageAttributes(src) {
  const { width, height } = imageSize(join('static', src))

  let srcset
  let sizes
  if (!dev && RESIZED_IMAGE_PREFIX) {
    const imageSizes = []
    for (const w of stockSizes) {
      // add every stockSize that's reasonably smaller than the max width
      // the 128px buffer is to avoid silliness like a [..., 960, 971] jump
      if (width - w > 128) {
        imageSizes.push(w)
      }
    }
    // get the original size too
    imageSizes.push(width)

    srcset = imageSizes.map((w) => `${RESIZED_IMAGE_PREFIX}/${w}${src} ${w}w`).join(', ')

    // so in the current layout, up to 32rem is basically full-width with some padding
    // and above that, most everything is capped at a max-width of 27em
    sizes = '(max-width: 32rem) 96vw, 27em'

    if (src.includes('/figures/')) {
      // don't overthink this it's full-width minus "some" for padding
      sizes = '97vw'
    }
  }

  return { width, height, srcset, sizes }
}

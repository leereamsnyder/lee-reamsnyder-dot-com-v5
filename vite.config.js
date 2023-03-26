import { sveltekit } from '@sveltejs/kit/vite'

/** @type {import('vite').UserConfig} */
const config = {
  plugins: [sveltekit()],
  define: {
    'process.env.URL': JSON.stringify(process.env.URL),
    'process.env.OPTIMIZED_IMAGE_PREFIX': JSON.stringify(process.env.OPTIMIZED_IMAGE_PREFIX),
    'process.env.RESIZED_IMAGE_PREFIX': JSON.stringify(process.env.RESIZED_IMAGE_PREFIX),
  },
}

export default config

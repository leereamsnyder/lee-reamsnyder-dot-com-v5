import { dev } from '$app/environment'

export const URL = dev ? 'http://localhost:5173' : process.env.URL
export const PRODUCTION_URL = process.env.URL ?? 'https://www.leereamsnyder.com'
export const OPTIMIZED_IMAGE_PREFIX = dev ? '' : process.env.OPTIMIZED_IMAGE_PREFIX ?? ''
export const RESIZED_IMAGE_PREFIX = dev ? '' : process.env.RESIZED_IMAGE_PREFIX ?? ''

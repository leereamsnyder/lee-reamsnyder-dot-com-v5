import { promisify } from 'util'
import callbackGlob from 'glob'
import { promises as fs } from 'fs'
import { join } from 'path'

const glob = promisify(callbackGlob)
const cwd = process.cwd()

export default async function readAllGlob(pattern) {
  const globs = await glob(join(cwd, pattern))
  return Promise.all(
    globs.map(async (path) => {
      const content = await fs.readFile(path, 'utf-8')
      return { path, content }
    })
  )
}

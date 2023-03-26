import { readFileSync, writeFileSync } from 'fs'

// see #335
// both of these files get built with relative links to css/js
// eg <link href="./_app/immutable/assets/_layout-5b397f01.css" rel="stylesheet">
// those hrefs are accurate when you are at the site root
// but the content of these pages gets served up when you're deeper in the site
// either as the 404 page, or if you've lost connectivity
// so if your url is /something/deeper, those relative links are wrong
// so what we're doing here is making those links absolute
const paths = ['./build/404.html', './build/offline.html']

for (const path of paths) {
  const file = readFileSync(path, { encoding: 'utf-8' })

  // I get the feeling this is NOT the best way to handle this…
  const updatedFile = file
    .replace(/"\.(\/_app\/)/g, '"$1') // all the link href="./_app/"
    .replace('./service-worker', '/service-worker') // also the service-worker.js path

  writeFileSync(path, updatedFile, { encoding: 'utf-8' })

  console.log(`🚑 🚑 🚑 🚑 ${path} fixed! 🚑 🚑 🚑 🚑\n`)
}

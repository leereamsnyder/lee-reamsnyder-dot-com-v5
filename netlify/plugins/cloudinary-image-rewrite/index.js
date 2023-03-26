const { join } = require('path')
const { appendFileSync, readFileSync, existsSync } = require('fs')

let url
const autoOptimizedPath = 'cloudinary-auto-optimized'
const resizedPath = 'cloudinary-resized-n-optimized'

module.exports = {
  onPreBuild({ inputs, constants }) {
    const { IS_LOCAL } = constants

    let optimizedImagePrefix
    let resizedImagePrefix

    if (IS_LOCAL) {
      console.log('local build detected')
      optimizedImagePrefix = ''
      resizedImagePrefix = ''
    } else {
      if (process.env.CONTEXT === 'production') {
        console.log('detected that this was a production deploy')
        console.log('using production site URL', process.env.URL)
        url = process.env.URL
      } else {
        // this is an executive decision: DEPLOY_URL will change on every commit
        // so you'll always be getting fresh files on previews, especially if you change them
        // but will generate a bunch of extra duplicate media uploads that I _probably_ don't need
        // if I'm super worried about that I guess I go into cloudinary and delete them
        console.log('detected this was a branch or preview deploy')
        console.log('using DEPLOY_PRIME_URL', process.env.DEPLOY_PRIME_URL)
        url = process.env.DEPLOY_PRIME_URL
      }
      optimizedImagePrefix = `${url}/${autoOptimizedPath}`
      resizedImagePrefix = `${url}/${resizedPath}`
    }

    console.log(`expanding process.env with OPTIMIZED_IMAGE_PREFIX = "${optimizedImagePrefix}"`)
    process.env.OPTIMIZED_IMAGE_PREFIX = optimizedImagePrefix

    console.log(`expanding process.env with RESIZED_IMAGE_PREFIX = "${resizedImagePrefix}"`)
    process.env.RESIZED_IMAGE_PREFIX = resizedImagePrefix
  },

  onPostBuild({ inputs, constants, netlifyConfig, packageJson }) {
    const { IS_LOCAL } = constants

    let redirect
    if (IS_LOCAL) {
      console.log('local build detected. putting in a failsafe rewrite')
      // on the off-chance that you end up with URLs that point to the netlify dev server
      // this will shoot them right back to their original static locations
      redirect = `# rewrite optimized image urls back to the original file (because cloudinary can't see localhost files)
/${autoOptimizedPath}/*  /:splat  200
/${resizedPath}/:width/*  /:splat  200`
    } else {
      console.log('Netlify build detected. Adding cloudinary rewrite')
      redirect = `# rewrite to automatically optimize images on cloudinary
/${autoOptimizedPath}/*  https://res.cloudinary.com/<your cloudinary username here>/image/fetch/q_auto,f_auto/${url}/:splat  200
/${resizedPath}/:width/*  https://res.cloudinary.com/<your cloudinary username here>/image/fetch/q_auto,f_auto,w_:width/${url}/:splat  200`
    }

    console.log('appending this: ')
    console.log('---')
    console.log(redirect)
    console.log('---')

    const redirectsFile = join(netlifyConfig.build.publish, '_redirects')
    console.log('looking to augment _redirects file:', redirectsFile)

    if (!existsSync(redirectsFile)) {
      console.log('_redirects file did not exist in the build directory')
      return
    }

    appendFileSync(redirectsFile, '\n\n' + redirect + '\n')

    console.log('new _redirects file:')
    console.log('')
    console.log(readFileSync(redirectsFile, 'utf8'))
  },
}

import type { Context, Config } from 'https://edge.netlify.com'

export default (request: Request, context: Context) => {
  const { url, headers } = request
  const referer = headers.get('referer')

  const { pathname } = new URL(url)

  console.log('bum request incoming', { pathname, referer, agent: headers.get('user-agent') })

  // look for anything before and including "/_app/", and replace that with just "/_app/"
  // this is overkill for just /blog/ but if some other or deeper path shows up I'm covered
  const fixedPathname = pathname.replace(/.*?\/_app\//, '/_app/')
  console.log('updated pathname to (hopefully) root', { pathname, fixedPathname })

  return context.rewrite(fixedPathname)
}

export const config: Config = {
  // @todo this could be a _redirect and eventually should be
  // but an Edge Function lets me inspect the request and log something
  // so maybe I can get some insights there
  //
  // also note to self it seemed briefly like two * worked here
  // like "*/_app/*" but it still caught requests at "/_app/*"… I'm guessing they ignore everything before a "/"
  path: '/blog/_app/*',
}

## What is this?

This is the source code to build https://www.leereamsnyder.com.

It is currently a [SvelteKit](https://kit.svelte.dev) application. The build process outputs static HTML, but I use Netlify functions for some functionality like generating dynamic "OG" social media preview images or handling rewrites to Cloudinary.

## Installation

1. You need `node` 16+: `brew install node`
1. This package uses `node-canvas` which has a bunch of additional requirements. [See here for the latest](https://www.npmjs.com/package/canvas), but as of this writing I had to: `brew install pkg-config cairo pango libpng jpeg giflib librsvg`
1. Run `npm install`

## Development

1. Run `npm run dev` to start up the SvelteKit server. Typically you’ll be up and running at `http://localhost:5173`

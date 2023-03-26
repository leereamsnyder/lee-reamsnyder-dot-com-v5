<script>
  import { onMount } from 'svelte'
  // In the static build output, a static server might serve eg /blog/index.html from /blog/ or /blog
  // but I'd prefer to not have the trailing slash and Netlify's "pretty URLs" does the opposite of what I'd like
  // technically I should also look for '/blog/index.html' but nahh
  // and a rel="canonical" handles things for SEO…
  onMount(() => {
    const { pathname, href } = location
    if (pathname !== '/' && pathname.endsWith('/')) {
      window.location = href.slice(0, -1)
    }
  })
</script>

<script>
  import { page } from '$app/stores'
  import { PRODUCTION_URL } from '$lib/Env'
  export let title
  export let description = undefined
  export let generateOgImage = false

  let socialImageData
  let socialImagePath
  let socialImageUrl
  $: {
    socialImageData = `${$page.url.pathname === '/' ? '' : $page.url.pathname}/og-image-data.json`
    socialImagePath = `/og-image-generator${
      $page.url.pathname === '/' ? '' : $page.url.pathname
    }/og-image.jpg`
    // og:image urls must be full URLs, not just paths
    socialImageUrl = `${PRODUCTION_URL}${socialImagePath}`
  }
</script>

<svelte:head>
  <!-- https://css-tricks.com/essential-meta-tags-social-media/ -->
  {#if generateOgImage}
    <meta property="og:image" content={socialImageUrl} />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />

    <link rel="og-image-data-for-prerender" href={socialImageData} />
    <link rel="og-image-for-prerender" href={socialImagePath} />
  {/if}

  <meta property="og:title" content={title} />

  <!-- Facebook sometimes uses this -->
  <meta property="og:site_name" content="Lee’s cool site" />

  <meta property="og:url" content={`${PRODUCTION_URL}${$page.url.pathname}`} />
  {#if description}
    <meta property="og:description" name="description" content={description} />
  {/if}
  <meta name="twitter:creator" content="@leereamsnyder" />
  <meta name="twitter:card" content={generateOgImage ? 'summary_large_image' : 'summary'} />

  <meta name="author" content="Lee Reamsnyder" />

  <!-- use hard-coded canonical url. don't want this changing with deploys -->
  <link rel="canonical" href="https://www.leereamsnyder.com{$page.url.pathname}" />
</svelte:head>

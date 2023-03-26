<script>
  import { dev } from '$app/environment'
  import { page } from '$app/stores'
  import HtmlTitle from '$lib/components/HtmlTitle.svelte'
  import PageMargin from '$lib/components/PageMargin.svelte'
  import BigHonkinPageTitle from '$lib/components/BigHonkinPageTitle.svelte'
  import BodyContent from '$lib/components/BodyContent.svelte'
  import errorImgSrc from '$lib/assets/error.jpg'

  // this is solely for the /routes/404.svelte file
  // to output a /404.html file with the correct-looking status
  // because in that case $page.status is a 200 because the route DOES exist
  export let status = undefined
</script>

<HtmlTitle title="Error" />
<svelte:head>
  <meta name="robots" content="noindex,noimageindex" />
</svelte:head>

<PageMargin>
  <BigHonkinPageTitle isEntryTitle={false}>Error: {status ?? $page.status}</BigHonkinPageTitle>
</PageMargin>

<BodyContent>
  <img src={errorImgSrc} alt="" />
  <p>Something has gone horribly wrong. A few things to maybe set it right:</p>

  <ul>
    <li>
      You might be offline or having network trouble. Give a refresh a shot when you’re back online.
    </li>
    <li>Start over <a href="/">on the home page</a>, perhaps?</li>
    <li>There's a search form towards the end of the page that you can try.</li>
    <li>Give me <a href="/contact">an earful</a>.</li>
    <li>Explore the <a href="/archives">archives</a>?</li>
    <li>
      I hate to bring it up, but you didn’t try to type something funky in your address bar, did
      you? It happens!
    </li>
  </ul>

  {#if dev && $page.error}
    <p>ERROR MESSAGE: {$page.error.message}</p>
    <pre><code>{$page.error.stack}</code></pre>
  {/if}
</BodyContent>

<script>
  // lite-youtube-embed Web component
  import BigHonkinPageTitle from '$lib/components/BigHonkinPageTitle.svelte'
  import BodyContent from '$lib/components/BodyContent.svelte'
  import DisplayDate from '$lib/components/DisplayDate.svelte'
  import HtmlTitle from '$lib/components/HtmlTitle.svelte'
  import PageMargin from '$lib/components/PageMargin.svelte'
  import PreviousAndNextPosts from '$lib/components/PreviousAndNextPosts.svelte'
  import ResponsiveVideoEmbeds from '$lib/components/ResponsiveVideoEmbeds.svelte'
  import SocialMediaMeta from '$lib/components/SocialMediaMeta.svelte'
  import Symbolicons from '$lib/components/Symbolicons.svelte'
  import { OPTIMIZED_IMAGE_PREFIX } from '$lib/Env'
  import 'lite-youtube-embed/src/lite-yt-embed.css'
  import { onMount } from 'svelte'

  /** @type {import('./$types').PageData} */
  export let data
  $: ({ post } = data)

  $: generateOgImage = post.favorite || new Date().getFullYear() - post.date.getFullYear() <= 5

  onMount(() => {
    import('lite-youtube-embed/src/lite-yt-embed')
  })
</script>

<HtmlTitle title={post.title} />
<SocialMediaMeta title={post.title} description={post.description} {generateOgImage} />

<svelte:head>
  <meta property="og:type" content="article" />
</svelte:head>

<article class="h-entry" itemscope itemtype="https://schema.org/BlogPosting">
  {#if post.hero}
    <img
      itemprop="image"
      class="hero u-featured"
      src={OPTIMIZED_IMAGE_PREFIX + post.hero}
      alt=""
      width={post.heroWidth}
      height={post.heroHeight}
      title={post.subtitle}
      srcset={post.heroSrcset}
      sizes={post.heroSrcset ? '100vw' : undefined}
    />
  {/if}

  <PageMargin>
    <BigHonkinPageTitle enshrinken={post.titleUsesFancyWords} href={post.link}>
      <!-- 
        id="headline" I snatched from nytimes.com;
        seems like it helps Safari reader, which is sometimes thrown when the h1 has a link
      -->
      <span id="headline">{post.title}</span>
    </BigHonkinPageTitle>

    <span class="post-meta monospace">
      {#if post.date}
        <DisplayDate date={post.date} />
      {/if}
      <span class="reading-time">
        {post.readingTime} min read
      </span>
    </span>
    <span class="a11y"
      >Published by <span itemprop="author" itemscope itemtype="https://schema.org/Person">
        <a rel="author" class="p-author h-card" href="https://www.leereamsnyder.com" itemprop="url"
          ><span itemprop="name">
            <span itemprop="givenName">Lee</span>
            <span itemprop="familyName">Reamsnyder</span>
          </span>
        </a>
      </span>
      <a href={`https://www.leereamsnyder.com${post.path}`} class="u-url u-uid">Permalink</a>
    </span>
  </PageMargin>

  <ResponsiveVideoEmbeds>
    <BodyContent>
      {@html post.html}

      <div aria-hidden="true" class="fin">
        <span />

        <div class="fin-icon">
          <Symbolicons fill="currentColor" icon="code" />
        </div>

        <span />
      </div>
    </BodyContent>
  </ResponsiveVideoEmbeds>
</article>

<div class="prev-next">
  <PreviousAndNextPosts previous={post.previous} next={post.next} />
</div>

<style>
  .hero {
    display: block;
    max-width: 100%;
    height: auto;
    margin-bottom: var(--step-0);
  }

  .post-meta {
    display: grid;
    grid-template-columns: repeat(2, max-content);
    gap: var(--step-3);
    color: var(--meta);
    font-size: var(--step--1);
    text-transform: uppercase;
    margin-bottom: 1em;
    line-height: 1;
  }

  @media screen and (min-width: 50rem) {
    .post-meta {
      grid-template-columns: repeat(1, max-content);
      gap: var(--step--2);
      /* 1.2 is a bit of a magic number but it seems to make the start of the text line up with the meta block */
      margin-bottom: calc(var(--step-2) * -1.2);
    }
  }

  .fin {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: var(--meta);
    margin-top: var(--step-2);
  }

  .fin > * {
    margin-top: 0;
  }

  .fin > span {
    display: block;
    width: var(--step-2);
    height: 2px;
    background: currentColor;
  }

  .fin-icon {
    width: var(--step-0);
    margin-left: var(--step-2);
    margin-right: var(--step-2);
  }

  .prev-next {
    margin-top: var(--step-2);
  }
</style>

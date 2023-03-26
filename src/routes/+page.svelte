<script>
  import { onMount } from 'svelte'
  import checkFlexGap from '$lib/components/dom/checkFlexGap.js'
  import SocialMediaMeta from '$lib/components/SocialMediaMeta.svelte'
  import PageMargin from '$lib/components/PageMargin.svelte'
  import BigHonkinPageTitle from '$lib/components/BigHonkinPageTitle.svelte'
  import AlignWithBodyContent from '$lib/components/AlignWithBodyContent.svelte'
  import DitheredImage from '$lib/components/DitheredImage.svelte'
  import PostList from '$lib/components/PostList.svelte'

  /** @type {import('./$types').PageData} */
  export let data

  $: ({ posts } = data)

  const digressionFigures = [
    {
      label: 'Not “rim cider”',
      fontWeight: 'regular',
      src: '/images/rim-cider.jpg',
      alt: 'a tire rim and a glass of apple cider',
    },
    {
      label: 'Not “ram sitar”',
      fontWeight: 'regular',
      src: '/images/ram-sitar.jpg',
      alt: 'a ram and a sitar',
    },
    {
      label: 'And absolutely not…',
      fontWeight: 'black',
      src: '/images/rob-schneider.jpg',
      alt: 'Rob Schneider',
    },
  ]

  let supportsFlexboxGap = true
  onMount(() => {
    supportsFlexboxGap = checkFlexGap()
  })
</script>

<SocialMediaMeta title="Lee Reamsnyder" description="Professional DIVeloper" generateOgImage />

<PageMargin>
  <BigHonkinPageTitle>Ahoy-hoy!<br /> I like to build web&nbsp;sites.</BigHonkinPageTitle>
</PageMargin>

<svelte:head>
  <title>Lee Reamsnyder</title>

  <meta property="og:type" content="website" />

  <!-- this forces the sveltekit adapter-static processor to pick up the 404 page -->
  <link rel="error-page" href="/404" />
  <link rel="offline-page" href="/offline" />
</svelte:head>

<AlignWithBodyContent>
  <div class="styled-links">
    <p class="graf">
      I mean, I like other things too, but web sites—useful, approachable, and performant ones in
      particular—are how I pay the bills.
    </p>
    <p class="graf">
      Check out <a href="/work" data-sveltekit-preload-data>some of my work</a>
      or
      <a href="/blog" data-sveltekit-preload-data>some things that I wrote</a>.
    </p>
    <p class="graf">I live in Carrboro, North Carolina; I use semicolons entirely too much.</p>
  </div>
</AlignWithBodyContent>

<PageMargin>
  <section class="aside">
    <h2>
      <span class="digression small-caps">a digression</span>
      <span class="aside-title new-kansas-regular"
        >on the
        <span class="new-kansas-black">pronunciation</span>
        of my&nbsp;last&nbsp;name</span
      >
    </h2>
    <p class="all-together-now">
      (<span class="italic">&thinsp;All together now!&thinsp;</span>)
    </p>
    <p class="pronunciation sc">
      Ream <span class="pronunciation-bullet">•</span> Sny
      <span class="pronunciation-bullet">•</span> Der
    </p>
    <p class="like-its-spelled">
      (<span class="italic">&thinsp;Just like it’s spelled!&thinsp;</span>)
    </p>

    <div class="aside-images" class:flexgap={supportsFlexboxGap} data-testid="aside-images">
      {#each digressionFigures as figure}
        <div>
          <span class={`new-kansas-${figure.fontWeight}`}>{figure.label}</span>
          <DitheredImage
            src={figure.src}
            alt={figure.alt}
            width={650}
            height={347}
            ditheredCanvasWidth={600}
            roundedCorners
          />
        </div>
      {/each}
    </div>
  </section>
</PageMargin>

<AlignWithBodyContent>
  <h3 class="recent-and-favorites-title sc">Recent and favorite articles</h3>

  <PostList {posts} />
</AlignWithBodyContent>

<style>
  .graf + .graf {
    margin-top: var(--step--1);
  }

  .aside {
    position: relative;
    margin-top: var(--step-4);
    text-align: center;
  }

  .aside h2 {
    margin-top: 0;
    margin-bottom: 0;
  }

  .digression {
    font-size: var(--step-0);
    display: block;
    margin-top: -1em;
    margin-bottom: 0;
  }

  .digression::before,
  .digression::after {
    font-size: var(--step--1);
    color: var(--color-accent);
  }

  .digression::before {
    content: '••••• ';
  }

  .digression::after {
    content: ' •••••';
  }

  .aside-title {
    color: var(--meta);
    font-weight: 400;
    font-size: var(--step-1);
  }

  .all-together-now,
  .like-its-spelled {
    line-height: 1;
    font-size: var(--step--1);
    color: var(--meta);
  }

  .all-together-now {
    margin-top: var(--step-0);
    margin-bottom: 0;
  }

  .pronunciation {
    margin-top: 0;
    margin-bottom: 0;
    line-height: 1;
    font-size: var(--step-3);
  }

  .pronunciation-bullet {
    color: var(--color-accent);
  }

  .like-its-spelled {
    margin-top: var(--step--3);
    margin-bottom: var(--step-2);
  }

  .aside-images {
    display: flex;
    flex-wrap: wrap;
  }

  .aside-images > div {
    margin: 2rem 1rem 0;
    flex: 1 1 225px;
  }

  .flexgap.aside-images {
    gap: 2rem;
  }

  .flexgap > div {
    margin: 0;
  }

  .recent-and-favorites-title {
    margin-top: var(--step-5);
    margin-bottom: var(--step-0);
  }
</style>

<script>
  import HtmlTitle from '$lib/components/HtmlTitle.svelte'
  import SocialMediaMeta from '$lib/components/SocialMediaMeta.svelte'
  import PageMargin from '$lib/components/PageMargin.svelte'
  import BigHonkinPageTitle from '$lib/components/BigHonkinPageTitle.svelte'
  import AlignWithBodyContent from '$lib/components/AlignWithBodyContent.svelte'
  import DitheredImage from '$lib/components/DitheredImage.svelte'

  export let data
  $: ({ entries } = data)
</script>

<HtmlTitle title="Work" />
<SocialMediaMeta title="My work" description="An ongoing timeline" />

<PageMargin>
  <BigHonkinPageTitle isEntryTitle={false}>Work</BigHonkinPageTitle>
</PageMargin>

<AlignWithBodyContent>
  <div class="timeline styled-links">
    {#each entries as { date, title, hero, heroHeight, heroWidth, html }}
      <div class="entry">
        <b class="dot" />

        <time class="time monospace" datetime={new Date(date).toISOString()}
          >{new Date(date).getFullYear()}</time
        >

        <h2 class="new-kansas-regular">{title}</h2>

        {#if hero}
          <div class="image-wrapper">
            <DitheredImage
              src={hero}
              width={heroWidth}
              height={heroHeight}
              ditheredCanvasWidth={heroWidth}
            />
          </div>
        {/if}

        {@html html}
      </div>
    {/each}
  </div>
</AlignWithBodyContent>

<style>
  .timeline {
    position: relative;
    padding-top: var(--step-2);
    padding-bottom: var(--step-2);
    padding-left: var(--step-0);
    border-left: 2px dotted var(--color-timeline);
  }

  /* little 'fade out' on the top */
  .timeline::before {
    position: absolute;
    top: 0;
    left: -4px;
    height: 3em;
    width: 4px;
    content: '';
    background: linear-gradient(
      to bottom,
      var(--page-background),
      var(--page-background-transparent)
    );
  }

  .entry {
    position: relative;
  }

  .entry + .entry {
    margin-top: var(--step-3);
  }

  .dot {
    position: absolute;
    height: 0.707em;
    width: 0.707em;
    background-color: var(--color-timeline);
    border-radius: 50%;
    left: -1.44em;
    top: 0.4em;
  }

  .time {
    color: var(--meta);
    font-size: var(--step--1);
  }

  h2 {
    margin-top: var(--step--2);
    margin-bottom: var(--step--3);
  }

  .image-wrapper {
    display: inline-block;
    max-width: 10em;
    clip-path: circle();
  }
</style>

<script>
  import HtmlTitle from '$lib/components/HtmlTitle.svelte'
  import SocialMediaMeta from '$lib/components/SocialMediaMeta.svelte'
  import PageMargin from '$lib/components/PageMargin.svelte'
  import BigHonkinPageTitle from '$lib/components/BigHonkinPageTitle.svelte'
  import AlignWithBodyContent from '$lib/components/AlignWithBodyContent.svelte'
  import DisplayDate from '$lib/components/DisplayDate.svelte'

  export let data
  $: ({ year, month, monthName, postsForMonth, months } = data)

  let title = ''
  $: {
    title = month ? `All posts from ${year} ${monthName}` : `${year} Archives`
  }
</script>

<HtmlTitle {title} />
<SocialMediaMeta {title} />

<PageMargin>
  <BigHonkinPageTitle isEntryTitle={false}>{title}</BigHonkinPageTitle>
</PageMargin>

<AlignWithBodyContent>
  {#if month}
    {#if postsForMonth.length > 0}
      <ul class="posts">
        {#each postsForMonth as { title, path, date }}
          <li class="post h-entry">
            <a href={path} data-sveltekit-preload-data class="post-link u-url">
              <span class="post-date monospace">
                <DisplayDate {date} />
              </span>
              <p class="post-title new-kansas-regular p-name">{title}</p>
            </a>
          </li>
        {/each}
      </ul>
    {:else}
      No posts for this month
    {/if}
  {:else}
    <div class="styled-links">
      {#if months?.length}
        <ul class="posts">
          {#each months as { name, path }}
            <li>
              <a href={'/archives' + path} data-sveltekit-preload-data>{name}</a>
            </li>
          {/each}
        </ul>
      {/if}
    </div>
  {/if}

  <p class="moar monospace styled-links">
    {#if month}
      <a href="/archives/{year}" data-sveltekit-preload-data>
        <span class="alternate-arrows">←</span> Back to {year}
      </a>
    {/if}

    <a href="/archives" data-sveltekit-preload-data>
      <span class="alternate-arrows">←</span> Back to Archives
    </a>
  </p>
</AlignWithBodyContent>

<style>
  .posts {
    margin: 0;
    padding: 0;
    list-style-type: none;
  }

  .post {
    margin: 0;
  }

  .post + .post {
    margin-top: var(--step-3);
  }

  .post-link {
    display: block;
    color: inherit;
    text-decoration: none;
  }

  .post-date {
    color: var(--meta);
    font-size: var(--step--1);
    line-height: 1;
  }

  .post-title {
    margin: 0;
    font-size: var(--step-1);
    line-height: 1.1;
  }

  .post-link:hover .post-title {
    color: var(--color-link);
  }

  .moar {
    font-size: var(--step--1);
  }
</style>

<script>
  import HtmlTitle from '$lib/components/HtmlTitle.svelte'
  import SocialMediaMeta from '$lib/components/SocialMediaMeta.svelte'
  import PageMargin from '$lib/components/PageMargin.svelte'
  import BigHonkinPageTitle from '$lib/components/BigHonkinPageTitle.svelte'
  import AlignWithBodyContent from '$lib/components/AlignWithBodyContent.svelte'
  import PostList from '$lib/components/PostList.svelte'

  /** @type {import('./$types').PageData} */
  export let data
  $: ({ posts } = data)
</script>

<HtmlTitle title="Blog" />
<SocialMediaMeta title="Blog" description="Most recent posts" />

<PageMargin>
  <BigHonkinPageTitle isEntryTitle={false}>Latest posts</BigHonkinPageTitle>
</PageMargin>

<AlignWithBodyContent>
  <PostList {posts} />

  <p class="moar monospace styled-links">
    Looking for more? Try the
    <a href="/archives" data-sveltekit-preload-data>archives</a>.
  </p>
</AlignWithBodyContent>

<style>
  .moar {
    font-size: var(--step--1);
    margin-top: var(--step-4);
  }
</style>

<script>
  import HtmlTitle from '$lib/components/HtmlTitle.svelte'
  import SocialMediaMeta from '$lib/components/SocialMediaMeta.svelte'
  import PageMargin from '$lib/components/PageMargin.svelte'
  import BigHonkinPageTitle from '$lib/components/BigHonkinPageTitle.svelte'
  import BodyContent from '$lib/components/BodyContent.svelte'

  export let data
  $: ({ years } = data)
</script>

<HtmlTitle title="Archives" />
<SocialMediaMeta title="Site archives" />

<PageMargin>
  <BigHonkinPageTitle isEntryTitle={false}>Archives</BigHonkinPageTitle>
</PageMargin>

<BodyContent>
  {#each years as { year, months }}
    <h2>{year}</h2>
    <ul>
      {#each months as { path, name }}
        <li>
          <a href={'/archives' + path} data-sveltekit-preload-data
            ><span class="a11y">{year}</span> {name}</a
          >
        </li>
      {/each}
    </ul>
  {/each}
</BodyContent>

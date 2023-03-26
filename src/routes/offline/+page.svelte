<script>
  import HtmlTitle from '$lib/components/HtmlTitle.svelte'
  import PageMargin from '$lib/components/PageMargin.svelte'
  import BigHonkinPageTitle from '$lib/components/BigHonkinPageTitle.svelte'
  import BodyContent from '$lib/components/BodyContent.svelte'
  import OfflineImage from '$lib/assets/offline-image.jpg'
</script>

<HtmlTitle title="Offline!" />
<svelte:head>
  <meta name="robots" content="noindex,noimageindex" />
</svelte:head>

<PageMargin>
  <BigHonkinPageTitle isEntryTitle={false}>You appear to be offline</BigHonkinPageTitle>
</PageMargin>

<BodyContent>
  <img src={OfflineImage} alt="" width="1000" height="980" data-testid="offline-image" />
  <p>Give this page a refresh when you’re back online and you should be good to go!</p>
</BodyContent>

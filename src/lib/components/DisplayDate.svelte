<script>
  import { MONTHS } from '../../lib/constants'

  export let date
  export let pubdate = true

  let displayDate
  let dateTime
  $: if (date) {
    const jsDate = new Date(date)
    displayDate = `${jsDate.getFullYear()} ${MONTHS[jsDate.getMonth()]} ${jsDate.getDate()}`
    dateTime = jsDate.toISOString()
  }
</script>

{#if displayDate}
  <time
    class:dt-published={pubdate}
    class:dateline={pubdate}
    {pubdate}
    datetime={dateTime}
    itemprop={pubdate ? 'dateCreated pubdate datePublished' : undefined}>{displayDate}</time
  >
{/if}

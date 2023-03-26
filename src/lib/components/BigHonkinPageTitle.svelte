<script>
  export let href = undefined
  export let enshrinken = false
  export let isEntryTitle = true
</script>

<h1
  class:enshrinken
  class:entry-title={isEntryTitle}
  class:p-name={isEntryTitle}
  class="new-kansas-black styled-links"
  itemprop={isEntryTitle ? 'headline' : undefined}
>
  {#if href}
    <a {href}><slot />&nbsp;<span class="link-arrow alternate-arrows">→</span></a>
  {:else}<slot />{/if}
</h1>

<style>
  h1 {
    margin-top: 0;
    margin-bottom: var(--step-2);
    font-size: var(--step-5);
    line-height: 1.1;
  }

  /* 
    some posts have some pretty long words in the title 
    at which point the title gets kind of ridiculous
    and/or won't fit on small screens
    so I can scale it down fairly aggressively to fix that
  */
  h1.enshrinken {
    /* this is still effectively gigantic */
    font-size: var(--step-3);
  }

  .link-arrow {
    font-size: var(--step-4);
    color: var(--color-link);
    vertical-align: 0.15em;
  }
</style>

<script>
  import AlignWithBodyContent from './AlignWithBodyContent.svelte'

  export let previous
  export let next
</script>

{#if previous || next}
  <AlignWithBodyContent>
    <nav aria-label="Previous and next posts">
      {#if previous}
        <a href={previous.path} data-sveltekit-preload-data class="link previous">
          <span aria-hidden="true" class="arrow alternate-arrows">←</span>
          <span class="label monospace">Older post</span>
          <span class="title">{previous.title}</span>
        </a>
      {/if}

      {#if next}
        <a href={next.path} data-sveltekit-preload-data class="link next">
          <span aria-hidden="true" class="arrow alternate-arrows">→</span>
          <span class="label monospace">Newer post</span>
          <span class="title">{next.title}</span>
        </a>
      {/if}
    </nav>
  </AlignWithBodyContent>
{/if}

<style>
  nav {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    font-size: var(--step--1);
  }

  .link {
    display: grid;
    max-width: 45%;
    grid-column-gap: var(--step--3);
    text-decoration: none;
    color: var(--color-link);
  }

  .previous {
    grid-template-areas:
      'arrow label'
      'arrow title';
  }

  .next {
    text-align: right;
    grid-template-areas:
      'label arrow'
      'title arrow';
  }

  .label {
    grid-area: label;
    font-size: var(--step--2);
    text-transform: uppercase;
  }

  .title {
    grid-area: title;
  }

  .arrow {
    grid-area: arrow;
    font-size: var(--step-0);
  }
</style>

<script>
  import DitheredImage from './DitheredImage.svelte'
  import Symbolicons from './Symbolicons.svelte'
  import DisplayDate from './DisplayDate.svelte'

  function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max)) + 1
  }

  export let posts
</script>

<ul class="posts">
  {#each posts as post}
    <li class="post h-entry">
      <a href={post.path} data-sveltekit-preload-data class="post-link u-url">
        <span class="post-date monospace">
          <DisplayDate date={post.date} />
        </span>
        {#if post.favorite}
          <span class={`favorite option-${getRandomInt(4)}`}>
            <span class="favorite-inner">
              <span class="favorite-icon">
                <Symbolicons icon="heart-arrow" />
              </span>
              <span class="favorite-text monospace">Favorite</span>
            </span>
          </span>
        {/if}
        <p class="post-title new-kansas-regular p-name">{post.title}</p>
        {#if post.hero}
          <div class="post-hero">
            <DitheredImage
              src={post.hero}
              width={post.heroWidth}
              height={post.heroHeight}
              roundedCorners
            />
          </div>
        {/if}
        {#if post.description}
          <p class="description p-summary">{post.description}</p>
        {/if}
      </a>
    </li>
  {/each}
</ul>

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

  .favorite {
    display: inline-block;
    line-height: 1;
    font-size: var(--step--2);
    border-radius: 20px;
    --direction: to bottom right;
    background-image: linear-gradient(
      var(--direction),
      var(--color-one),
      var(--color-two) 50%,
      var(--color-three)
    );
  }

  .favorite.option-2 {
    --direction: to bottom left;
  }

  .favorite.option-3 {
    --direction: to top right;
  }

  .favorite.option-4 {
    --direction: to top left;
  }

  .favorite-inner {
    border-radius: 18px;
    display: inline-flex;
    align-items: center;
    gap: 3px;
    margin: 3px;
    padding: var(--step--4) var(--step--4) var(--step--4) var(--step--3);
    background: var(--page-background);
  }

  .favorite-icon {
    display: block;
    height: var(--step--1);
    width: var(--step--1);
  }

  .post-title {
    margin: 0;
    font-size: var(--step-1);
    line-height: 1.1;
  }

  .post-link:hover .post-title {
    color: var(--color-link);
  }

  .post-hero {
    margin-top: 3px;
  }

  .description {
    margin: 0;
    margin-top: 0.2em;
    line-height: 1.2;
  }
</style>

<script>
  export let src
  export let alt = ''
  export let width
  export let height
  export let ditheredCanvasWidth = 600
  export let roundedCorners = false

  function makeDitheredImageUrl(width) {
    return `/dithered-image/${width}${src}/dithered.png`
  }

  function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max)) + 1
  }

  // function makeSrcset(...widths) {
  //   return widths
  //     .map(width => `${makeDitheredImageUrl(width)} ${width}w`)
  //     .join(', ')
  // }
</script>

<div class="root">
  <img
    src={makeDitheredImageUrl(ditheredCanvasWidth)}
    class:rounded-corners={roundedCorners}
    {width}
    {height}
    {alt}
    loading="lazy"
  />
  <div class:rounded-corners={roundedCorners} class={`overlay option-${getRandomInt(4)}`} />
</div>

<style>
  .root {
    display: grid;
  }

  .root > * {
    grid-area: 1 / 1 / -1 / -1;
  }

  .rounded-corners {
    border-radius: var(--step--2);
  }

  img {
    /* 
      This slightly increases overall contrast and "crispness" at the cost of sometimes 
      looking horrid on non-retina screens depending on scaling

      dropped 2021-12-30 because Webhint kept complaining about it and yeah it looks pretty bad on a 1x monitor

      image-rendering: crisp-edges;
      image-rendering: -webkit-optimize-contrast; Edge 79+ 
    */
    width: 100%;
    height: auto;
    display: block;
  }

  .overlay {
    display: none;
  }

  @supports (mix-blend-mode: screen) {
    .overlay {
      --direction: to bottom right;
      display: block;
      background-image: linear-gradient(
        var(--direction),
        var(--color-one),
        var(--color-two) 50%,
        var(--color-three)
      );
      opacity: 0.5;
      mix-blend-mode: screen;
    }

    @media (prefers-color-scheme: dark) {
      .overlay {
        /* mix-blend-mode: multiply;
        mix-blend-mode: hard-light; */
        opacity: 0.85;
      }
    }

    .overlay.option-2 {
      --direction: to bottom left;
    }

    .overlay.option-3 {
      --direction: to top right;
    }

    .overlay.option-4 {
      --direction: to top left;
    }
  }
</style>

<script>
  import { onMount, afterUpdate, onDestroy } from 'svelte'
  import wrap from './dom/wrap'

  let rootElement

  let lazyVideoObserver

  onMount(async () => {
    // must import this in an onMount because it references "window"
    // https://sapper.svelte.dev/docs#Third-party_libraries_that_depend_on_window
    await import('./polyfills/nodelistForEachPolyfill')

    // see: https://web.dev/lazy-loading-video/
    if ('IntersectionObserver' in window) {
      lazyVideoObserver = new IntersectionObserver((entries, observer) => {
        for (const video of entries) {
          if (video.isIntersecting) {
            for (const source of video.target.children) {
              if (
                typeof source.tagName === 'string' &&
                source.tagName === 'SOURCE' &&
                !source.src
              ) {
                source.src = source.dataset.src
              }
            }

            video.target.load()
            video.target.classList.remove('lazy')
            observer.unobserve(video.target)
          }
        }
      })

      observeLazyLoadVideos()
    }
  })

  function observeLazyLoadVideos() {
    if (!rootElement || !lazyVideoObserver) {
      return
    }

    // stop watching all existing targets
    lazyVideoObserver.disconnect()

    const lazyLoadVideos = rootElement.querySelectorAll('video.lazy')
    lazyLoadVideos.forEach((lazyVideo) => {
      lazyVideoObserver.observe(lazyVideo)
    })
  }

  function wrapVideos() {
    if (!rootElement) {
      return
    }

    const supportsAspectRatioStyling = 'CSS' in window && CSS.supports('aspect-ratio: 16/9')

    const videos = rootElement.querySelectorAll('embed, object, iframe')

    videos.forEach((el) => {
      // prevent multiples
      if (el.parentNode.classList.contains('embedded')) {
        return
      }

      if (supportsAspectRatioStyling) {
        // by default, I'm styling all these as 16 / 9 (assuming a video)
        // but if we can do better, I'm all for it
        const { width, height } = el
        if (width && height) {
          const aspectRatio = width / height
          const sixteenOverNineIsh = aspectRatio > 1.75 && aspectRatio < 1.8
          if (!sixteenOverNineIsh) {
            el.style.aspectRatio = `${width} / ${height}`
          }
        }
      } else {
        // fallback
        const wrapper = document.createElement('div')
        wrapper.classList.add('embedded')

        // .embedded has a default 16:9 aspect ratio
        // which works just fine
        // but if we can figure it out from the markup, cool
        const { width, height } = el
        if (width && height) {
          // note that this is NOT width / height, which we use for aspect-ratio CSS
          // because here we want to know what percentage of the width the height should be
          const aspectRatio = height / width
          wrapper.style.paddingBottom = `${aspectRatio * 100}%`
        }

        wrap(el, wrapper)

        // FF seems fussy about grid children with no layout content
        // (the child videos are position: absolute)
        // wrapping in yet another div fixes things
        // this is also helps when _not_ using a grid as the actual element is much wider than it appears
        wrap(wrapper, document.createElement('div'))
      }
    })
  }

  function cleanUp(force = false) {
    if (!rootElement) {
      return
    }
    const wrappers = rootElement.querySelectorAll('.embedded')
    wrappers.forEach((el) => {
      if (force || el.children.length === 0) {
        el.parentNode.remove()
      }
    })

    if (lazyVideoObserver) {
      lazyVideoObserver.disconnect()
    }
  }

  afterUpdate(() => {
    cleanUp()
    wrapVideos()
    observeLazyLoadVideos()
  })

  onDestroy(() => {
    cleanUp(true)
  })
</script>

<div bind:this={rootElement} class="responsive-embeds">
  <slot />
</div>

<style>
  :global(.embedded) {
    position: relative;
    padding-bottom: 56.25%; /* Sets default 16:9 ratio. The height is 56.25% of the width */
    padding-top: 30px; /* add some px for the player chrome, particularly YouTube */
    /*
    height: 0;
    ^^^ this is in all the 'classic' implementations of this
    per https://alistapart.com/article/creating-intrinsic-ratios-for-video
    it's for IE5/6 to trigger our old friend "layout"

    it does not appear to be necessary in more modern browsers

    if you need it, there's always `zoom: 1`
  */
  }

  :global(.embedded::before) {
    content: '(Embedded content loading…)';
    display: block;
    text-align: center;
    font-style: italic;
    font-size: var(--step--2);
    color: var(--meta);
  }

  :global(.embedded iframe),
  :global(.embedded embed),
  :global(.embedded object) {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  /* for browsers that support aspect-ratio I can just do this */
  @supports (aspect-ratio: 16 / 9) {
    .responsive-embeds :global(iframe),
    .responsive-embeds :global(embed),
    .responsive-embeds :global(object) {
      /* both width/height css properties are necessary to override width="" and height="" properties on the elements */
      width: 100%;
      height: auto;
      aspect-ratio: 16 / 9;
    }
  }
</style>

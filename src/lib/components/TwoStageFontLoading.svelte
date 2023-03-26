<script>
  /*
    2-stage font loading 
    https://www.zachleat.com/web/css-tricks-web-fonts/
    but, like, using Sveltekit and Vite to get fingerprinted asset urls

      1) preload the most important ones to avoid gigantic layout shifts (a subset of Concourse, New Kansas)
          this avoids FOIT _and_ FOUT as the main fonts will be loaded immediately
          at the cost of having to slightly delay rendering
      2) add them as @font-face declarations here
          New Kansas is done
          Concourse regular in in, but will have faux-italics, no bold, no small caps, etc
          MonoLisa won't be there
      3) load the rest with the FontFace() API and insert them into the document's font stack
  */
  import { onMount } from 'svelte'

  // preloaded
  import concourseRegularWoff2 from '$lib/assets/fonts/concourse_t4_regular.woff2'
  import newKansasBlackWoff2 from '$lib/assets/fonts/kansasnew-black-webfont.woff2'
  import newKansasRegularWoff2 from '$lib/assets/fonts/kansasnew-regular-webfont.woff2'

  // woff variants of preloaded fonts
  import concourseRegularWoff from '$lib/assets/fonts/concourse_t4_regular.woff'
  import newKansasBlackWoff from '$lib/assets/fonts/kansasnew-black-webfont.woff'
  import newKansasRegularWoff from '$lib/assets/fonts/kansasnew-regular-webfont.woff'

  // inserted into document’s font stack after loading
  import concourseItalicWoff2 from '$lib/assets/fonts/concourse_t4_italic.woff2'
  import concourseItalicWoff from '$lib/assets/fonts/concourse_t4_italic.woff'
  import concourseBoldWoff2 from '$lib/assets/fonts/concourse_t4_bold.woff2'
  import concourseBoldWoff from '$lib/assets/fonts/concourse_t4_bold.woff'
  import concourseBoldItalicWoff2 from '$lib/assets/fonts/concourse_t4_bold_italic.woff2'
  import concourseBoldItalicWoff from '$lib/assets/fonts/concourse_t4_bold_italic.woff'
  import concourseSmallCapsWoff2 from '$lib/assets/fonts/concourse_c4_regular.woff2'
  import concourseSmallCapsWoff from '$lib/assets/fonts/concourse_c4_regular.woff'
  import monoLisaRegularWoff2 from '$lib/assets/fonts/monolisa-regular-webfont.woff2'
  import monoLisaRegularWoff from '$lib/assets/fonts/monolisa-regular-webfont.woff'
  import monoLisaItalicWoff2 from '$lib/assets/fonts/monolisa-regularitalic-webfont.woff2'
  import monoLisaItalicWoff from '$lib/assets/fonts/monolisa-regularitalic-webfont.woff'

  const preloadedFonts = [
    {
      fontFamily: 'Concourse',
      fontWeight: 400,
      woff2: concourseRegularWoff2,
      woff: concourseRegularWoff,
    },
    {
      fontFamily: 'NewKansas',
      fontWeight: 900,
      woff2: newKansasBlackWoff2,
      woff: newKansasBlackWoff,
    },
    {
      fontFamily: 'NewKansas',
      fontWeight: 400,
      woff2: newKansasRegularWoff2,
      woff: newKansasRegularWoff,
    },
  ]

  const fontFaceDeclarations = preloadedFonts
    .map(
      ({ fontFamily, fontWeight, woff2, woff }) => `@font-face {
  font-family: ${fontFamily};
  src: url(${woff2}) format('woff2'), url(${woff}) format('woff');
  font-weight: ${fontWeight};
  font-display: swap;
}`
    )
    .join('\n')

  // gotta be wonky here b/c the svelte parser flips out if you write "style" surrounded by < or >
  const preloadedFontStyles =
    '<' + 'style' + '>' + '\n' + fontFaceDeclarations + `\n` + '</' + 'style' + '>'

  const deferredFonts = [
    // Concourse italic
    {
      fontFamily: 'Concourse',
      woff2: concourseItalicWoff2,
      woff: concourseItalicWoff,
      descriptors: { weight: '400', style: 'italic' },
    },

    // Concourse bold
    {
      fontFamily: 'Concourse',
      woff2: concourseBoldWoff2,
      woff: concourseBoldWoff,
      descriptors: { weight: '700' },
    },

    // Concourse bold-italic
    {
      fontFamily: 'Concourse',
      woff2: concourseBoldItalicWoff2,
      woff: concourseBoldItalicWoff,
      descriptors: { weight: '700', style: 'italic' },
    },

    // Concourse small caps
    {
      fontFamily: 'ConcourseCaps',
      woff2: concourseSmallCapsWoff2,
      woff: concourseSmallCapsWoff,
      descriptors: { weight: '400' },
    },

    // MonoLisa
    {
      fontFamily: 'MonoLisa',
      woff2: monoLisaRegularWoff2,
      woff: monoLisaRegularWoff,
      descriptors: { weight: '400' },
    },

    // MonoLisa italic
    {
      fontFamily: 'MonoLisa',
      woff2: monoLisaItalicWoff2,
      woff: monoLisaItalicWoff,
      descriptors: { weight: '400', style: 'italic' },
    },
  ]

  onMount(() => {
    if ('fonts' in document) {
      Promise.all(
        deferredFonts.map(({ fontFamily, woff2, woff, descriptors }) =>
          new FontFace(
            fontFamily,
            `url(${woff2}) format('woff2'), url(${woff}) format('woff')`,
            descriptors
          ).load()
        )
      ).then((fonts) => {
        fonts.forEach((font) => {
          document.fonts.add(font)
        })
      })
    }
  })
</script>

<svelte:head>
  {#each preloadedFonts as { woff2 } (woff2)}
    <link rel="preload" href={woff2} as="font" type="font/woff2" crossorigin="anonymous" />
  {/each}

  {@html preloadedFontStyles}
</svelte:head>

<script>
  // import '$lib/assets/highlightjs-themes/dracula.css'
  import { afterUpdate } from 'svelte'

  let contentElement

  //
  // HANGING PUNCTUATION
  //
  // adapted rather shamelessly from https://webdesign.tutsplus.com/articles/getting-the-hang-of-hanging-punctuation--cms-19890
  //
  const marks = {
    '\u201c': 'medium', // “ - ldquo - left smart double quote
    '\u2018': 'small', // ‘ - lsquo - left smart single quote
    '\u0022': 'medium', // " - ldquo - left dumb double quote
    '\u0027': 'small', // ' - lsquo - left dumb single quote
    '\u00AB': 'large', // « - laquo - left double angle quote
    '\u2039': 'medium', // ‹ - lsaquo - left single angle quote
    '\u201E': 'medium', // „ - bdquo - left smart double low quote
    '\u201A': 'small', // ‚ - sbquo - left smart single low quote
  }
  function setHangingPunctuationTextIndents() {
    if (!contentElement) {
      return
    }
    const paragraphsAndHeaders = contentElement.querySelectorAll('p, h2, h3, h4, h5, h6')
    for (const el of paragraphsAndHeaders) {
      const text = el.innerText || el.textContent
      for (const mark in marks) {
        if (text[0] === mark) {
          el.classList.add(`indent-${marks[mark]}`)
        }
      }
    }
  }

  // AXE devtools pointed out this one:
  // if an area is potentially scrollable, it should also be focusable
  function makePreElementsFocusable() {
    if (!contentElement) {
      return
    }
    const preElements = contentElement.querySelectorAll('pre')
    for (const el of preElements) {
      el.setAttribute('tabindex', '0')
    }
  }

  afterUpdate(() => {
    setHangingPunctuationTextIndents()
    makePreElementsFocusable()
  })
</script>

<div bind:this={contentElement} class="content e-content styled-links">
  <slot>
    <p>You did not provide any content</p>
  </slot>
</div>

<style>
  /*
		By default, CSS is locally scoped to the component,
		and any unused styles are dead-code-eliminated.
		so we have to use the :global(...) modifier to target
		all elements inside .content
  */
  .content {
    margin-left: var(--page-left);
    margin-right: var(--page-right);
    hyphens: auto; /* turn on hyphenation */
    hyphenate-limit-lines: 2; /* max number of consecutive lines that end with a hyphen */
    /*
    hyphenate words over six characters
    leave 3 on the first line
    take at least 2 on the second line
  */
    -webkit-hyphenate-limit-before: 3;
    -webkit-hyphenate-limit-after: 2;
    hyphenate-limit-chars: 6 3 2;
    hyphenate-limit-zone: 8%;
    hyphenate-limit-last: always;
  }

  .content :global(*) {
    margin-top: 0;
    margin-bottom: 0;
  }

  .content :global(* + *) {
    margin-top: var(--step--1);
  }

  /* lite-youtube has dom like lite-youtube > button + iframe */
  .content :global(lite-youtube > iframe) {
    margin-top: 0;
  }

  .content > :global(*) {
    margin-left: var(--content-left-padding);
  }

  /* 
    apply a max-width on all children at the rough point where content is getting too wide 
    this is a little fuzzy on the exact point
    but it's easier to do this than set it globally and then have to un-set it for things like img/video/embeds
  */
  @media screen and (min-width: 32rem) {
    .content > :global(*) {
      max-width: var(--content-max-width);
    }
  }

  .content :global(br) {
    margin-top: 0;
  }

  .content :global(.intro) {
    font-size: var(--step-0);
    max-width: calc(var(--content-max-width) * 1.5);
    margin-bottom: var(--step-3);
  }

  .content :global(.intro::after) {
    content: '';
    display: block;
    margin-top: 1em;
    max-width: var(--step-5);
    height: 3px;
    background: var(--color-accent);
  }

  .content :global(h2),
  .content :global(h3),
  .content :global(h4),
  .content :global(h5),
  .content :global(h6) {
    hyphens: none;
    font-family: var(--font-family-serif);
    font-weight: 400;
    font-style: normal;
    margin-top: 1.2em;
  }

  /* h1 shouldn't/doesn't happen in body content */

  .content :global(h2) {
    font-size: var(--step-3);
  }

  .content :global(h3) {
    font-size: var(--step-2);
  }

  /* h4 down are rarely, if ever used! so don't slave over them */
  .content :global(h4) {
    font-size: var(--step-1);
  }

  .content :global(h5) {
    font-size: inherit;
  }

  .content :global(h6) {
    font-size: var(--step--1);
  }

  /* the markdown parser wraps all header content in anchors */
  .content :global(.header-anchor) {
    text-decoration: none;
    border-bottom: 0;
  }

  @media (pointer: fine) {
    .content :global(.header-anchor:hover) {
      text-decoration: underline;
      text-decoration-color: inherit;
      text-decoration-style: solid;
      text-decoration-thickness: 2px;
    }
  }

  .content :global(ul),
  .content :global(ol) {
    padding-left: 1em;
  }

  .content :global(ul) {
    list-style-type: disc;
  }

  .content :global(li::marker) {
    color: var(--color-two-aa-contrast);
    font-size: var(--step--1);
  }

  /* slightly less spacing between list items */
  .content :global(li + li) {
    margin-top: var(--step--4);
  }

  /* nested lists */
  .content :global(ul ul) {
    margin-left: var(--step--1);
  }

  .content :global(dt) {
    font-weight: 700;
  }

  .content :global(dd) {
    margin-left: var(--step-1);
  }

  @media screen and (min-width: 50rem) {
    .content :global(ul),
    .content :global(ol) {
      padding-left: 0;
    }

    .content :global(dl) {
      display: grid;
      grid-gap: var(--step--2);
      grid-template-columns: minmax(auto, max-content) auto;
    }

    .content :global(dd),
    .content :global(dt) {
      margin-top: 0;
    }

    .content :global(dt) {
      grid-column: 1;
    }

    .content :global(dd) {
      margin-left: 0;
      grid-column: 2;
    }
  }

  .content :global(figure),
  .content :global(.full-width) {
    margin-left: 0;
    margin-right: 0;
  }

  /* <figure /> and .full opt-in for full-width in the grid */
  .content :global(figure),
  .content :global(.full-width) {
    max-width: none;
  }

  .content :global(figure img),
  .content :global(figure picture) {
    display: block;
  }

  .content :global(figcaption) {
    margin-top: 2px;
    font-family: var(--font-family-mono);
    font-size: var(--step--2);
  }

  .content :global(figure :not(figcaption) a) {
    border: 0;
  }

  .content :global(code),
  .content :global(kbd) {
    font-size: var(--step--1);
  }

  .content :global(pre) {
    /* colors from dracula.css */
    background: #282a36;
    color: #f8f8f2;

    overflow-x: auto;
    border-top: 1px solid var(--color-accent);
    border-bottom: 1px solid var(--color-accent);
    padding: var(--step--4);
  }

  .content :global(blockquote) {
    margin-right: 0;
    padding-left: var(--step--2);
    border-left: var(--step--4) solid var(--color-accent);
  }

  .content :global(aside) {
    padding: var(--step--2);
    background-color: var(--aside-background);
    border: 1px solid var(--aside-border);
  }

  @media screen and (min-width: 70em) {
    .content :global(aside) {
      float: right;
      margin-left: var(--step-2);
      max-width: 20em;
    }
  }

  .content :global(hr) {
    margin-top: var(--step-2);
    margin-bottom: var(--step-2);
    height: var(--step--4);
    max-width: var(--step-4);
    border: 0;
    background-color: var(--color-two);
  }

  .content :global(table) {
    border-collapse: collapse;
    border-spacing: 0;
    line-height: 1.2;
  }

  .content :global(th),
  .content :global(td) {
    text-align: left;
    margin: 0;
    padding: var(--step--4);
    /* the only override here is for tabular numbers */
    font-feature-settings: 'kern' 1, 'ss02', 'tnum';
  }

  .content :global(th) {
    border-bottom: 2px solid var(--color-accent);
  }

  .content :global(.indent-small) {
    text-indent: -0.2em;
  }

  .content :global(.indent-medium) {
    text-indent: -0.4em;
  }

  .content :global(.indent-large) {
    text-indent: -0.6em;
  }

  /* Safari has near-perfect hanging punctuation for "free" via CSS */
  @supports (hanging-punctuation: first last) {
    .content {
      hanging-punctuation: first last;
    }

    .content :global([class*='indent-']) {
      text-indent: 0;
    }
  }
</style>

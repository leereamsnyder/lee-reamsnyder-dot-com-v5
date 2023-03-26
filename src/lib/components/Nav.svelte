<script>
  import { page } from '$app/stores'
  import Flag from './Flag.svelte'
  import Symbolicons from './Symbolicons.svelte'

  const links = [
    {
      label: 'Home',
      href: '/',
      segment: undefined,
      icon: 'home',
    },
    {
      label: 'Blog',
      href: '/blog',
      segment: 'blog',
      icon: 'typewriter',
    },
    {
      label: 'Work',
      href: '/work',
      segment: 'work',
      icon: 'coffee_mug',
    },
    {
      label: 'Contact',
      href: '/contact',
      segment: 'contact',
      icon: 'paper_airplane',
    },
    {
      label: 'Archives',
      href: '/archives',
      segment: 'archives',
      icon: 'calendar',
    },
  ]

  const elsewhereLinks = [
    {
      label: 'GitHub',
      rel: 'external',
      href: 'https://github.com/leereamsnyder',
      icon: 'code',
    },
    {
      label: 'Instagram',
      rel: 'external',
      href: 'https://instagram.com/rhymeswitheeedreamspider/',
      icon: 'photo',
    },
    {
      label: 'Mastodon',
      rel: 'external',
      href: 'https://social.lol/@lr',
      icon: 'elephant',
    },
    {
      label: 'Twitter',
      rel: 'external',
      href: 'https://twitter.com/leereamsnyder/',
      icon: 'bird',
    },
  ]
</script>

<div class="root">
  <nav class="nav">
    <h2 class="monospace">Menu</h2>
    <ul>
      {#each links as link}
        <li>
          <a
            href={link.href}
            data-sveltekit-preload-data
            aria-current={($page.url.pathname === '/' && !link.segment) ||
            $page.url.pathname.startsWith(`/${link.segment}`)
              ? 'page'
              : undefined}
            class="link"
          >
            <Flag>
              <div slot="left" class="icon-wrapper">
                <Symbolicons icon={link.icon} fill="currentColor" />
              </div>

              <div slot="right">{link.label}</div>
            </Flag>
          </a>
        </li>
      {/each}

      <li>
        <div class="link">
          <Flag>
            <div slot="left" class="icon-wrapper">
              <Symbolicons icon="rss" fill="currentColor" />
            </div>

            <div slot="right">
              Feeds:
              <a href="/rss.xml"><abbr title="Really Simple Syndication">RSS</abbr></a>
              |
              <a href="/feed.json"><abbr title="JavaScript Object Notation">JSON</abbr></a>
            </div>
          </Flag>
        </div>
      </li>
    </ul>
  </nav>

  <section role="search">
    <h2 class="monospace">Search</h2>
    <form class="search-form" action="https://duckduckgo.com/">
      <input type="hidden" name="sites" value="leereamsnyder.com" />
      <Flag>
        <div slot="left">
          <label class="a11y" for="search-input">Search (via DuckDuckGo)</label>
          <input class="search-input" type="search" name="q" id="search-input" required />
        </div>
        <div slot="right">
          <button class="search-submit" type="submit">
            <Symbolicons icon="search" fill="currentColor" />
            <span class="a11y">Go</span>
          </button>
        </div>
      </Flag>
    </form>
  </section>

  <nav class="elsewhere" aria-label="My social media accounts">
    <h2 class="monospace">Elsewhere</h2>
    <ul>
      {#each elsewhereLinks as { href, rel, icon, label } (href)}
        <li>
          <a {href} {rel} class="link">
            <Flag>
              <div slot="left" class="icon-wrapper">
                <Symbolicons {icon} fill="currentColor" />
              </div>

              <div slot="right">{label}</div>
            </Flag>
          </a>
        </li>
      {/each}
    </ul>
  </nav>
</div>

<style>
  .root {
    display: grid;
    gap: var(--step-1);
  }

  @media screen and (min-width: 20rem) {
    .root {
      grid-template-columns: minmax(10px, 1fr) minmax(10px, 1.414fr);
      grid-template-areas:
        'nav     elsewhere'
        'nav     elsewhere'
        'search  search'
        'about   about';
    }

    .nav {
      grid-area: nav;
    }

    [role='search'] {
      grid-area: search;
    }

    .elsewhere {
      grid-area: elsewhere;
    }
  }

  @media screen and (min-width: 30rem) {
    .root {
      grid-template-areas:
        'nav   search'
        'nav   elsewhere'
        'about .';
    }
  }

  h2 {
    color: var(--meta);
    font-size: var(--step--1);
    margin-top: 0;
    margin-bottom: var(--step--2);
  }

  ul {
    margin: 0;
    padding: 0;
    font-size: var(--step--1);
  }

  li {
    display: block;
  }

  .icon-wrapper {
    box-sizing: content-box;
    width: var(--step-0);
    height: var(--step-0);
    box-shadow: 0 2px 0 hsl(0 0% 10% / 0.25);
    border-radius: 3px;
    padding: var(--step--3);
    color: var(--nav-icons);
    background-color: var(--nav-icons-background);
    margin-right: var(--step--4);
  }

  a {
    padding: 0;
    color: inherit;
    text-decoration: none;
  }

  a:hover,
  a:focus-visible {
    color: var(--color-link);
  }

  /* [aria-current] {
  } */

  .link {
    display: block;
    /* embiggens these items to be at least 48px tall to be more tappable */
    padding-top: var(--step--3);
    padding-bottom: var(--step--3);
  }

  .search-input {
    /* remove iOS styling */
    border-radius: 0;
    -webkit-appearance: none;
    border: 1px solid var(--meta);
    border-bottom-width: 2px;
    border-radius: 3px;

    margin: 0 var(--step--4) 0 0;
    padding: var(--step--3);
    background-color: rgba(255, 255, 255, 0);
    transition: background-color 0.3s var(--easing);
    color: inherit;
  }

  .search-submit {
    box-sizing: content-box;
    position: relative;
    width: var(--step-0);
    /* explicit height for IE */
    height: var(--step-0);
    background: none;
    padding: var(--step--3);
    border-width: 1px 3px 3px 1px;
    border-radius: 3px;
    border-color: var(--meta);
    color: inherit;
    cursor: pointer;
  }
</style>

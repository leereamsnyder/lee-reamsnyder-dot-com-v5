<script>
  import "$lib/assets/global.css";
  import plane1xSrc from "$lib/assets/plane-logo@1x.png";
  import plane2xSrc from "$lib/assets/plane-logo@2x.png";
  import RemoveTrailingSlash from "$lib/components/RemoveTrailingSlash.svelte";
  import TwoStageFontLoading from "$lib/components/TwoStageFontLoading.svelte";
  import SiteIcons from "$lib/components/SiteIcons.svelte";
  import SkipLink from "$lib/components/SkipLink.svelte";
  import Nav from "$lib/components/Nav.svelte";

  const thisYear = new Date().getFullYear();
</script>

<RemoveTrailingSlash />
<!-- <TwoStageFontLoading /> -->

<SiteIcons />

<span id="top" tabindex="-1" />
<SkipLink href="#nav">Skip to site navigation</SkipLink>

<div class="sticky-footer-container">
  <header>
    <div class="splash" />

    <div class="masthead">
      <a href="/" class="logo-outer">
        <span class="a11y">Go home</span>
        <img
          class="logo"
          height="100"
          width="100"
          srcset="{plane1xSrc} 100w, {plane2xSrc} 200w"
          sizes="100px"
          src={plane1xSrc}
          alt=""
        />
      </a>

      <h1 class="new-kansas-regular">
        <a href="/" class="top-home-link">Lee Reamsnyder</a>
      </h1>
    </div>
  </header>

  <main>
    <slot />
  </main>

  <div class="footer">
    <!-- svelte-ignore a11y-missing-content -->
    <span id="nav" tabindex="-1" />

    <Nav />

    <footer class="copyright monospace">
      &copy; Copyright 2006–{thisYear}, Lee James Reamsnyder
    </footer>
  </div>
</div>

<SkipLink bottom={true} href="#top">Back to top</SkipLink>

<style>
  .sticky-footer-container {
    min-height: 100vh;
    display: grid;
    grid-template-rows: auto 1fr auto;
    grid-template-columns: 100%; /* at one point I had 100vw here and that was quite bad, causing horizontal overflow */
  }

  .splash {
    height: 5px;
    background-image: linear-gradient(
      to right,
      var(--color-one),
      var(--color-two) 50%,
      var(--color-three)
    );
  }

  .masthead {
    margin: var(--step-3) 0 var(--step-2) var(--page-right);
    display: grid;
    align-items: center;
    grid-template-columns: minmax(auto, var(--content-left-padding)) 1fr;
    grid-template-areas: "logo name";
  }

  .logo-outer {
    display: block;
    box-sizing: content-box;
    padding: 5px;
    grid-area: logo;
    margin-right: var(--step-1);
    width: 100px;
    height: 100px;
    text-decoration: none;
    border: 3px dotted var(--color-link);
    transition: border-color 0.3s var(--easing);
    border-radius: 50%;
  }

  .logo-outer:hover {
    border-color: var(--color-link-hover);
  }

  .logo {
    clip-path: circle();
  }

  h1 {
    grid-area: name;
    margin: 0;
    font-size: var(--step-0);
  }

  .top-home-link {
    color: inherit;
    text-decoration: none;
  }

  .footer {
    margin: var(--step-4) var(--page-right) var(--step--2) var(--page-left);
  }

  .copyright {
    margin-top: var(--step--1);
    font-size: var(--step--2);
  }
</style>

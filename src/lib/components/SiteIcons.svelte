<script>
  import faviconHref from '../assets/favicon.ico'
</script>

<svelte:head>
  <!-- Favicons et al -->
  <link rel="icon" href={faviconHref} />
  <!-- this one comes in under 4kb so it gets inlined but not everyone needs it -->
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
  <link rel="manifest" href="/manifest.webmanifest" crossorigin="use-credentials" />
  <meta name="theme-color" content="#ffffff" />

  <!-- Allows google rich results to use a large image, if it can -->
  <meta name="robots" content="max-image-preview:large" />
</svelte:head>

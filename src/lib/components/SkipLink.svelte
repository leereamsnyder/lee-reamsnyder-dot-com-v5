<script>
  export let bottom = false
  export let href
</script>

<a class="a11y skip-link {bottom ? 'bottom' : 'top'}" {href}><slot /></a>

<style>
  .skip-link {
    left: 0;
    right: 0;
    background-color: #fff;
    background-color: rgba(255, 255, 255, 0.8);
    padding: var(--size-xs);
    text-align: center;
    z-index: 1;
    color: var(--color-link);
  }

  .skip-link:focus {
    position: absolute;
  }

  /*
    for .bottom, this is the less intuitive but still-functional default
    if position: fixed is not supported
  */
  .top,
  .bottom {
    top: 0;
  }

  /* Enhancement if you can stick these wherever in the viewport */
  @supports (position: fixed) {
    .skip-link:focus {
      position: fixed;
    }

    .bottom {
      top: auto;
      bottom: 0;
    }
  }
</style>

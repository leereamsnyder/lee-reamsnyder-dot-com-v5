<div class="flag">
  <div class="left">
    <slot name="left" />
  </div>
  <div class="right">
    <slot name="right" />
  </div>
</div>

<style>
  .flag {
    display: table;
    width: 100%;
  }

  .left,
  .right {
    display: table-cell;
    vertical-align: middle;
  }

  .right {
    width: 100%;
  }
</style>

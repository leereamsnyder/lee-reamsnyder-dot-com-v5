<script>
  export let logo
  export let title
  export let description
  export let hero
  export let heroWidth
  export let heroHeight

  const logoDimensions = 132 // idk the svg rendering is sometimes a bit wonky so w/e looks alright

  // so word-breaking is kinda janky right now
  // something like “Hades”
  // can become “
  // Hades”
  // most straightforward fix is probably to just strip those characters here
  // @todo there are several bugs on Satori about line/text behavior, so I imagine this might improve
  title = title.replace(/[“”"()]/g, '')
</script>

<div
  style:display="flex"
  style:flex-direction="column"
  style:height="100%"
  style:width="100%"
  style:background="#fff"
  style:color="#333"
>
  <div
    style:display="flex"
    style:height="8px"
    style:width="100%"
    style:background-image={'linear-gradient(to right, #931077, #37b5c3 50%, #bbe354)'}
  />
  <div style:display="flex" style:align-items="center" style:padding="1.6rem" style:flex-grow="1">
    <div
      style:display="flex"
      style:flex-direction="column"
      style:align-items="center"
      style:justify-content="center"
    >
      <div
        style:font-family="ConcourseCaps"
        style:font-size="24px"
        style:line-height="22px"
        style:max-width="130px"
        style:text-align="center"
      >
        lee
      </div>

      <img
        class="logo"
        alt=""
        src={logo}
        height={logoDimensions}
        width={logoDimensions}
        style:display="flex"
        style:padding="14px"
        style:border="2px dashed #2ca0af"
        style:border-radius="50%"
        style:margin=".6rem 0"
      />
      <div
        style:font-family="ConcourseCaps"
        style:font-size="24px"
        style:line-height="22px"
        style:max-width="130px"
        style:text-align="center"
      >
        reamsnyder
      </div>
    </div>

    <div
      style:display="flex"
      style:flex-direction="column"
      style:margin-left="50px"
      style:width={hero ? '620px' : '950px'}
      style:word-break="keep-all"
    >
      <div style:font-family="NewKansas" style:font-size="72px" style:line-height="72px">
        {title}
      </div>

      {#if description}
        <div
          style:display="flex"
          style:height="3px"
          style:width="120px"
          style:background="#e5b8de"
          style:margin-top="40px"
          style:margin-bottom="-5px"
        />
        <div
          style:font-family="Concourse"
          style:font-size="30px"
          style:line-height="36px"
          style:margin-top="20px"
        >
          {description}
        </div>
      {/if}
    </div>
  </div>

  {#if hero}
    <div
      style:position="absolute"
      style:display="flex"
      style:width="545px"
      style:height="545px"
      style:top="50%"
      style:right="-15%"
      style:transform="translate(0, -50%)"
    >
      <img
        alt=""
        src={hero}
        height={heroHeight}
        width={heroWidth}
        style:width="100%"
        style:height="100%"
        style:object-fit="cover"
        style:border-radius="50%"
      />
    </div>
  {/if}

  <div
    style:display="flex"
    style:height="8px"
    style:width="100%"
    style:background-image={'linear-gradient(to left, #931077, #37b5c3 50%, #bbe354)'}
  />
</div>

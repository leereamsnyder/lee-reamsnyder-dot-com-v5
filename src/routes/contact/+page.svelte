<script>
  import AlignWithBodyContent from '$lib/components/AlignWithBodyContent.svelte'
  import BigHonkinPageTitle from '$lib/components/BigHonkinPageTitle.svelte'
  import HtmlTitle from '$lib/components/HtmlTitle.svelte'
  import PageMargin from '$lib/components/PageMargin.svelte'
  import SocialMediaMeta from '$lib/components/SocialMediaMeta.svelte'

  const fields = [
    { label: 'Your Name', name: 'name' },
    { label: 'Email', name: 'email', type: 'email' },
  ]
</script>

<HtmlTitle title="Contact" />
<SocialMediaMeta title="Contact" description="Send me a message" />

<PageMargin>
  <BigHonkinPageTitle isEntryTitle={false}>Send me a message</BigHonkinPageTitle>
</PageMargin>

<AlignWithBodyContent>
  <form name="Contact page" method="POST" action="/thanks" data-netlify="true">
    <!-- 
      For Netlify Forms.
      Netlify's build would insert this for you into static HTML 
      But then Svelte would remove it when the app inits/rehydrates
    -->
    <input type="hidden" name="form-name" value="Contact page" />

    <div class="fields">
      {#each fields as { name, type, label }}
        <label for={name}>
          <span class="label-text">{label}</span>
          <input class="input" type={type || 'text'} id={name} {name} required />
        </label>
      {/each}

      <label for="message" class="label-text">
        <span class="label-text">Message</span>
        <textarea rows="8" class="input" id="message" name="message" required />
      </label>
    </div>
    <button type="submit" class="submit">Send your message</button>
  </form>
</AlignWithBodyContent>

<style>
  .label-text {
    display: block;
    font-size: var(--step-0);
  }

  .input {
    color: inherit;
    font-size: var(--step-0);
    padding: var(--step--2);
    width: 100%;
    max-width: 20em;
    margin-bottom: 1em;
    border: 1px solid var(--meta);
    border-bottom-width: 2px;
    border-radius: 4px;
    background-color: var(--page-background);
  }

  .submit {
    box-sizing: content-box;
    position: relative;
    background: none;
    padding: var(--step--2) var(--step--1);
    border-width: 1px 3px 3px 1px;
    border-color: var(--meta);
    border-radius: 2px;
    color: inherit;
    cursor: pointer;
  }
</style>

<!-- 
  this file has to be here for the adapter-static parser
  because if I send an ACTUAL 404 error, the build fails
-->
<script>
  import ErrorPage from '../+error.svelte'
</script>

<ErrorPage status={404} />

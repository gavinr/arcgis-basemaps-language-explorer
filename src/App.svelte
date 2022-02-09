<script lang="ts">
  import LeafletMap from "./lib/LeafletMap.svelte";

  let center;
  let zoom;
</script>

<main>
  <h1>ArcGIS Basemaps Language Explorer!</h1>

  <!-- <p contenteditable="true" bind:innerHTML={zoom} /> -->
  <p>{zoom}</p>
  <p>{JSON.stringify(center)}</p>

  <div style="height: 400px; width: 500px; float: left;">
    <LeafletMap bind:zoom bind:center />
  </div>

  <div style="height: 400px; width: 500px; float: left;">
    <LeafletMap bind:zoom bind:center />
  </div>

  <div style="clear:both" />

  <p>More info ....</p>
</main>

<style>
</style>

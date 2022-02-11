<script lang="ts">
  import LeafletMap from "./lib/LeafletMap.svelte";
  import Selector from "./lib/Selector.svelte";
  import langageDataJsonInitial from "../languageData.json";

  let center;
  let zoom;
  let selectedStyle;
  let langageDataJson: LangageDataJson;

  interface LangageDataJson {
    styles: { [key: string]: { label: string; selected?: boolean } };
    languages: {
      [key: string]: {
        label: string;
        group_id: string;
        group_url: string;
        maps: { [key: string]: any[] };
      };
    };
  }

  $: if (langageDataJsonInitial) {
    const clone = Object.assign({}, langageDataJsonInitial);
    Object.keys(clone.styles).forEach((key) => {
      clone.styles[key].selected = false;
    });

    langageDataJson = clone;
  }
</script>

<main>
  <h1>ArcGIS Basemaps Language Explorer</h1>

  <p>
    <Selector styles={langageDataJson.styles} bind:selectedStyle />
  </p>

  <div class="mapsWrapper">
    {#each Object.values(langageDataJson.languages) as language, i}
      {#if i < 6}
        <!-- content here -->
        <div class="mapWrapper">
          <LeafletMap
            bind:zoom
            bind:center
            language={language.label}
            layersArray={language.maps[selectedStyle]}
          />
        </div>
      {/if}
    {/each}
  </div>

  <div style="clear:both" />
</main>
<footer class="text-center text-light-gray" style="margin-bottom: 20px;">
  Built by Gavin Rehkemper
</footer>

<style>
  main {
    text-align: center;
  }
  .mapWrapper {
    height: 400px;
    width: 100%;
    /* float: left; */
  }
  .mapsWrapper {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-column-gap: 20px;
    grid-row-gap: 20px;
  }
</style>

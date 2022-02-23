<script lang="ts">
  import LeafletMap from "./lib/LeafletMap.svelte";
  import Selector from "./lib/Selector.svelte";
  import langageDataJsonInitial from "../languageData.json";

  import type { LanguageDataJson } from "./types";

  let center;
  let zoom;
  let selectedStyle = "0320_Light_Gray_Canvas_Title";
  let langageDataJson: LanguageDataJson;
  let initialLanguages = [];

  $: if (langageDataJsonInitial) {
    console.log("langageDataJsonInitial", langageDataJsonInitial);
    const clone = Object.assign({}, langageDataJsonInitial);

    langageDataJson = clone;
    console.log("langageDataJson", langageDataJson);

    const allLanguages = Object.values(langageDataJson.languages);
    // console.log("allLanguages", JSON.stringify(allLanguages));
    allLanguages.sort((a, b) => {
      return a.label < b.label ? -1 : 1;
    });

    for (let i = 0; i < 6; i++) {
      initialLanguages.push(allLanguages.shift());
    }
    console.log("initialLanguages", initialLanguages);
  }
</script>

<main>
  <h1>ArcGIS Basemaps Language Explorer</h1>

  <p>
    <Selector styles={langageDataJson.styles} bind:selectedStyle />
  </p>

  <div class="mapsWrapper">
    {#each initialLanguages as initialLanguage}
      <!-- content here -->
      <div class="mapWrapper">
        <LeafletMap
          bind:zoom
          bind:center
          {initialLanguage}
          {langageDataJson}
          {selectedStyle}
        />
      </div>
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

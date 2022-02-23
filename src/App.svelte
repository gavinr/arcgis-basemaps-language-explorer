<script lang="ts">
  import LeafletMap from "./lib/LeafletMap.svelte";
  import Selector from "./lib/Selector.svelte";
  import langageDataJsonInitial from "../languageData.json";

  let center;
  let zoom;
  let selectedStyle = "0320_Light_Gray_Canvas_Title";
  let langageDataJson: LangageDataJson;
  let initialLanguages = [];

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
    console.log("langageDataJsonInitial", langageDataJsonInitial);
    const clone = Object.assign({}, langageDataJsonInitial);

    langageDataJson = clone;
    console.log("langageDataJson", langageDataJson);

    const allLanguages = Object.keys(langageDataJson.languages);
    console.log("allLanguages", JSON.stringify(allLanguages));
    allLanguages.sort();
    for (let i = 0; i < 6; i++) {
      initialLanguages.push(allLanguages.pop());
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

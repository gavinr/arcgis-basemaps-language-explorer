<script lang="ts">
  import { Map as LeafletMap, Icon, Marker, LayerGroup } from "leaflet";
  import { dynamicMapLayer } from "esri-leaflet";
  import { vectorTileLayer } from "esri-leaflet-vector";
  import "leaflet/dist/leaflet.css";
  import type { LanguageDataJson, LanguageInfo } from "../types";

  export let langageDataJson: LanguageDataJson;
  export let center = { lat: 49, lng: 10 };
  export let zoom = 5;
  export let initialLanguage = {
    id: "en",
    label: "English",
  };
  export let selectedStyle;

  let sortedLanguages: LanguageInfo[];

  let selectedLanguageCode: string = initialLanguage.id;
  let selectedLanguage: LanguageInfo;

  let layerGroup;
  let map: LeafletMap;

  const itemIdFromStyleUrl = (styleUrl) => {
    const regex = new RegExp(".*/items/(.*)/resources.*", "g");
    const id = regex.exec(styleUrl);
    return id[1];
  };

  const mapNode = (domNode): LeafletMap => {
    map = new LeafletMap(domNode);
    layerGroup = new LayerGroup();
    layerGroup.addTo(map);

    map.setView(center, zoom);
    // vectorBasemapLayer("ArcGIS:Streets", {
    //   apiKey, // https://developers.arcgis.com
    // }).addTo(map);

    map.on("moveend", (evt) => {
      console.log("moveEnd", map.getCenter());
      if (JSON.stringify(center) !== JSON.stringify(map.getCenter())) {
        center = map.getCenter();
      }
      if (zoom !== map.getZoom()) {
        zoom = map.getZoom();
        console.log("new zoom", zoom);
      }
    });
  };

  const addLayer = (layerInfo) => {
    if (layerInfo && layerInfo.hasOwnProperty("layerType")) {
      if (layerInfo.layerType === "ArcGISTiledMapServiceLayer") {
        layerGroup.addLayer(
          dynamicMapLayer({
            url: layerInfo.url,
          })
        );
      } else if (layerInfo.layerType === "VectorTileLayer") {
        layerGroup.addLayer(
          vectorTileLayer(itemIdFromStyleUrl(layerInfo.styleUrl))
        );
      } else {
        console.warn("Layer type that we could not handle:", layerInfo);
      }
    } else {
      console.log("issue?", layerInfo);
    }
  };

  $: if (selectedLanguageCode && langageDataJson) {
    selectedLanguage = langageDataJson.languages[selectedLanguageCode];
  }

  $: if (langageDataJson) {
    const allLanguages = Object.values(langageDataJson.languages);
    allLanguages.sort((a, b) => {
      return a.label < b.label ? -1 : 1;
    });
    sortedLanguages = allLanguages;
  }

  $: if (map && layerGroup && selectedLanguage && selectedStyle) {
    layerGroup.eachLayer((layer) => {
      // console.log("layer", layer);
      if (layer._mapboxGL) {
        // https://docs.mapbox.com/mapbox-gl-js/api/map/#map#remove
        layer._mapboxGL.remove();
      }
    });
    layerGroup.clearLayers();

    // assume there are 2 layers for now
    const layersArray = selectedLanguage.maps[selectedStyle];
    addLayer(layersArray[0]);
    setTimeout(() => {
      if (layersArray.length > 1) {
        addLayer(layersArray[1]);
      }
    }, 2000);
  }

  $: if (
    map &&
    center &&
    JSON.stringify(center) !== JSON.stringify(map.getCenter())
  ) {
    map.setView(center);
  }
  $: if (map && zoom && zoom !== map.getZoom()) {
    console.log("setting zoom", zoom);
    map.setZoom(zoom);
  }
</script>

<div class="wrapper">
  <div class="titleArea font-size-4">
    <select bind:value={selectedLanguageCode}>
      {#each sortedLanguages as language}
        <option value={language.id}>{language.label}</option>
      {/each}
    </select>
  </div>
  <div class="map" use:mapNode />
</div>

<style>
  div.wrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
  }
  div.map {
    height: 100%;
    width: 100%;
    margin-bottom: 20px;
  }
  div.titleArea {
    margin: 0 auto 10px;
  }
</style>

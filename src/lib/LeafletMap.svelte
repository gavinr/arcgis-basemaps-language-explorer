<script lang="ts">
  import { Map as LeafletMap, Icon, Marker, LayerGroup } from "leaflet";
  import { dynamicMapLayer } from "esri-leaflet";
  import { vectorTileLayer } from "esri-leaflet-vector";
  import "leaflet/dist/leaflet.css";

  export let layersArray;
  export let center = { lat: 49, lng: 10 };
  export let zoom = 5;
  export let language;
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
      if (JSON.stringify(center) !== JSON.stringify(map.getCenter())) {
        center = map.getCenter();
      }
      if (zoom !== map.getZoom()) {
        zoom = map.getZoom();
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

  $: if (map && layerGroup && layersArray && layersArray.length > 0) {
    // console.log("layersArray", layersArray);
    layerGroup.eachLayer((layer) => {
      // console.log("layer", layer);
      if (layer._mapboxGL) {
        // https://docs.mapbox.com/mapbox-gl-js/api/map/#map#remove
        layer._mapboxGL.remove();
      }
    });
    layerGroup.clearLayers();
    // assume there are 2 layers for now
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
    map.setZoom(zoom);
  }
</script>

<div class="wrapper">
  <div class="font-size-4">{language}</div>
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
</style>

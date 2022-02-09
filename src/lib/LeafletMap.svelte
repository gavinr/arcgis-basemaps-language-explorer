<script lang="ts">
  import { Map as LeafletMap, Icon, Marker } from "leaflet";
  import { vectorTileLayer } from "esri-leaflet-vector";
  import "leaflet/dist/leaflet.css";

  export let center = { lat: 0.0, lng: 0.0 };
  export let zoom = 3;
  let map: LeafletMap;

  const mapNode = (domNode): LeafletMap => {
    map = new LeafletMap(domNode);
    map.setView(center, zoom);
    // vectorBasemapLayer("ArcGIS:Streets", {
    //   apiKey, // https://developers.arcgis.com
    // }).addTo(map);

    vectorTileLayer("b30fcf697a02466f87c2df67bd76b481").addTo(map);

    // TODO: wait until first layer is loaded instead of timeout
    setTimeout(() => {
      vectorTileLayer("b204629f92624862a9f2bf56219fd8a2").addTo(map);
    }, 1000);

    map.on("moveend", (evt) => {
      console.log("moveEnd");
      if (JSON.stringify(center) !== JSON.stringify(map.getCenter())) {
        console.log("setting center");
        center = map.getCenter();
      }
      if (zoom !== map.getZoom()) {
        console.log("setting zoom");
        zoom = map.getZoom();
      }
      // console.log("center", center);
    });
  };

  $: if (
    map &&
    center &&
    JSON.stringify(center) !== JSON.stringify(map.getCenter())
  ) {
    console.log("set view");
    console.log("a", JSON.stringify(center));
    console.log("b", JSON.stringify(map.getCenter()));
    map.setView(center);
  }
  $: if (map && zoom && zoom !== map.getZoom()) {
    console.log("set zoom", zoom, map.getZoom());
    map.setZoom(zoom);
  }
</script>

<div use:mapNode />

<style>
  div {
    height: 100%;
    width: 100%;
  }
</style>

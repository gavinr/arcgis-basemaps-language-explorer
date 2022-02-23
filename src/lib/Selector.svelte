<script lang="ts">
  import type { StyleInfo } from "../types";

  export let styles: {
    [key: string]: StyleInfo;
  } = {};

  export let selectedStyle = "";
</script>

<div>
  {#each Object.entries(styles) as [name, info]}
    <button
      class="btn"
      class:btn-green={name == selectedStyle}
      on:click={() => {
        Object.keys(styles).forEach((key) => {
          styles[key].selected = false;
        });

        // Pass the selected style "up" to the parent compoennt:
        selectedStyle = name;
      }}>{info.label}</button
    >
  {/each}
</div>

<style>
  div {
    text-align: center;
  }
  button {
    margin: 2px;
  }
</style>

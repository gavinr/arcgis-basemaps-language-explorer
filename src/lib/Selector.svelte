<script lang="ts">
  export let styles: { [key: string]: { label: string; selected?: boolean } } =
    {};
  export let selectedStyle = "";
</script>

<div>
  {#each Object.entries(styles) as [name, info]}
    <button
      class="btn"
      class:btn-green={info.selected}
      on:click={() => {
        Object.keys(styles).forEach((key) => {
          styles[key].selected = false;
        });

        // Pass the selected style "up" to the parent compoennt:
        selectedStyle = name;
        info.selected = true;
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

<script>
  import { monaco } from './monaco';
  import { onMount } from 'svelte';

  onMount(() => {
    if (import.meta.env.SSR) return;
    monaco();
  });
</script>

<div id="monaco-editor" />

<style>
  #monaco-editor {
    height: 100%;
  }
</style>

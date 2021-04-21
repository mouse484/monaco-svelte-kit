<script>
	import { Monaco } from './monaco';
	import { onMount } from 'svelte';

	onMount(() => {
		if (import.meta.env.SSR) return;
		new Monaco();
	});
</script>

<div id="monaco-editor" />

<style>
	#monaco-editor {
		height: 100%;
	}
</style>

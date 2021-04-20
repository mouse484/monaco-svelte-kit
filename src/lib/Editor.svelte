<script lang="ts">
	import { onMount } from 'svelte';
	import type { editor } from 'monaco-editor';

	let editor: editor.IStandaloneCodeEditor;
	onMount(() => {
		import('monaco-editor').then((monaco) => {
			editor = monaco.editor.create(document.getElementById('monaco-editor'), {
				language: 'typescript'
			});
		});
	});
</script>

<div id="monaco-editor" />

<style>
	#monaco-editor {
		height: 100%;
	}
</style>

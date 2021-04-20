<script lang="ts" context="module">
	declare global {
		interface Window {
			MonacoEnvironment: { getWorker(moduleId: unknown, label: string): Worker };
		}
	}
</script>

<script lang="ts">
	import { onMount } from 'svelte';
	import type { editor } from 'monaco-editor';
	import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
	import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';

	let editor: editor.IStandaloneCodeEditor;
	onMount(() => {
		if (import.meta.env.SSR) return;
		import('monaco-editor').then((monaco) => {
			self.MonacoEnvironment = {
				getWorker: (_moduleId, label) => {
					if (label === 'typescript' || label === 'javascript') {
						return new tsWorker();
					}
					return new editorWorker();
				}
			};
			editor = monaco.editor.create(document.getElementById('monaco-editor'), {
				language: 'typescript',
				value: ['function x() {', '\tconsole.log("Hello world!");', '}'].join('\n')
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

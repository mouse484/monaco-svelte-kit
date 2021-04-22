type monaco = typeof import('monaco-editor/esm/vs/editor/editor.api');

import type { Environment, editor } from 'monaco-editor/esm/vs/editor/editor.api';

declare global {
	interface Window {
		MonacoEnvironment: Environment;
	}
}

import { getWorker } from './monaco.worker';
import { format } from './format.prettier';

export class Monaco {
	monaco!: monaco;
	constructor() {
		import('./monaco.modules').then(({ monaco }) => {
			this.monaco = monaco;
			this.init();
			this.addTheme('dracula');
			this.setFormatter();
			this.create();
		});
	}
	private init() {
		self.MonacoEnvironment = {
			getWorker
		};
	}
	private create() {
		this.monaco.editor.create(document.getElementById('monaco-editor'), {
			language: 'typescript',
			value: ['function x() {', '\tconsole.log("Hello world!");', '}'].join('\n')
		});
	}
	private addTheme(name: string) {
		import(`./themes/dracula.json`).then((theme) => {
			this.monaco.editor.defineTheme(name, theme.default as editor.IStandaloneThemeData);
			this.monaco.editor.setTheme(name);
		});
	}
	private setFormatter() {
		this.monaco.languages.registerDocumentFormattingEditProvider('typescript', {
			provideDocumentFormattingEdits: (model) => {
				return [
					{
						range: model.getFullModelRange(),
						text: format(model.getValue())
					}
				];
			}
		});
	}
}

type monaco = typeof import('monaco-editor/esm/vs/editor/editor.api');

import type {
  Environment,
  editor,
} from 'monaco-editor/esm/vs/editor/editor.api';

declare global {
  interface Window {
    MonacoEnvironment: Environment;
  }
}

import { getWorker } from './monaco.worker';
import { format } from './format.prettier';

export class Monaco {
  monaco!: monaco;
  editor!: editor.IStandaloneCodeEditor;
  constructor() {
    import('./monaco.modules').then(({ monaco }) => {
      this.monaco = monaco;
      this.init();
      this.setFormatter();
      this.create();
      this.addTheme('dracula');
    });
  }
  private init() {
    self.MonacoEnvironment = {
      getWorker,
    };
  }
  private async create() {
    this.editor = this.monaco.editor.create(
      document.getElementById('monaco-editor'),
      {
        language: 'typescript',
        value: ['function x() {', '\tconsole.log("Hello world!");', '}'].join(
          '\n'
        ),
      }
    );
    const { loadWASM } = await import('onigasm');
    const { Registry } = await import('monaco-textmate');
    const { wireTmGrammars } = await import(
      '$lib/monaco/monaco-editor-textmate'
    );

    const name = 'vs-code-theme-converted';
    await loadWASM('./node_modules/onigasm/lib/onigasm.wasm');

    const registry = new Registry({
      getGrammarDefinition: async () => {
        return {
          format: 'plist',
          content: await (
            await fetch('./src/lib/monaco/themes/TypeScript.tmLanguage.plist')
          ).text(),
        };
      },
    });
    const grammars = new Map();
    grammars.set('typescript', 'source.ts');

    import(`./themes/new/dracula.json`).then((theme) => {
      this.monaco.editor.defineTheme(
        name,
        theme.default as editor.IStandaloneThemeData
      );
      this.monaco.editor.setTheme(name);
    });

    await wireTmGrammars(this.monaco, registry, grammars, this.editor);
  }
  private async addTheme(_name: string) {
    // import(`./themes/dracula.json`).then((theme) => {
    //   this.monaco.editor.defineTheme(
    //     name,
    //     theme.default as editor.IStandaloneThemeData
    //   );
    //   this.monaco.editor.setTheme(name);
    // });
  }
  private setFormatter() {
    this.monaco.languages.getLanguages().map(({ id: language }) => {
      return this.monaco.languages.registerDocumentFormattingEditProvider(
        language,
        {
          provideDocumentFormattingEdits: (model) => {
            return [
              {
                range: model.getFullModelRange(),
                text: format(model.getValue(), language),
              },
            ];
          },
        }
      );
    });
  }
}

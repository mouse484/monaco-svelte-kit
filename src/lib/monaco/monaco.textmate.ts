import { loadWASM } from 'onigasm';
import { wireTmGrammars } from '$lib/monaco/monaco-editor-textmate';
import { Registry } from 'monaco-textmate';

type Textmate = {
  wireTmGrammars: typeof wireTmGrammars;
  grammars: Map<string, string>;
  registry: Registry;
};

export const textmate = async (): Promise<Textmate> => {
  await loadWASM('./node_modules/onigasm/lib/onigasm.wasm');

  const grammars = new Map<string, string>().set('typescript', 'source.ts');

  const registry = new Registry({
    getGrammarDefinition: async (scopeName) => {
      if (scopeName === 'source.ts') {
        return {
          format: 'plist',
          content: await // https://github.com/microsoft/TypeScript-TmLanguage/blob/master/TypeScript.tmLanguage
          (
            await fetch('./src/lib/monaco/grammars/TypeScript.tmLanguage.plist')
          ).text(),
        };
      }
    },
  });
  return { wireTmGrammars, grammars, registry };
};

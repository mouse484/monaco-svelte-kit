import * as prettier from 'prettier/standalone';
import type { Options } from 'prettier';
import tsParser from 'prettier/parser-typescript';
type monaco = typeof import('monaco-editor/esm/vs/editor/editor.api');

const getParser = (
  language: string
): Pick<Options, 'parser'> & Pick<Options, 'plugins'> => {
  switch (language) {
    case 'typescript':
      return { parser: 'typescript', plugins: [tsParser] };
    default:
      return {};
  }
};

const format = (source: string, language: string): string => {
  return prettier.format(source, { singleQuote: true, ...getParser(language) });
};

export const setFormatter = (monaco: monaco) => {
  monaco.languages.getLanguages().forEach(({ id: language }) => {
    monaco.languages.registerDocumentFormattingEditProvider(language, {
      provideDocumentFormattingEdits: (model) => {
        return [
          {
            range: model.getFullModelRange(),
            text: format(model.getValue(), language),
          },
        ];
      },
    });
  });
};

import * as prettier from 'prettier/standalone';
import type { Options } from 'prettier';
import tsParser from 'prettier/parser-typescript';

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

export const format = (source: string, language: string): string => {
  return prettier.format(source, { singleQuote: true, ...getParser(language) });
};

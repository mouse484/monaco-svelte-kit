import * as prettier from 'prettier/standalone';
import tsParser from 'prettier/parser-typescript';

export const format = (source: string) => {
	return prettier.format(source, { parser: 'typescript', plugins: [tsParser] });
};

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
import { setFormatter } from './format.prettier';

export const monaco = async (): Promise<void> => {
  const { monaco } = await import('./monaco.modules');
  const { textmate } = await import('./monaco.textmate');
  const { wireTmGrammars, grammars, registry } = await textmate();

  // Worker
  self.MonacoEnvironment = {
    getWorker,
  };

  // Theme

  const { default: theme } = await import('../../../themes/dracula.json');
  monaco.editor.defineTheme(
    'vs-code-theme-converted',
    theme as editor.IStandaloneThemeData
  );
  monaco.editor.setTheme('vs-code-theme-converted');

  // Formatter (pretttier)
  setFormatter(monaco);

  const editor = monaco.editor.create(
    document.getElementById('monaco-editor'),
    {
      language: 'typescript',
      value: ['function x() {', '\tconsole.log("Hello world!");', '}'].join(
        '\n'
      ),
    }
  );

  await wireTmGrammars(monaco, registry, grammars, editor);
};

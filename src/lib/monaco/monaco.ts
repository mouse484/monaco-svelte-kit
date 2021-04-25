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

export const monaco = async () => {
  const { monaco } = await import('./monaco.modules');

  // Worker
  self.MonacoEnvironment = {
    getWorker,
  };

  // Theme
  const { default: theme } = await import('./themes/dracula.json');

  monaco.editor.defineTheme('dracula', theme as editor.IStandaloneThemeData);
  monaco.editor.setTheme('dracula');

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

  return { monaco, editor };
};

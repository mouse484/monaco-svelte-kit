import type { Environment } from 'monaco-editor/esm/vs/editor/editor.api';

declare global {
  interface Window {
    MonacoEnvironment: Environment;
  }
}

import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';

export const getWorker = (_moduleId, label) => {
  if (label === 'typescript' || label === 'javascript') {
    return new tsWorker();
  }
  return new editorWorker();
};

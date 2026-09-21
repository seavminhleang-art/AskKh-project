import Editor, { loader } from '@monaco-editor/react';
import * as monaco from 'monaco-editor/editor';
import 'monaco-editor/features/register.all';
import EditorWorker from 'monaco-editor/editor/editor.worker.js?worker';
import 'monaco-editor/languages/definitions/javascript/register';
import 'monaco-editor/languages/definitions/typescript/register';
import 'monaco-editor/languages/definitions/python/register';
import 'monaco-editor/languages/definitions/java/register';
import 'monaco-editor/languages/definitions/sql/register';
import 'monaco-editor/languages/definitions/css/register';
import 'monaco-editor/languages/definitions/html/register';
self.MonacoEnvironment = { getWorker: () => new EditorWorker() };
loader.config({ monaco });
export default function CodeEditor({ value, onChange, language, darkMode }) {
  return <Editor height="280px" language={language} value={value} onChange={value => onChange(value ?? '')} theme={darkMode ? 'vs-dark' : 'light'} loading={<p className="p-4 text-sm">Loading code editor…</p>} options={{ minimap: { enabled: false }, fontSize: 14, automaticLayout: true, scrollBeyondLastLine: false, tabSize: 2, wordWrap: 'on', ariaLabel: 'Post code snippet' }}/>;
}

import Editor from "@monaco-editor/react";

export default function CodeEditor({
  value,
  onChange,
  language,
  darkMode,
  ariaLabel = "Post code snippet",
  readOnly = false,
}) {
  return (
    <Editor
      height="280px"
      language={language}
      value={value}
      onChange={(val) => onChange?.(val ?? "")}
      theme={darkMode ? "vs-dark" : "light"}
      loading={<p className="p-4 text-base">Loading code editor…</p>}
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        automaticLayout: true,
        scrollBeyondLastLine: false,
        tabSize: 2,
        wordWrap: "on",
        ariaLabel,
        readOnly,
      }}
    />
  );
}

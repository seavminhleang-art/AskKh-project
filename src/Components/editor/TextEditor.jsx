import { useRef, useState } from "react";
import { Bold, Italic, Heading2, List, ListOrdered, Quote, Link as LinkIcon } from "lucide-react";
import FormattedText from "./FormattedText";
import { useWorkspaceTranslation } from "../../locales/workspace/useWorkspaceTranslation";

const tools = [
  ["Bold", Bold, "**", "**"], ["Italic", Italic, "*", "*"],
  ["Heading", Heading2, "## ", "", true], ["Bullet list", List, "- ", "", true],
  ["Numbered list", ListOrdered, "1. ", "", true], ["Quote", Quote, "> ", "", true],
  ["Link", LinkIcon, "[", "](https://example.com)"],
];
export default function TextEditor({ id, name, value, onChange, placeholder, disabled = false, required = true, minLength = 20 }) {
  const { w } = useWorkspaceTranslation();
  const input = useRef(null);
  const [preview, setPreview] = useState(false);
  function format(prefix, suffix, block) {
    const el = input.current;
    if (!el || disabled) return;
    let start = el.selectionStart;
    let end = el.selectionEnd;
    if (block) {
      start = value.lastIndexOf("\n", start - 1) + 1;
      const lineEnd = value.indexOf("\n", end);
      end = lineEnd < 0 ? value.length : lineEnd;
    }
    const selected = value.slice(start, end) || w("Your text");
    const formatted = block ? selected.split("\n").map(line => prefix + line).join("\n") : prefix + selected + suffix;
    onChange(value.slice(0, start) + formatted + value.slice(end));
    requestAnimationFrame(() => { el.focus(); el.setSelectionRange(start + prefix.length, start + formatted.length - suffix.length); });
  }
  return <div className="text-editor">
    <div className="text-editor-toolbar">
      <div className="text-editor-tools" role="group" aria-label={w("Text formatting")}>
        {tools.map(([label, Icon, prefix, suffix, block]) => <button key={label} type="button" title={w(label)} aria-label={w(label)} disabled={disabled || preview} onMouseDown={event => event.preventDefault()} onClick={() => format(prefix, suffix, block)}><Icon size={17} /></button>)}
      </div>
      <button className="text-editor-preview-button" type="button" aria-pressed={preview} onClick={() => setPreview(!preview)}>{preview ? w("Write") : w("Preview")}</button>
    </div>
    <textarea ref={input} id={id} name={name} value={value} onChange={event => onChange(event.target.value)} placeholder={placeholder} disabled={disabled} required={!preview && required} minLength={minLength} rows={7} style={preview ? { display: "none" } : undefined} onInvalid={() => setPreview(false)} onKeyDown={event => {
      if ((event.ctrlKey || event.metaKey) && ["b", "i"].includes(event.key.toLowerCase())) { event.preventDefault(); const mark = event.key.toLowerCase() === "b" ? "**" : "*"; format(mark, mark); }
    }} />
    {preview && <div className="text-editor-preview">{value.trim() ? <FormattedText>{value}</FormattedText> : <span>{w("Your formatted text will appear here.")}</span>}</div>}
    <div className="text-editor-footer"><span>{w("Select text to format it. Preview before publishing.")}</span><span>{value.length.toLocaleString()} {w("characters")}</span></div>
  </div>;
}

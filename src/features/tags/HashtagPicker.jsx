import { useId, useRef, useState } from "react";
import { X } from "lucide-react";
import { useGetTagsQuery, useCreateTagMutation } from "./tagApi";
import { matchingTags, normalizeTag, resolveTag } from "./tagModel";
import { rowsOf, errorMessage } from "../qa/model";
import { useWorkspaceTranslation } from "../../locales/workspace/useWorkspaceTranslation";

export default function HashtagPicker({ value, onChange, disabled, onBusyChange }) {
  const { w } = useWorkspaceTranslation();
  const query = useGetTagsQuery();
  const [create] = useCreateTagMutation();
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const lock = useRef(false);
  const id = useId();
  const tags = rowsOf(query.data);
  const name = normalizeTag(input);
  const exact = [...tags, ...value].find(tag => normalizeTag(tag.tagName) === name);
  const suggestions = matchingTags(tags, input).filter(tag => !value.some(selected => selected.id === tag.id)).slice(0, 8);
  const valid = name.length >= 2 && name.length <= 50;
  const blocked = disabled || busy;

  function select(tag) {
    if (blocked) return;
    if (!value.some(item => item.id === tag.id)) onChange([...value, tag]);
    setInput("");
    setError("");
  }

  async function add() {
    if (disabled || lock.current || !name) return;
    if (!valid) { setError(w("Use 2–50 characters for a hashtag.")); return; }
    if (exact) { select(exact); return; }
    if (query.isFetching || query.isError) return;
    lock.current = true;
    setBusy(true);
    onBusyChange?.(true);
    setError("");
    try {
      const tag = await resolveTag(name, tags, create, async () => rowsOf(await query.refetch().unwrap()));
      if (!value.some(item => item.id === tag.id)) onChange([...value, tag]);
      setInput("");
    } catch (failure) { setError(errorMessage(failure)); }
    finally { lock.current = false; setBusy(false); onBusyChange?.(false); }
  }

  return <div className="hashtag-picker">
    <div className="hashtag-chips">
      {value.map(tag => <span key={tag.id}>#{tag.tagName}<button type="button" disabled={blocked} aria-label={w("Remove {{name}}", { name: tag.tagName })} onClick={() => onChange(value.filter(item => item.id !== tag.id))}><X size={14} /></button></span>)}
    </div>
    <label htmlFor={id}>{w("Add hashtags")}</label>
    <input id={id} list={`${id}-suggestions`} value={input} disabled={blocked} autoComplete="off" placeholder={w("Type a hashtag…")} aria-describedby={`${id}-help`} onChange={event => { setInput(event.target.value); setError(""); }} onKeyDown={event => {
      if (!event.nativeEvent.isComposing && (event.key === "Enter" || event.key === ",")) { event.preventDefault(); void add(); }
    }} />
    <datalist id={`${id}-suggestions`}>{suggestions.map(tag => <option key={tag.id} value={`#${tag.tagName}`} />)}</datalist>
    <small id={`${id}-help`}>{w("Choose a suggestion or press Enter to add your own hashtag.")}</small>
    {query.isLoading && <small role="status">{w("Loading tags…")}</small>}
    {query.isError && <div role="alert">{w("Could not load tags.")} <button type="button" disabled={blocked} onClick={() => query.refetch()}>{w("Retry")}</button></div>}
    <div className="hashtag-suggestions" aria-label={w("Suggested hashtags")}>
      {suggestions.map(tag => <button key={tag.id} type="button" disabled={blocked} onClick={() => select(tag)}>#{tag.tagName}</button>)}
    </div>
    {name && <button type="button" className="hashtag-add" disabled={blocked || !valid || (!exact && (query.isFetching || query.isError))} onClick={add}>{busy ? w("Creating hashtag…") : exact ? w("Add #{{name}}", { name }) : w("Create #{{name}}", { name })}</button>}
    {error && <p role="alert" className="hashtag-error">{error}</p>}
  </div>;
}

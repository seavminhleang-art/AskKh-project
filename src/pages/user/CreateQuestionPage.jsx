import TextEditor from "../../Components/editor/TextEditor";
import { QUESTION_POST_TYPE_ID } from "../../config/postTypes.js";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Code2, FileImage, Globe2, Send, UploadCloud, X } from "lucide-react";
import { toast } from "react-toastify";
import { useWorkspaceTranslation } from "@/locales/workspace/useWorkspaceTranslation";
import { useWorkspaceSaveMutation } from "../../features/workspace/workspaceApi";
import { message } from "../../features/workspace/workspaceModel";
import { Heading } from "./WorkspaceUI";
import { useUploadSingleMutation, useUploadMultipleMutation } from "../../features/upload/uploadApi";
import { uploadQuestionImages } from "../../features/qa/uploadQuestionImages";
import HashtagPicker from "../../features/tags/HashtagPicker";
const CodeEditor = lazy(() => import("../../Components/miniComponent/CodeEditor"));
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

function Attachment({ file, remove, disabled }) {
  const { w } = useWorkspaceTranslation();
  const image = useRef(null);
  useEffect(() => {
    const url = URL.createObjectURL(file);
    if (image.current) image.current.src = url;
    return () => URL.revokeObjectURL(url);
  }, [file]);
  return <div className="cq-attachment"><img ref={image} alt={file.name} /><span><strong>{file.name}</strong><small>{(file.size / 1024 / 1024).toFixed(2)} MB</small></span><button type="button" disabled={disabled} onClick={remove} aria-label={w("Remove {{name}}", { name: file.name })}><X size={16} /></button></div>;
}

export default function CreateQuestionPage() {
  const { w } = useWorkspaceTranslation();
  const navigate = useNavigate();
  const [save] = useWorkspaceSaveMutation();
  const [uploadSingle] = useUploadSingleMutation();
  const [uploadMultiple] = useUploadMultipleMutation();
  const [selectedTags, setSelectedTags] = useState([]);
  const [tagBusy, setTagBusy] = useState(false);
  const [description, setDescription] = useState("");
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [showCode, setShowCode] = useState(false);
  const [files, setFiles] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState("");
  const picker = useRef(null);
  function addFiles(incoming) {
    if (publishing || tagBusy) return;
    const candidates = Array.from(incoming);
    if (candidates.some(file => !IMAGE_TYPES.includes(file.type) || !file.size || file.size > 5 * 1024 * 1024)) {
      setError(w("Choose JPG, PNG, WebP, or GIF images under 5 MB each.")); return;
    }
    const next = [...files];
    candidates.forEach(file => { if (!next.some(item => item.name === file.name && item.size === file.size && item.lastModified === file.lastModified)) next.push(file); });
    if (next.length > 10) { setError(w("You can attach up to 10 images.")); return; }
    setFiles(next); setError("");
  }
  async function submit(event) {
    event.preventDefault();
    if (publishing || tagBusy) return;
    setError("");
    const form = new FormData(event.currentTarget);
    const title = form.get("title").trim();
    if (title.length < 10 || description.trim().length < 20) { setError(w("Use at least 10 characters for the title and 20 for the description.")); return; }
    if (code.length > 20000 && showCode) { setError(w("Code snippets must be at most 20,000 characters.")); return; }
    const tried = form.get("tried").trim();
    const body = { title, body: description.trim() + (tried ? `\n\n${w("What I have tried:")}\n${tried}` : ""), postTypeId: QUESTION_POST_TYPE_ID, tagIds: selectedTags.map(tag => tag.id), imageUrls: [], codeSnippet: showCode && code.trim() ? code : null, codeLanguage: showCode && code.trim() ? language : null };
    setPublishing(true);
    try {
      body.imageUrls = await uploadQuestionImages(files, uploadSingle, uploadMultiple);
      await save({ resource: "posts", action: "create", body }).unwrap();
      toast.success(w("Your question was published."));
      navigate("/dashboard/questions");
    } catch (failure) { setError(message(failure)); }
    finally { setPublishing(false); }
  }
  return <div className="uw-page cq-page">
    <Heading title={w("Ask a question")} description={w("Share what you are working on. Let the community help.")} />
    <form onSubmit={submit} aria-busy={publishing}>
      {error && <div className="cq-error" role="alert">{error}</div>}
      <fieldset disabled={publishing} className="cq-layout">
        <div className="cq-main">
          <section className="cq-card cq-details">
            <h2>{w("Question Details")}</h2>
            <label htmlFor="cq-title">{w("Question Title")}<span className="cq-required">*</span></label>
            <input id="cq-title" name="title" placeholder={w("Enter a clear and specific title for your question")} required minLength={10} maxLength={300} />
            <small>{w("A good title helps others understand your question quickly.")}</small>
            <label htmlFor="cq-description">{w("Question Description")}<span className="cq-required">*</span></label>
            <div className="cq-editor">
              <div className="cq-editor-toolbar"><span>{w("Description")}</span><button type="button" aria-pressed={showCode} onClick={() => setShowCode(value => !value)}><Code2 size={16} /> {w("Code snippet")}</button></div>
              <TextEditor id="cq-description" name="description" value={description} onChange={setDescription} disabled={publishing} placeholder={w("Write your question in detail…")} />
            </div>
            <small>{w("Provide as much detail as possible so others can give better answers.")}</small>
            {showCode && <div className="cq-code"><label htmlFor="cq-language">{w("Code language")}</label><select id="cq-language" value={language} onChange={event => setLanguage(event.target.value)}>{["javascript", "typescript", "python", "java", "html", "css", "sql", "plaintext"].map(value => <option key={value}>{value}</option>)}</select><Suspense fallback={<span role="status">{w("Loading code editor…")}</span>}><CodeEditor value={code} onChange={setCode} language={language} readOnly={publishing} /></Suspense><small>{code.length.toLocaleString()} / 20,000</small></div>}
            <label htmlFor="cq-tried">{w("What have you tried?")}</label>
            <textarea id="cq-tried" name="tried" rows={2} placeholder={w("Describe what you have already tried (optional)")} />
            <small>{w("This helps others avoid suggesting the same things.")}</small>
          </section>
          <section className="cq-card">
            <h2>{w("Add Attachments")} <span>{w("Optional")}</span></h2>
            <div className={`cq-dropzone ${dragging ? "is-dragging" : ""}`} onDragOver={event => { event.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={event => { event.preventDefault(); setDragging(false); addFiles(event.dataTransfer.files); }}>
              <UploadCloud size={32} strokeWidth={1.6} />
              <span>{w("Drag & drop images here or")} <button type="button" onClick={() => picker.current?.click()}>{w("browse files")}</button></span>
              <small>{w("Up to 10 images · Maximum 5 MB each")}</small><small>{w("Supported formats: JPG, PNG, WebP, GIF")}</small>
              <input ref={picker} type="file" multiple accept={IMAGE_TYPES.join(",")} hidden onChange={event => { addFiles(event.target.files); event.target.value = ""; }} />
            </div>
            {files.length > 0 && <div className="cq-attachments">{files.map((file, index) => <Attachment key={`${file.name}-${file.lastModified}-${file.size}`} file={file} disabled={publishing} remove={() => setFiles(current => current.filter((_, i) => i !== index))} />)}</div>}
          </section>
          <div className="cq-actions"><button type="submit" disabled={publishing || tagBusy} className="cq-submit"><Send size={15} />{publishing ? w("Publishing…") : w("Post Question")}</button><Link to="/dashboard/questions">{w("Cancel")}</Link></div>
        </div>
        <aside className="cq-sidebar">
          <section className="cq-card">
            <h2>{w("Tags")} <span>{w("Optional")}</span></h2>
            <small>{w("Add relevant tags to help others find your question.")}</small>
            <HashtagPicker value={selectedTags} onChange={setSelectedTags} disabled={publishing} onBusyChange={setTagBusy} />
          </section>
          <section className="cq-card"><h2>{w("Visibility")}</h2><small>{w("Who can see your question?")}</small><div className="cq-public"><Globe2 size={18} /><div><strong>{w("Public")}</strong><small>{w("Your question is shared with the community.")}</small></div></div></section>
          <section className="cq-card cq-guide"><FileImage size={21} /><h2>{w("A great question starts here")}</h2><ul><li>{w("Keep the title specific.")}</li><li>{w("Explain what you expected and what happened.")}</li><li>{w("Add code or images when they help.")}</li><li>{w("Leave out passwords and private information.")}</li></ul></section>
        </aside>
      </fieldset>
    </form>
  </div>;
}

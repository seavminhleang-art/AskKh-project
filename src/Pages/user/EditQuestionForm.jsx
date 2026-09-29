import { useState, lazy, Suspense } from "react";
import { Code2 } from "lucide-react";
import { toast } from "react-toastify";
import { useWorkspaceTranslation } from "@/locales/workspace/useWorkspaceTranslation";
import { useWorkspaceSaveMutation } from "../../features/workspace/workspaceApi";
import { message } from "../../features/workspace/workspaceModel";
import { QUESTION_POST_TYPE_ID } from "../../config/postTypes";
import TextEditor from "../../Components/editor/TextEditor";
import HashtagPicker from "../../features/tags/HashtagPicker";

const CodeEditor = lazy(() => import("../../Components/miniComponent/CodeEditor"));

export default function EditQuestionForm({ item, onCancel, onSaved }) {
  const { w } = useWorkspaceTranslation();
  const [save, state] = useWorkspaceSaveMutation();
  const [title, setTitle] = useState(item.title || "");
  const [body, setBody] = useState(item.body || item.description || "");
  const [code, setCode] = useState(item.codeSnippet || "");
  const [language, setLanguage] = useState(item.codeLanguage || "javascript");
  const [showCode, setShowCode] = useState(Boolean(item.codeSnippet));
  const [selectedTags, setSelectedTags] = useState(
    (item.tagResponses ?? []).map((t) => ({
      id: t.id,
      tagName: t.tagName || t.name,
    })),
  );
  const [tagBusy, setTagBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();
    if (state.isLoading || tagBusy) return;

    const trimmedTitle = title.trim();
    const trimmedBody = body.trim();

    if (trimmedTitle.length < 10 || trimmedBody.length < 20) {
      setError(
        w("Use at least 10 characters for the title and 20 for the description."),
      );
      return;
    }

    if (showCode && code.length > 20000) {
      setError(w("Code snippets must be at most 20,000 characters."));
      return;
    }

    setError("");
    try {
      await save({
        resource: "posts",
        action: "update",
        id: item.id,
        body: {
          title: trimmedTitle,
          body: trimmedBody,
          postTypeId: item.postTypeId ?? QUESTION_POST_TYPE_ID,
          tagIds: selectedTags.map((t) => t.id).filter(Boolean),
          imageUrls: item.imageUrls ?? [],
          codeSnippet: showCode && code.trim() ? code : null,
          codeLanguage: showCode && code.trim() ? language : null,
        },
      }).unwrap();
      toast.success(w("Question updated."));
      onSaved?.();
    } catch (failure) {
      setError(message(failure));
    }
  }

  return (
    <form
      className="uw-question-edit"
      onSubmit={submit}
      aria-busy={state.isLoading}
    >
      <div className="uw-report-edit-heading">
        <div>
          <h3>{w("Edit question")}</h3>
          <p>{w("Update the question details below.")}</p>
        </div>
        <button
          type="button"
          className="uw-report-edit-cancel"
          onClick={onCancel}
        >
          {w("Cancel")}
        </button>
      </div>

      {error && (
        <p className="uw-error" role="alert">
          {error}
        </p>
      )}

      <div className="uw-question-edit-fields">
        <label>
          {w("Question Title")}
          <input
            name="title"
            required
            minLength={10}
            maxLength={300}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={state.isLoading}
            placeholder={w("Enter a clear and specific title for your question")}
          />
        </label>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="uw-question-edit-label" style={{ marginBottom: 0 }}>
              {w("Question Description")}
            </span>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              onClick={() => setShowCode((prev) => !prev)}
            >
              <Code2 size={14} />
              {showCode ? w("Hide code snippet") : w("Add code snippet")}
            </button>
          </div>
          <TextEditor
            value={body}
            onChange={setBody}
            disabled={state.isLoading}
            placeholder={w("Write your question in detail…")}
            required
            minLength={20}
          />
        </div>

        {showCode && (
          <div className="space-y-2 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60">
            <div className="flex items-center justify-between">
              <label htmlFor="edit-code-lang" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {w("Code language")}
              </label>
              <select
                id="edit-code-lang"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                disabled={state.isLoading}
                className="text-xs px-2.5 py-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              >
                {[
                  "javascript",
                  "typescript",
                  "python",
                  "java",
                  "html",
                  "css",
                  "sql",
                  "plaintext",
                ].map((val) => (
                  <option key={val} value={val}>
                    {val}
                  </option>
                ))}
              </select>
            </div>
            <Suspense
              fallback={
                <span className="text-xs text-slate-500" role="status">
                  {w("Loading code editor…")}
                </span>
              }
            >
              <CodeEditor
                value={code}
                onChange={setCode}
                language={language}
                readOnly={state.isLoading}
              />
            </Suspense>
            <div className="text-right text-[11px] text-slate-500">
              {code.length.toLocaleString()} / 20,000
            </div>
          </div>
        )}

        <div>
          <span className="uw-question-edit-label">{w("Tags")}</span>
          <HashtagPicker
            value={selectedTags}
            onChange={setSelectedTags}
            disabled={state.isLoading}
            onBusyChange={setTagBusy}
          />
        </div>
      </div>

      <div className="uw-report-edit-actions">
        <button
          className="uw-button"
          type="submit"
          disabled={state.isLoading || tagBusy}
        >
          {state.isLoading ? w("Saving…") : w("Save changes")}
        </button>
        <button
          className="uw-button secondary"
          type="button"
          onClick={onCancel}
          disabled={state.isLoading}
        >
          {w("Cancel")}
        </button>
      </div>
    </form>
  );
}

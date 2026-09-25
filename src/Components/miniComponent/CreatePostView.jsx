import TextEditor from "../editor/TextEditor";
import { QUESTION_POST_TYPE_ID } from "../../config/postTypes.js";
import React, { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Upload } from "lucide-react";
import { useOutletContext } from "react-router-dom";
import { useTranslation } from "react-i18next";

import HashtagPicker from "../../features/tags/HashtagPicker";
import { errorMessage } from "../../features/qa/model";
const CodeEditor = lazy(() => import("./CodeEditor"));

const CreatePostView = ({ onAddPost, onCancel, darkMode: propDarkMode }) => {
  const { t } = useTranslation();
  const context = useOutletContext();
  const darkMode = propDarkMode ?? context?.darkMode ?? false;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);
  const [tagBusy, setTagBusy] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [codeSnippet, setCodeSnippet] = useState("");
  const [codeLanguage, setCodeLanguage] = useState("javascript");
  const [showCode, setShowCode] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const previewUrl = useRef(null);
  useEffect(
    () => () => {
      if (previewUrl.current) URL.revokeObjectURL(previewUrl.current);
    },
    [],
  );

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (
        !["image/jpeg", "image/png", "image/webp", "image/gif"].includes(
          file.type,
        ) ||
        file.size > 5 * 1024 * 1024
      ) {
        setError("Choose a JPG, PNG, WebP, or GIF under 5 MB.");
        return;
      }
      if (previewUrl.current) URL.revokeObjectURL(previewUrl.current);
      previewUrl.current = URL.createObjectURL(file);
      setCoverImage(previewUrl.current);
      setImageFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting || tagBusy) return;
    if (title.trim().length < 10 || content.trim().length < 20) {
      setError(
        "Use at least 10 characters for the title and 20 for the description.",
      );
      return;
    }
    if (codeSnippet.length > 20000) {
      setError("Code must be 20,000 characters or fewer.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await onAddPost({
        title: title.trim(),
        body: content.trim(),
        postTypeId: QUESTION_POST_TYPE_ID,
        tagIds: tags.map(tag => tag.id),
        codeSnippet: showCode ? codeSnippet : null,
        codeLanguage: showCode && codeSnippet ? codeLanguage : null,
        imageUrls: [],
        imageFile,
      });
    } catch (error) {
      setError(errorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className={`min-w-0 flex-1 min-h-screen transition-colors duration-300 p-4 sm:p-6 space-y-6 ${
        darkMode ? "bg-zinc-950 text-slate-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      <h1
        className={`text-5xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}
      >
        {t("create.title")}
      </h1>

      <form
        aria-busy={submitting}
        onSubmit={handleSubmit}
        className="grid grid-cols-1 xl:grid-cols-3 gap-6"
      >
        <div className="xl:col-span-2 space-y-6">
          {/* Details Section */}
          <div
            className={`rounded-2xl p-6 space-y-4 transition-colors ${
              darkMode ? "bg-zinc-900 text-slate-100" : "bg-white text-gray-800"
            }`}
          >
            <h3
              className={`font-bold text-base ${darkMode ? "text-slate-200" : "text-gray-800"}`}
            >
              {t("create.blogDetails")}
            </h3>

            <div>
              <label
                className={`block text-base font-semibold mb-1 ${darkMode ? "text-slate-300" : "text-gray-700"}`}
              >
                {t("create.blogTitleLabel")}{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                minLength={10}
                maxLength={300}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t("create.blogTitleLabel")}
                className={`w-full rounded-xl px-3 py-2 text-base border focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors ${
                  darkMode
                    ? "bg-zinc-800/80 border-zinc-700 text-slate-100 placeholder-zinc-500"
                    : "bg-white border-gray-200 text-gray-900 placeholder-gray-400"
                }`}
                required
              />
            </div>

            <div>
              <label htmlFor="community-description"
                className={`block text-base font-semibold mb-1 ${darkMode ? "text-slate-300" : "text-gray-700"}`}
              >
                {t("create.contentLabel")}
              </label>
              <div
                className={`border rounded-xl overflow-hidden ${darkMode ? "border-zinc-700" : "border-gray-200"}`}
              >
                <TextEditor id="community-description" value={content} onChange={setContent} disabled={submitting} placeholder={t("create.placeholderContent")} />
              </div>
            </div>
          </div>

          <section className="rounded-2xl border border-slate-300/30 p-5 space-y-3">
            <label className="flex items-center gap-2 text-base font-semibold">
              <input
                type="checkbox"
                checked={showCode}
                onChange={(event) => setShowCode(event.target.checked)}
              />
              Add a code snippet
            </label>
            {showCode && (
              <>
                <label className="flex items-center gap-3 text-base">
                  Language
                  <select
                    className="rounded-lg border p-2 bg-transparent"
                    value={codeLanguage}
                    onChange={(event) => setCodeLanguage(event.target.value)}
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
                    ].map((language) => (
                      <option key={language}>{language}</option>
                    ))}
                  </select>
                </label>
                <Suspense fallback={<p>Loading code editor…</p>}>
                  <CodeEditor
                    value={codeSnippet}
                    onChange={setCodeSnippet}
                    language={codeLanguage}
                    darkMode={darkMode}
                  />
                </Suspense>
                <p className="text-base opacity-60">
                  {codeSnippet.length.toLocaleString()} / 20,000 characters
                </p>
              </>
            )}
          </section>
          {error && (
            <p role="alert" className="text-base text-red-500">
              {error}
            </p>
          )}
          {/* Cover Image */}
          <div
            className={`rounded-2xl p-6 space-y-4 transition-colors ${
              darkMode ? "bg-zinc-900" : "bg-white"
            }`}
          >
            <h3
              className={`font-bold text-base ${darkMode ? "text-slate-200" : "text-gray-800"}`}
            >
              {t("create.coverImage")}
            </h3>
            <label
              className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                darkMode
                  ? "border-zinc-700 hover:bg-zinc-800/50"
                  : "border-gray-200 hover:bg-gray-50"
              }`}
            >
              {coverImage ? (
                <img
                  src={coverImage}
                  alt="Cover Preview"
                  className="max-h-40 rounded-xl object-cover"
                />
              ) : (
                <>
                  <Upload
                    className={`w-8 h-8 mb-2 ${darkMode ? "text-zinc-500" : "text-gray-400"}`}
                  />
                  <span
                    className={`text-base font-semibold ${darkMode ? "text-slate-300" : "text-gray-700"}`}
                  >
                    {t("create.uploadFile")}
                  </span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <button
              type="submit"
              disabled={submitting || tagBusy}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-xl text-base transition-colors"
            >
              {submitting ? "Publishing…" : t("create.addBlog")}
            </button>
            <button
              type="button"
              onClick={onCancel}
              disabled={submitting || tagBusy}
              className={`font-medium px-6 py-2 rounded-xl text-base transition-colors border ${
                darkMode
                  ? "bg-red-950/40 text-red-400 hover:bg-red-900/50 border-red-900/30"
                  : "bg-red-50 text-red-500 hover:bg-red-100 border-transparent"
              }`}
            >
              {t("create.cancel")}
            </button>
          </div>
        </div>

        {/* Dynamic Tag Input Sidebar */}
        <div className="space-y-6">
          <div
            className={`rounded-2xl p-6 space-y-4 transition-colors ${
              darkMode ? "bg-zinc-900" : "bg-white"
            }`}
          >
            <h3
              className={`font-bold text-base ${darkMode ? "text-slate-200" : "text-gray-800"}`}
            >
              {t("create.tags")}
            </h3>

            <HashtagPicker value={tags} onChange={setTags} disabled={submitting} onBusyChange={setTagBusy} />
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreatePostView;

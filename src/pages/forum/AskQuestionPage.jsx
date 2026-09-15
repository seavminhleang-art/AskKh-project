import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  HelpCircle,
  Code2,
  Tag,
  Eye,
  CheckCircle2,
  ArrowLeft,
  Info,
} from "lucide-react";
import { forumTags } from "../../data/forumData";
import { useLanguage } from "../../hooks/useLanguage";

export default function AskQuestionPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Frontend");
  const [previewMode, setPreviewMode] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/forum");
  };

  return (
    <div className="space-y-5 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-1">
        <div className="space-y-0.5">
          <Link
            to="/forum"
            className="inline-flex items-center gap-1 text-lg text-slate-500 hover:text-blue-600 mb-1 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{t("qa.backToQuestions")}</span>
          </Link>
          <h1 className="text-3xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            {t("qa.askTitle")}
          </h1>
          <p className="text-lg sm:text-base text-slate-500 dark:text-slate-400">
            {t("qa.askSubtitle")}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setPreviewMode(!previewMode)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-lg font-semibold border transition-colors cursor-pointer ${
            previewMode
              ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300"
              : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200"
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>{previewMode ? t("qa.editMode") : t("qa.preview")}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Main Form (8 cols) */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-2xs space-y-4">
          {previewMode ? (
            <div className="space-y-4">
              <div className="space-y-1 pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="text-[10px] uppercase font-bold text-blue-600">
                  {t("qa.preview")}
                </span>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  {title || "Untitled Question"}
                </h2>
                <div className="flex items-center gap-2 text-lg text-slate-400">
                  <span>
                    {t("common.category")}: {selectedCategory}
                  </span>
                </div>
              </div>
              <div className="text-lg sm:text-base text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed min-h-[140px]">
                {description || t("common.noData")}
              </div>
              <div className="flex flex-wrap gap-1.5 pt-2">
                {tags
                  ? tags.split(",").map((tVal, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md text-[16px] font-medium bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                      >
                        {tVal.trim()}
                      </span>
                    ))
                  : null}
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Question Title */}
              <div className="space-y-1.5">
                <label className="text-lg font-bold text-slate-900 dark:text-white flex items-center justify-between">
                  <span>{t("qa.questionTitle")}</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. How can I use JWT authentication in React?"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 text-lg sm:text-base text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <label className="text-lg font-bold text-slate-900 dark:text-white">
                  {t("common.category")}
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 text-lg sm:text-base text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
                >
                  <option value="Frontend">Frontend (React, Vite, CSS)</option>
                  <option value="Backend">
                    Backend (Spring Boot, Java, APIs)
                  </option>
                  <option value="Database">Database (PostgreSQL, Redis)</option>
                  <option value="DevOps">DevOps & Deployment</option>
                  <option value="General">General Programming & Logic</option>
                </select>
              </div>

              {/* Description Body */}
              <div className="space-y-1.5">
                <label className="text-lg font-bold text-slate-900 dark:text-white flex items-center justify-between">
                  <span>{t("qa.questionDescription")}</span>
                </label>
                <textarea
                  rows={8}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explain the background, what you tried, the exact error message, and code snippets..."
                  className="w-full p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 text-lg sm:text-base text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              {/* Tags */}
              <div className="space-y-1.5">
                <label className="text-lg font-bold text-slate-900 dark:text-white flex items-center justify-between">
                  <span>{t("common.tags")}</span>
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="React, JWT, Authentication, Vite"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 text-lg sm:text-base text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                <Link
                  to="/forum"
                  className="px-4 py-2 rounded-xl text-lg font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  {t("common.cancel")}
                </Link>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-lg font-semibold bg-brand-primary text-white hover:bg-brand-primary-hover transition-colors shadow-2xs cursor-pointer"
                >
                  {t("common.submit")}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Sidebar Help Card (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <Info className="w-4 h-4" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                {t("navigation.needHelp")}
              </h3>
            </div>
            <ol className="text-lg text-slate-500 dark:text-slate-400 space-y-2 pl-4 list-decimal leading-relaxed">
              <li>Summarize your specific issue in the one-line title.</li>
              <li>
                Describe what you expected to happen and what actually occurred.
              </li>
              <li>Add minimal reproducible code inside Markdown backticks.</li>
              <li>Proofread before publishing to ensure tags match.</li>
            </ol>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 shadow-2xs space-y-2.5">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              {t("qa.popularTags")}
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {forumTags.slice(0, 6).map((tVal) => (
                <button
                  key={tVal.name}
                  type="button"
                  onClick={() =>
                    setTags(tags ? `${tags}, ${tVal.name}` : tVal.name)
                  }
                  className="px-2 py-0.5 rounded-md text-[16px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-blue-50 hover:text-blue-600 cursor-pointer"
                >
                  +{tVal.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

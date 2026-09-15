import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { sampleQuestions } from "../../data/forumData";
import { useLanguage } from "../../hooks/useLanguage";

export default function EditQuestionPage() {
  const { t } = useLanguage();
  const { id } = useParams();
  const navigate = useNavigate();
  const question =
    sampleQuestions.find((q) => q.id === id) || sampleQuestions[0];

  const [title, setTitle] = useState(question.title);
  const [description, setDescription] = useState(question.body);
  const [tags, setTags] = useState(question.tags.join(", "));

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/forum/question/${question.id}`);
  };

  return (
    <div className="space-y-5 max-w-3xl mx-auto">
      {/* Header */}
      <div className="space-y-0.5 pb-1">
        <Link
          to={`/forum/question/${question.id}`}
          className="inline-flex items-center gap-1 text-lg text-slate-500 hover:text-blue-600 mb-1 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{t("common.back")}</span>
        </Link>
        <h1 className="text-3xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          {t("qa.editQuestion")}
        </h1>
        <p className="text-lg sm:text-base text-slate-500 dark:text-slate-400">
          Update the details or formatting of your question.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-2xs">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-lg font-bold text-slate-900 dark:text-white">
              {t("qa.questionTitle")}
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 text-lg sm:text-base text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-lg font-bold text-slate-900 dark:text-white">
              {t("qa.questionDescription")}
            </label>
            <textarea
              rows={8}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 text-lg sm:text-base text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-lg font-bold text-slate-900 dark:text-white">
              {t("common.tags")}
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 text-lg sm:text-base text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Link
              to={`/forum/question/${question.id}`}
              className="px-4 py-2 rounded-xl text-lg font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {t("common.cancel")}
            </Link>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-lg font-semibold bg-brand-primary text-white hover:bg-brand-primary-hover transition-colors shadow-2xs cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{t("common.save")}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Clock,
  Tag,
  Edit,
  Share2,
  Bookmark,
  ArrowLeft,
  CheckCircle2,
  Send,
  User,
} from "lucide-react";
import { sampleQuestions } from "../../data/forumData";
import { useLanguage } from "../../hooks/useLanguage";

export default function QuestionDetailPage() {
  const { t } = useLanguage();
  const { id } = useParams();
  const question =
    sampleQuestions.find((q) => q.id === id) || sampleQuestions[0];

  const [votes, setVotes] = useState(question.votes || 24);
  const [hasVoted, setHasVoted] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [answers, setAnswers] = useState(question.answers || []);

  const handleVote = (direction) => {
    if (hasVoted === direction) {
      setVotes((v) => (direction === "up" ? v - 1 : v + 1));
      setHasVoted(null);
    } else {
      setVotes((v) =>
        direction === "up"
          ? hasVoted === "down"
            ? v + 2
            : v + 1
          : hasVoted === "up"
            ? v - 2
            : v - 1,
      );
      setHasVoted(direction);
    }
  };

  const handleAddAnswer = (e) => {
    e.preventDefault();
    if (!newAnswer.trim()) return;
    const answerObj = {
      id: `ans-${Date.now()}`,
      author: {
        name: "You (Current Scholar)",
        username: "scholar",
        role: "ISTAD Scholar",
        avatar:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      },
      content: newAnswer,
      votes: 0,
      createdAt: new Date().toISOString(),
      isAccepted: false,
      comments: [],
    };
    setAnswers([...answers, answerObj]);
    setNewAnswer("");
  };

  return (
    <div className="space-y-5">
      {/* 1. Breadcrumb */}
      <nav className="flex items-center gap-2 text-lg text-slate-500 dark:text-slate-400">
        <Link
          to="/forum"
          className="hover:text-blue-600 flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{t("qa.title")}</span>
        </Link>
        <span>/</span>
        <span className="text-slate-800 dark:text-slate-200 font-medium truncate max-w-md">
          {question.title}
        </span>
      </nav>

      {/* 2. Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Question & Answers (8 cols) */}
        <main className="lg:col-span-8 space-y-4">
          {/* Question Article */}
          <article className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-2xs space-y-4">
            {/* Question Header */}
            <div className="space-y-2 border-b border-slate-100 dark:border-slate-800/80 pb-4">
              <h1 className="text-lg sm:text-3xl font-bold text-slate-900 dark:text-white leading-snug">
                {question.title}
              </h1>

              <div className="flex flex-wrap items-center justify-between gap-2 text-lg text-slate-400 dark:text-slate-500">
                <div className="flex items-center gap-2">
                  <img
                    src={question.author.avatar}
                    alt={question.author.name}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {question.author.name}
                  </span>
                  <span className="text-[16px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {question.author.role}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(question.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <Link
                    to={`/forum/question/${question.id}/edit`}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded text-lg font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Voting & Question Body Layout */}
            <div className="flex items-start gap-4">
              {/* Vote Controls */}
              <div className="flex flex-col items-center gap-1 shrink-0 p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => handleVote("up")}
                  className={`p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer ${
                    hasVoted === "up"
                      ? "text-blue-600 font-bold"
                      : "text-slate-500"
                  }`}
                  aria-label="Upvote"
                >
                  <ThumbsUp className="w-4 h-4" />
                </button>
                <span className="text-lg font-bold text-slate-800 dark:text-slate-200">
                  {votes}
                </span>
                <button
                  type="button"
                  onClick={() => handleVote("down")}
                  className={`p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer ${
                    hasVoted === "down"
                      ? "text-rose-600 font-bold"
                      : "text-slate-500"
                  }`}
                  aria-label="Downvote"
                >
                  <ThumbsDown className="w-4 h-4" />
                </button>
              </div>

              {/* Body Content */}
              <div className="flex-1 min-w-0 space-y-3">
                <div className="text-lg sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line space-y-2">
                  {question.body}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap items-center gap-1.5 pt-2">
                  {question.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[16px] font-medium bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                    >
                      <Tag className="w-2.5 h-2.5 opacity-60" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </article>

          {/* Answers Section */}
          <section className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-blue-600" />
                <span>
                  {answers.length}{" "}
                  {answers.length === 1 ? t("qa.answer") : t("qa.answers")}
                </span>
              </h2>
            </div>

            {answers.map((ans) => (
              <article
                key={ans.id}
                className={`bg-white dark:bg-slate-900 border rounded-xl p-4 sm:p-5 shadow-2xs space-y-3 ${
                  ans.isAccepted
                    ? "border-emerald-300 dark:border-emerald-900/80 ring-1 ring-emerald-500/20"
                    : "border-slate-200/80 dark:border-slate-800"
                }`}
              >
                {ans.isAccepted && (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-lg font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Accepted Solution</span>
                  </div>
                )}

                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={ans.author.avatar}
                      alt={ans.author.name}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                    <div>
                      <span className="text-lg font-bold text-slate-900 dark:text-white block">
                        {ans.author.name}
                      </span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500">
                        {ans.author.role} •{" "}
                        {new Date(ans.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-lg font-bold text-slate-700 dark:text-slate-300">
                    <ThumbsUp className="w-3 h-3 text-slate-500" />
                    <span>{ans.votes}</span>
                  </div>
                </div>

                <div className="text-lg sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line pl-1">
                  {ans.content}
                </div>

                {/* Comments under Answer (No voting on comments) */}
                {Array.isArray(ans.comments) && ans.comments.length > 0 && (
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
                    <span className="text-[16px] font-semibold text-slate-500 uppercase tracking-wider block">
                      {t("activity.comments")}
                    </span>
                    {ans.comments.map((c) => (
                      <div
                        key={c.id}
                        className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-lg text-slate-600 dark:text-slate-300 space-y-1"
                      >
                        <div className="flex items-center justify-between text-[10px] text-slate-400">
                          <span className="font-semibold text-slate-700 dark:text-slate-200">
                            {c.author}
                          </span>
                          <span>
                            {new Date(c.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p>{c.text}</p>
                      </div>
                    ))}
                  </div>
                )}
              </article>
            ))}

            {/* Add Answer Form */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-2xs space-y-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                {t("qa.answers")}
              </h3>
              <form onSubmit={handleAddAnswer} className="space-y-3">
                <textarea
                  rows={4}
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  placeholder={t("qa.writeAnswer")}
                  className="w-full p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 text-lg sm:text-base text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
                />
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-lg font-semibold bg-brand-primary text-white hover:bg-brand-primary-hover transition-colors shadow-2xs cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{t("qa.submitAnswer")}</span>
                  </button>
                </div>
              </form>
            </div>
          </section>
        </main>

        {/* Right Column: Question Info & Related Questions (4 cols) */}
        <aside className="lg:col-span-4 space-y-4">
          {/* Question Metadata Card */}
          <section className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 shadow-2xs space-y-3">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              {t("common.details")}
            </h3>
            <div className="space-y-2 text-lg">
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                <span className="text-slate-400">{t("common.date")}:</span>
                <span>{new Date(question.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                <span className="text-slate-400">{t("common.status")}:</span>
                <span className="font-semibold text-emerald-600">
                  {question.isAnswered
                    ? t("qa.stat_answered")
                    : t("qa.unanswered")}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                <span className="text-slate-400">{t("qa.views")}:</span>
                <span>{question.views}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                <span className="text-slate-400">{t("qa.votes")}:</span>
                <span className="font-bold">{votes}</span>
              </div>
            </div>
          </section>

          {/* Related Questions */}
          <section className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 shadow-2xs space-y-3">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              {t("qa.recentQuestions")}
            </h3>
            <div className="space-y-2.5 divide-y divide-slate-100 dark:divide-slate-800">
              {sampleQuestions
                .filter((q) => q.id !== question.id)
                .slice(0, 3)
                .map((q) => (
                  <div key={q.id} className="pt-2 first:pt-0 space-y-1">
                    <Link
                      to={`/forum/question/${q.id}`}
                      className="text-lg font-semibold text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 line-clamp-2 transition-colors"
                    >
                      {q.title}
                    </Link>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400">
                      <span>{q.votes} votes</span>
                      <span>•</span>
                      <span>{q.answersCount} answers</span>
                    </div>
                  </div>
                ))}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

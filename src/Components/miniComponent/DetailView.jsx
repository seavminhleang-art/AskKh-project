import FormattedText from "../editor/FormattedText.jsx";
import React, { lazy, Suspense, useState } from "react";
import { ArrowLeft, Code2, Send, Trash2 } from "lucide-react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useSelector } from "react-redux";
import {
  useGetCommentsByPostQuery,
  useCreateCommentMutation,
  useDeleteCommentMutation,
} from "../../features/comments/commentApi";
import { rowsOf, errorMessage } from "../../features/qa/model";

const CodeEditor = lazy(() => import("./CodeEditor"));

const DetailView = ({ post, onBack, darkMode: propDarkMode }) => {
  const { t } = useTranslation();
  const context = useOutletContext();
  const darkMode = propDarkMode ?? context?.darkMode ?? false;

  const [commentText, setCommentText] = useState("");
  const [commentCode, setCommentCode] = useState("");
  const [commentLanguage, setCommentLanguage] = useState("javascript");
  const [showCommentCode, setShowCommentCode] = useState(false);

  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const query = useGetCommentsByPostQuery(post.id, { skip: !isAuthenticated });
  const [createComment, creation] = useCreateCommentMutation();
  const [deleteComment, deletion] = useDeleteCommentMutation();
  const [error, setError] = useState("");
  const userId = user?.id ?? user?.userId;
  const sortedComments = rowsOf(
    isAuthenticated ? query.currentData : post.comments,
  ).map((comment) => ({
    ...comment,
    author: {
      name: comment.userDisplayName || "Community member",
      time: comment.creationDate
        ? new Date(comment.creationDate).toLocaleDateString()
        : "",
    },
    isOwnComment: userId != null && String(comment.userId) === String(userId),
  }));
  const codeBlock = showCommentCode && commentCode.trim()
    ? `\n\n\`\`\`${commentLanguage}\n${commentCode.trim()}\n\`\`\``
    : "";
  const commentLength = commentText.trim().length + codeBlock.length;
  async function handleSendComment() {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    const text = `${commentText.trim()}${codeBlock}`;
    if (creation.isLoading || commentLength < 5 || commentLength > 500) return;
    setError("");
    try {
      await createComment({ postId: post.id, text }).unwrap();
      setCommentText("");
      setCommentCode("");
      setShowCommentCode(false);
    } catch (error) {
      setError(errorMessage(error));
    }
  }
  async function handleDeleteComment(id) {
    if (deletion.isLoading) return;
    setError("");
    try {
      await deleteComment(id).unwrap();
    } catch (error) {
      setError(errorMessage(error));
    }
  }

  return (
    <div
      className={`min-w-0 flex-1 rounded-2xl p-6 space-y-6 transition-colors duration-300 ${
        darkMode ? "bg-zinc-900 text-slate-100" : "bg-white text-gray-900"
      }`}
    >
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center text-base text-blue-500 hover:text-blue-600 font-semibold gap-1 hover:underline transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> {t("detail.backToFeed")}
      </button>

      {/* Post Title */}
      <h1
        className={`text-lg font-bold leading-snug ${darkMode ? "text-white" : "text-gray-900"}`}
      >
        {post.title}
      </h1>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {post.tags?.map((tag, i) => (
          <span
            key={i}
            className={`px-2.5 py-1 text-base rounded-full border font-medium ${
              darkMode
                ? "bg-blue-950/50 text-blue-400 border-blue-900/50"
                : "bg-blue-50 text-blue-600 border-blue-100"
            }`}
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* Description */}
      <div>
        <h4
          className={`text-base font-bold tracking-wider uppercase mb-1 ${
            darkMode ? "text-zinc-500" : "text-gray-400"
          }`}
        >
          {t("detail.description")}
        </h4>
        <FormattedText>{post.content || t("detail.noDescription")}</FormattedText>
      </div>

      {post.image && (
        <img
          src={post.image}
          alt="Post attachment"
          className="max-h-96 max-w-full rounded-xl object-contain"
        />
      )}
      {post.codeSnippet && (
        <section className="overflow-hidden rounded-xl border border-slate-300/30">
          <p className="px-4 py-2 text-base opacity-60">
            {post.codeLanguage || "Code"}
          </p>
          <pre className="overflow-auto p-4 text-base">
            <code>{post.codeSnippet}</code>
          </pre>
        </section>
      )}
      {error && (
        <p role="alert" className="text-base text-red-500">
          {error}
        </p>
      )}
      {query.isLoading && <p role="status">Loading comments…</p>}
      {query.isError && (
        <p role="alert">
          Could not load comments.{" "}
          <button onClick={query.refetch}>Retry</button>
        </p>
      )}
      {!isAuthenticated && (
        <p className="text-base">
          <button className="text-blue-500" onClick={() => navigate("/login")}>
            Sign in
          </button>{" "}
          to load all comments and join the discussion.
        </p>
      )}
      {/* Comment Section Input */}
      <div
        className={`space-y-3 pt-4 border-t ${darkMode ? "border-zinc-800" : "border-gray-100"}`}
      >
        <h3
          className={`font-bold text-base ${darkMode ? "text-slate-200" : "text-gray-800"}`}
        >
          {t("detail.commentsTitle")} ({sortedComments.length})
        </h3>
        <div className="space-y-3">
          <textarea
            value={commentText}
            onChange={(event) => setCommentText(event.target.value)}
            maxLength={500}
            rows={4}
            placeholder={t("detail.addCommentPlaceholder")}
            aria-label={t("detail.addCommentPlaceholder")}
            disabled={creation.isLoading}
            className={
              "w-full min-h-28 resize-y rounded-xl border px-4 py-3 text-base leading-relaxed outline-none transition-colors focus:ring-2 focus:ring-blue-500/30 " +
              (darkMode
                ? "border-zinc-700 bg-zinc-800 text-slate-100 placeholder-zinc-500 focus:border-blue-500"
                : "border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:border-blue-500")
            }
          />
          <button
            type="button"
            aria-pressed={showCommentCode}
            onClick={() => setShowCommentCode((visible) => !visible)}
            disabled={creation.isLoading}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-base hover:bg-gray-100"
          >
            <Code2 className="h-4 w-4" /> {t("detail.codeSnippet")}
          </button>
          {showCommentCode && (
            <div className="space-y-2">
              <label className="block text-base">
                {t("detail.codeLanguage")}
                <select
                  value={commentLanguage}
                  onChange={(event) => setCommentLanguage(event.target.value)}
                  disabled={creation.isLoading}
                  className="ml-2 rounded border px-2 py-1"
                >
                  {["javascript", "typescript", "python", "java", "html", "css", "sql", "plaintext"].map((language) => (
                    <option key={language} value={language}>{language}</option>
                  ))}
                </select>
              </label>
              <div className={`overflow-hidden rounded-xl border ${darkMode ? "border-zinc-700" : "border-gray-200"}`}>
                <Suspense fallback={<p className="p-4 text-base">{t("detail.loadingCodeEditor")}</p>}>
                  <CodeEditor
                    value={commentCode}
                    onChange={setCommentCode}
                    language={commentLanguage}
                    darkMode={darkMode}
                    ariaLabel={t("detail.codePlaceholder")}
                    readOnly={creation.isLoading}
                  />
                </Suspense>
              </div>
              <p className="text-sm opacity-60">{commentCode.length.toLocaleString()} / {Math.max(0, 500 - commentText.trim().length)} {t("detail.characters")}</p>
            </div>
          )}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm opacity-60">
              {commentLength}/500 characters · Comments must be 5–500
              characters.
            </p>
            <button
              onClick={handleSendComment}
              disabled={
                creation.isLoading ||
                commentLength < 5 ||
                commentLength > 500
              }
              className="disabled:opacity-50 disabled:cursor-not-allowed bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-base font-medium flex items-center gap-2 transition-colors"
            >
              <Send className="w-4 h-4" /> {t("detail.commentBtn")}
            </button>
          </div>
        </div>
      </div>

      {/* Comment List (Sorted by Most Likes) */}
      {sortedComments.length > 0 && (
        <div className="space-y-4 pt-2">
          {sortedComments.map((comment) => (
            <div
              key={comment.id}
              className={`p-4 border rounded-xl space-y-3 transition-colors ${
                darkMode
                  ? "bg-zinc-800/40 border-zinc-800"
                  : "bg-gray-50/50 border-gray-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-blue-100 text-blue-700">
                    {comment.author.name.slice(0, 1)}
                  </span>
                  <span
                    className={`text-base font-bold ${darkMode ? "text-slate-200" : "text-gray-800"}`}
                  >
                    {comment.author.name}
                  </span>
                  <span
                    className={`text-base ${darkMode ? "text-zinc-500" : "text-gray-400"}`}
                  >
                    {comment.author.time}
                  </span>
                </div>

                {/* Delete Comment Option */}
                {comment.isOwnComment && (
                  <button
                    disabled={deletion.isLoading}
                    onClick={() => handleDeleteComment(comment.id)}
                    className="text-rose-500 hover:text-rose-600 transition-colors p-1"
                    title="Delete Comment"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className={`break-words text-base leading-relaxed ${darkMode ? "text-slate-300" : "text-gray-600"}`}>
                <FormattedText>{comment.text}</FormattedText>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DetailView;

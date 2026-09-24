import React, { useState, lazy, Suspense } from "react";
import { ArrowLeft, Send, Trash2 } from "lucide-react";
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

  const [commentLanguage, setCommentLanguage] = useState("plaintext");
  const [commentText, setCommentText] = useState("");

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
  async function handleSendComment() {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (
      creation.isLoading ||
      commentText.trim().length < 5 ||
      commentText.trim().length > 500
    )
      return;
    setError("");
    try {
      await createComment({
        postId: post.id,
        text: commentText.trim(),
      }).unwrap();
      setCommentText("");
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
        <p
          className={`whitespace-pre-wrap break-words text-[18px] leading-relaxed ${darkMode ? "text-slate-300" : "text-gray-600"}`}
        >
          {post.content || t("detail.noDescription")}
        </p>
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
        <div className="relative">
          <label className="mb-3 flex items-center gap-3 text-base">
            Editor language
            <select
              value={commentLanguage}
              onChange={(event) => setCommentLanguage(event.target.value)}
            >
              {[
                "plaintext",
                "javascript",
                "typescript",
                "python",
                "java",
                "html",
                "css",
                "sql",
              ].map((language) => (
                <option key={language} value={language}>
                  {language === "plaintext" ? "Plain text" : language}
                </option>
              ))}
            </select>
          </label>
          <Suspense fallback={<p role="status">Loading comment editor…</p>}>
            <CodeEditor
              value={commentText}
              onChange={setCommentText}
              language={commentLanguage}
              darkMode={darkMode}
              ariaLabel="Your comment"
              readOnly={creation.isLoading}
            />
          </Suspense>
          <button
            onClick={handleSendComment}
            disabled={
              creation.isLoading ||
              commentText.trim().length < 5 ||
              commentText.trim().length > 500
            }
            className="disabled:opacity-50 disabled:cursor-not-allowed mt-3 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-base font-medium flex items-center gap-1 transition-colors"
          >
            <Send className="w-3 h-3" /> {t("detail.commentBtn")}
          </button>
        </div>
        <p className="text-base opacity-60">
          {commentText.trim().length}/500 characters. Comments must be 5–500
          characters.
        </p>
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

              <p
                className={`whitespace-pre-wrap break-words text-base leading-relaxed ${darkMode ? "text-slate-300" : "text-gray-600"}`}
              >
                {comment.text}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DetailView;

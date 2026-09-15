import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ThumbsUp,
  MessageSquare,
  Eye,
  Tag,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { useVotePostMutation } from "../../features/votes/voteApi";
import { toast } from "sonner";
import { useTranslation } from "../../hooks/useTranslation";

function formatRelativeTime(dateString) {
  if (!dateString) return "";
  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (isNaN(diffInSeconds) || diffInSeconds < 0) return "";
  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return date.toLocaleDateString();
}

export default function QuestionCard({
  question,
  onTagClick,
  isAuthenticated = false,
}) {
  const { t } = useTranslation();
  const [votePost, { isLoading: isVoting }] = useVotePostMutation();

  // Local optimistic vote state
  const [hasVoted, setHasVoted] = useState(Boolean(question.userVote === 1));
  const [scoreDelta, setScoreDelta] = useState(0);

  const handleVote = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error(t("qa_sign_in_to_vote") || "Please sign in to vote.");
      return;
    }

    if (hasVoted) {
      toast.info("You already upvoted this question.");
      return;
    }

    // Optimistic update
    setHasVoted(true);
    setScoreDelta((prev) => prev + 1);

    try {
      await votePost({ postId: question.id, voteTypeId: 1 }).unwrap();
      toast.success(t("qa_vote_success") || "Vote recorded!");
    } catch {
      // Revert on error
      setHasVoted(false);
      setScoreDelta((prev) => prev - 1);
      toast.error(
        t("qa_vote_error") || "Failed to record vote. Please try again.",
      );
    }
  };

  // Extract real API fields defensively
  const score = (question.score ?? 0) + scoreDelta;
  const answerCount = Array.isArray(question.comments)
    ? question.comments.length
    : (question.commentCount ?? 0);
  const views = question.viewCount ?? question.views;

  const authorName =
    question.ownerDisplayName || question.author?.name || "ISTAD Member";
  const authorAvatar = question.ownerAvatar || question.author?.avatar;
  const initials = authorName
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const createdDate = question.creationDate || question.createdAt;
  const relativeTime = formatRelativeTime(createdDate);

  const tags = Array.isArray(question.tagResponses)
    ? question.tagResponses.map((t) =>
        typeof t === "string" ? t : t.tagName || t.name,
      )
    : Array.isArray(question.tags)
      ? question.tags
      : [];

  const rawBody = question.body || "";
  const descriptionPreview = rawBody
    .replace(/<[^>]+>/g, "")
    .replace(/```[\s\S]*?```/g, "[code]")
    .trim();

  const isSolved = Boolean(
    question.isResolved ||
    (Array.isArray(question.comments) &&
      question.comments.some((c) => c.isSolution || c.isAnswer)),
  );

  return (
    <article className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition-all group">
      <div className="flex items-start gap-3 sm:gap-4">
        {/* 1. Vote Button (Post Voting via API) */}
        <div className="flex flex-col items-center justify-center shrink-0">
          <button
            type="button"
            onClick={handleVote}
            disabled={isVoting || hasVoted}
            title={hasVoted ? "You upvoted this" : "Upvote this question"}
            className={`w-11 h-11 rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer select-none border ${
              hasVoted
                ? "bg-blue-600 text-white border-blue-600 shadow-2xs"
                : "bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border-slate-200/60 dark:border-slate-700/60 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-600 hover:border-blue-200 dark:hover:border-blue-800"
            }`}
          >
            <ThumbsUp
              className={`w-3.5 h-3.5 ${hasVoted ? "fill-current" : ""}`}
            />
            <span className="text-lg font-bold leading-none mt-1">{score}</span>
          </button>
        </div>

        {/* 2. Main Question Details */}
        <div className="flex-1 min-w-0 space-y-2">
          {/* Header row: Solved badge (if applicable) + Answer count highlight */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              {isSolved && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Solved</span>
                </span>
              )}
            </div>

            {/* Answer count pill */}
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[16px] font-bold border ${
                answerCount > 0
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-800/60"
                  : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 border-slate-200/60 dark:border-slate-700/60"
              }`}
            >
              <MessageSquare className="w-3 h-3" />
              <span>
                {answerCount}{" "}
                {answerCount === 1 ? t("forum_answer") : t("forum_answers")}
              </span>
            </span>
          </div>

          {/* Title */}
          <Link
            to={`/questions/${question.id}`}
            className="text-lg sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug block line-clamp-2"
          >
            {question.title}
          </Link>

          {/* Description Preview */}
          {descriptionPreview && (
            <p className="text-lg text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
              {descriptionPreview}
            </p>
          )}

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
              {tags.map((tag, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    onTagClick?.(tag);
                  }}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[16px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/50 dark:hover:text-blue-300 border border-slate-200/50 dark:border-slate-700/50 transition-colors cursor-pointer"
                >
                  <Tag className="w-2.5 h-2.5 opacity-60" />
                  <span>{tag}</span>
                </button>
              ))}
            </div>
          )}

          {/* Footer Metadata: Author, Date, View Count */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[16px] text-slate-400 dark:text-slate-500">
            {/* Author + Date */}
            <div className="flex items-center gap-2 min-w-0">
              {authorAvatar ? (
                <img
                  src={authorAvatar}
                  alt={authorName}
                  className="w-5 h-5 rounded-full object-cover shrink-0 border border-slate-200 dark:border-slate-700"
                />
              ) : (
                <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300 font-bold text-[9px] flex items-center justify-center shrink-0 border border-blue-200 dark:border-blue-800">
                  {initials}
                </div>
              )}
              <span className="font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[120px] sm:max-w-none">
                {authorName}
              </span>
              <span>•</span>
              <div className="flex items-center gap-1 shrink-0">
                <Clock className="w-3 h-3" />
                <span>
                  {createdDate
                    ? new Date(createdDate).toLocaleDateString()
                    : ""}
                  {relativeTime ? ` (${relativeTime})` : ""}
                </span>
              </div>
            </div>

            {/* Views if available */}
            {views !== undefined && (
              <div className="flex items-center gap-1 font-medium shrink-0">
                <Eye className="w-3 h-3" />
                <span>{views}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

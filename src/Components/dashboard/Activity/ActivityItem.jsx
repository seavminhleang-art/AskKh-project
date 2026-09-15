import React from "react";
import { Link } from "react-router-dom";
import {
  MessageSquare,
  MessageCircle,
  ThumbsUp,
  Clock,
  Tag,
} from "lucide-react";

function formatRelativeTime(dateString) {
  if (!dateString) return "recently";
  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (isNaN(diffInSeconds) || diffInSeconds < 0) return "recently";
  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}h ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return date.toLocaleDateString();
}

export default function ActivityItem({ item }) {
  const isQuestion = item.type === "question";
  const targetUrl = item.to || `/forum/question/${item.questionId || item.id}`;

  return (
    <div className="py-2.5 first:pt-0 last:pb-0 border-b border-slate-100 dark:border-slate-800/60 last:border-b-0 flex items-start gap-3">
      {/* Activity Type Icon */}
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border border-slate-200/60 dark:border-slate-700/60 mt-0.5 ${
          isQuestion
            ? "bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400"
            : "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400"
        }`}
      >
        {isQuestion ? (
          <MessageSquare className="w-4 h-4" />
        ) : (
          <MessageCircle className="w-4 h-4" />
        )}
      </div>

      {/* Main Details */}
      <div className="flex-1 min-w-0 space-y-0.5">
        {/* Activity Title */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-lg font-semibold text-slate-800 dark:text-slate-200">
            {item.activityType ||
              (isQuestion ? "You asked this question" : "You contributed")}
          </span>
          <span className="flex items-center gap-1 text-[16px] text-slate-400 dark:text-slate-500 shrink-0">
            <Clock className="w-3 h-3" />
            <span>{formatRelativeTime(item.timestamp || item.time)}</span>
          </span>
        </div>

        {/* Question Title / Short Description */}
        <Link
          to={targetUrl}
          className="block text-lg text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors line-clamp-1 leading-snug"
        >
          {item.title}
        </Link>

        {/* Tags & Counts if available */}
        <div className="flex items-center justify-between gap-2 pt-0.5 text-[10px]">
          {Array.isArray(item.tags) && item.tags.length > 0 ? (
            <div className="flex items-center gap-1 flex-wrap">
              {item.tags.slice(0, 2).map((tag, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium"
                >
                  <Tag className="w-2 h-2 opacity-60" />
                  {tag}
                </span>
              ))}
            </div>
          ) : (
            <span />
          )}

          <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 shrink-0 font-medium">
            {item.votes !== undefined && (
              <span className="flex items-center gap-0.5">
                <ThumbsUp className="w-2.5 h-2.5" />
                {item.votes}
              </span>
            )}
            {item.answersCount !== undefined && (
              <span className="flex items-center gap-0.5">
                <MessageSquare className="w-2.5 h-2.5" />
                {item.answersCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

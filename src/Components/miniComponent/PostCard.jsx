import React from "react";
import { Bookmark, Eye, ThumbsUp, MessageSquare } from "lucide-react";
import { useOutletContext } from "react-router-dom";
import { useTranslation } from "react-i18next";

const PostCard = ({
  id,
  title,
  content,
  tags,
  author,
  views,
  likes: voteScore,
  comments,
  image,
  isBookmarked,
  isLiked: isVoted,
  onToggleBookmark,
  onSelectPost,
  onToggleLike: onToggleVote,
  darkMode: propDarkMode,
}) => {
  const { t } = useTranslation();
  const context = useOutletContext();
  const darkMode = propDarkMode ?? context?.darkMode ?? false;

  const commentCount = Array.isArray(comments)
    ? comments.length
    : comments || 0;

  return (
    <div
      className={`rounded-2xl p-4 transition-all ${
        darkMode ? "bg-zinc-900 text-slate-100" : "bg-white text-gray-900"
      }`}
    >
      <div className="flex flex-col sm:flex-row gap-4">
        {image && (
          <img
            src={image}
            alt="Thumbnail"
            className="w-full h-48 sm:w-28 sm:h-28 2xl:w-36 object-cover rounded-xl flex-shrink-0 cursor-pointer"
            onClick={() => onSelectPost(id)}
          />
        )}

        <div className="min-w-0 flex-1 break-words flex flex-col justify-between">
          <div className="flex justify-between items-start gap-2">
            <div>
              <h2
                onClick={() => onSelectPost(id)}
                className={`font-semibold cursor-pointer text-base sm:text-base leading-snug transition-colors ${
                  darkMode
                    ? "text-slate-100 hover:text-blue-400"
                    : "text-gray-800 hover:text-blue-600"
                }`}
              >
                {title}
              </h2>
              {content && (
                <p
                  className={`text-base line-clamp-2 mt-1 ${darkMode ? "text-zinc-400" : "text-gray-500"}`}
                >
                  {content}
                </p>
              )}
            </div>

            <div className="flex items-center space-x-1 flex-shrink-0">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleBookmark(id);
                }}
                aria-pressed={Boolean(isBookmarked)}
                aria-label={t(
                  isBookmarked ? "post.removeBookmark" : "post.addBookmark",
                )}
                title={t(
                  isBookmarked ? "post.removeBookmark" : "post.addBookmark",
                )}
                className={`p-2 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 border ${
                  isBookmarked
                    ? darkMode
                      ? "bg-blue-950/50 text-blue-400 border-blue-900/50"
                      : "bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100"
                    : darkMode
                      ? "bg-zinc-800 text-zinc-400 border-zinc-700 hover:bg-zinc-700 hover:text-slate-200"
                      : "bg-gray-50 text-gray-400 border-transparent hover:bg-gray-100 hover:text-gray-600"
                }`}
              >
                <Bookmark
                  className={`w-4 h-4 ${isBookmarked ? (darkMode ? "fill-blue-400" : "fill-blue-600") : ""}`}
                />
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-1 my-2">
            {tags.map((t, i) => (
              <span
                key={i}
                className={`px-2 py-0.5 text-base font-medium rounded-full border ${
                  darkMode
                    ? "bg-blue-950/50 text-blue-400 border-blue-900/50"
                    : "bg-blue-50 text-blue-600 border-blue-100"
                }`}
              >
                #{t}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 items-center justify-between pt-1">
            <div className="flex items-center space-x-2">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-blue-100 text-blue-700">
                {author.name?.slice(0, 1)}
              </span>
              <div>
                <p
                  className={`text-base font-bold ${darkMode ? "text-slate-200" : "text-gray-800"}`}
                >
                  {author.name}
                </p>
                <p
                  className={`text-base ${darkMode ? "text-zinc-500" : "text-gray-400"}`}
                >
                  {author.time}
                </p>
              </div>
            </div>

            {/* Interactive Views, Votes, Comments */}
            <div
              className={`flex items-center space-x-3 text-base ${darkMode ? "text-zinc-400" : "text-gray-500"}`}
            >
              <button
                onClick={() => onSelectPost(id)}
                className="flex items-center gap-1 hover:text-blue-500 transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                {Number(views).toLocaleString()}
              </button>

              <button
                onClick={() => onToggleVote(id)}
                aria-pressed={Boolean(isVoted)}
                aria-label={t(isVoted ? "post.unvote" : "post.vote")}
                title={t(isVoted ? "post.unvote" : "post.vote")}
                className={`flex items-center gap-1 transition-colors ${
                  isVoted ? "text-blue-600 font-bold" : "hover:text-blue-600"
                }`}
              >
                <ThumbsUp
                  className={`w-3.5 h-3.5 ${isVoted ? "fill-blue-500 text-blue-500" : ""}`}
                />
                {Number(voteScore).toLocaleString()}
              </button>

              <button
                onClick={() => onSelectPost(id)}
                className="flex items-center gap-1 hover:text-blue-500 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                {commentCount}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;

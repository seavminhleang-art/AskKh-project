import React from 'react';
import { Bookmark, Eye, Heart, MessageSquare } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const PostCard = ({ 
  id, 
  title, 
  content, 
  body,
  tags = [], 
  tagResponses,
  author, 
  ownerDisplayName,
  creationDate,
  views = 0, 
  viewCount,
  likes = 0, 
  score,
  comments, 
  image, 
  imageUrls,
  isBookmarked, 
  isLiked,
  onToggleBookmark, 
  onSelectPost, 
  onToggleLike,
  darkMode: propDarkMode 
}) => {
  const { t } = useTranslation();
  const context = useOutletContext();
  const darkMode = propDarkMode ?? context?.darkMode ?? false;

  const normalizedTags = (tagResponses && tagResponses.length > 0)
    ? tagResponses.map((tr) => tr.tagName || tr)
    : (Array.isArray(tags) ? tags : []);

  const authorName = author?.name || ownerDisplayName || 'Scholar';
  const authorAvatar = author?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${authorName}`;
  const displayViews = viewCount !== undefined ? viewCount : views;
  const displayLikes = score !== undefined ? score : likes;
  const displayContent = content || (body ? body.slice(0, 160) + (body.length > 160 ? '...' : '') : '');
  const displayImage = image || (imageUrls && imageUrls[0]) || 'https://picsum.photos/300/200?random=' + (id || 1);
  const commentCount = Array.isArray(comments) ? comments.length : (comments || 0);

  return (
    <div className={`rounded-2xl p-4 transition-all ${
      darkMode ? "bg-zinc-900 text-slate-100" : "bg-white text-gray-900"
    }`}>
      <div className="flex flex-col sm:flex-row gap-4">
        <img 
          src={displayImage} 
          alt="Thumbnail" 
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://picsum.photos/300/200?random=1';
          }}
          className="w-full h-48 sm:w-28 sm:h-28 2xl:w-36 object-cover rounded-xl flex-shrink-0 cursor-pointer"
          onClick={() => onSelectPost(id)} 
        />

        <div className="min-w-0 flex-1 break-words flex flex-col justify-between">
          <div className="flex justify-between items-start gap-2">
            <div>
              <h2 
                onClick={() => onSelectPost(id)} 
                className={`font-semibold cursor-pointer text-xs sm:text-sm leading-snug transition-colors ${
                  darkMode ? "text-slate-100 hover:text-blue-400" : "text-gray-800 hover:text-blue-600"
                }`}
              >
                {title}
              </h2>
              {displayContent && (
                <p className={`text-xs line-clamp-2 mt-1 ${darkMode ? "text-zinc-400" : "text-gray-500"}`}>
                  {displayContent}
                </p>
              )}
            </div>

            <div className="flex items-center space-x-1 flex-shrink-0">
              <button 
                type="button"
                onClick={(e) => { e.stopPropagation(); onToggleBookmark(id); }}
                aria-pressed={Boolean(isBookmarked)}
                aria-label={t(isBookmarked ? "post.removeBookmark" : "post.addBookmark")}
                title={t(isBookmarked ? "post.removeBookmark" : "post.addBookmark")}
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
                <Bookmark className={`w-4 h-4 ${isBookmarked ? (darkMode ? "fill-blue-400" : "fill-blue-600") : ""}`} />
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-1 my-2">
            {normalizedTags.map((tItem, i) => (
              <span 
                key={i} 
                className={`px-2 py-0.5 text-[10px] font-medium rounded-full border ${
                  darkMode 
                    ? "bg-blue-950/50 text-blue-400 border-blue-900/50" 
                    : "bg-blue-50 text-blue-600 border-blue-100"
                }`}
              >
                #{tItem}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 items-center justify-between pt-1">
            <div className="flex items-center space-x-2">
              <img src={authorAvatar} alt={authorName} className="w-6 h-6 rounded-full object-cover" />
              <div>
                <p className={`text-xs font-bold ${darkMode ? "text-slate-200" : "text-gray-800"}`}>
                  {authorName}
                </p>
                <p className={`text-[10px] ${darkMode ? "text-zinc-500" : "text-gray-400"}`}>
                  {author?.time || (creationDate ? new Date(creationDate).toLocaleDateString() : 'Recent')}
                </p>
              </div>
            </div>

            {/* Interactive Views, Likes, Comments */}
            <div className={`flex items-center space-x-3 text-[11px] ${darkMode ? "text-zinc-400" : "text-gray-500"}`}>
              <button 
                onClick={() => onSelectPost(id)}
                className="flex items-center gap-1 hover:text-blue-500 transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                {Number(displayViews).toLocaleString()}
              </button>

              <button 
                onClick={() => onToggleLike(id)}
                aria-pressed={Boolean(isLiked)}
                aria-label={t(isLiked ? "post.unlike" : "post.like")}
                className={`flex items-center gap-1 transition-colors ${
                  isLiked ? "text-rose-500 font-bold" : "hover:text-rose-500"
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${isLiked ? "fill-rose-500 text-rose-500" : ""}`} />
                {Number(displayLikes).toLocaleString()}
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
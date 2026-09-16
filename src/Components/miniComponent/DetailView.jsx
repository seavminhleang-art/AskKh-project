import React, { useState } from 'react';
import { ArrowLeft, Send, Heart, Trash2 } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const DetailView = ({ post, onBack, onUpdateComments, darkMode: propDarkMode }) => {
  const { t } = useTranslation();
  const context = useOutletContext();
  const darkMode = propDarkMode ?? context?.darkMode ?? false;

  const [commentText, setCommentText] = useState("");

  const commentsList = Array.isArray(post.comments) ? post.comments : [];

  // Add a new comment
  const handleSendComment = () => {
    if (commentText.trim() === "") return;

    const newComment = {
      id: Date.now(),
      text: commentText.trim(),
      author: {
        name: "Mom Lisa",
        avatar: '../../src/assets/Website/Lisa.jpg',
        time: "Just now"
      },
      likes: 0,
      isLiked: false,
      isOwnComment: true
    };

    const updated = [...commentsList, newComment];
    onUpdateComments(updated);
    setCommentText("");
  };

  // Delete a comment
  const handleDeleteComment = (commentId) => {
    const updated = commentsList.filter((c) => c.id !== commentId);
    onUpdateComments(updated);
  };

  // Toggle comment like (+1 / -1 loop)
  const handleToggleCommentLike = (commentId) => {
    const updated = commentsList.map((c) => {
      if (c.id === commentId) {
        const isLiked = c.isLiked;
        return {
          ...c,
          isLiked: !isLiked,
          likes: isLiked ? c.likes - 1 : c.likes + 1
        };
      }
      return c;
    });
    onUpdateComments(updated);
  };

  // Sort comments by highest likes first
  const sortedComments = [...commentsList].sort((a, b) => b.likes - a.likes);

  return (
    <div className={`min-w-0 flex-1 rounded-2xl p-6 space-y-6 transition-colors duration-300 ${
      darkMode ? "bg-zinc-900 text-slate-100" : "bg-white text-gray-900"
    }`}>
      {/* Back Button */}
      <button 
        onClick={onBack} 
        className="flex items-center text-xs text-blue-500 hover:text-blue-600 font-semibold gap-1 hover:underline transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> {t('detail.backToFeed')}
      </button>

      {/* Post Title */}
      <h1 className={`text-lg font-bold leading-snug ${darkMode ? "text-white" : "text-gray-900"}`}>
        {post.title}
      </h1>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {post.tags?.map((tag, i) => (
          <span 
            key={i} 
            className={`px-2.5 py-1 text-xs rounded-full border font-medium ${
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
        <h4 className={`text-[10px] font-bold tracking-wider uppercase mb-1 ${
          darkMode ? "text-zinc-500" : "text-gray-400"
        }`}>
          {t('detail.description')}
        </h4>
        <p className={`text-xs leading-relaxed ${darkMode ? "text-slate-300" : "text-gray-600"}`}>
          {post.content || t('detail.noDescription')}
        </p>
      </div>

      {/* Comment Section Input */}
      <div className={`space-y-3 pt-4 border-t ${darkMode ? "border-zinc-800" : "border-gray-100"}`}>
        <h3 className={`font-bold text-sm ${darkMode ? "text-slate-200" : "text-gray-800"}`}>
          {t('detail.commentsTitle')} ({sortedComments.length})
        </h3>
        <div className="relative">
          <textarea 
            rows="3" 
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder={t('detail.addCommentPlaceholder')}
            className={`w-full rounded-xl p-3 text-xs border focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors ${
              darkMode 
                ? "bg-zinc-800/80 border-zinc-700 text-slate-100 placeholder-zinc-500" 
                : "bg-gray-50 border-gray-100 text-gray-900 placeholder-gray-400"
            }`}
          ></textarea>
          <button 
            onClick={handleSendComment}
            className="absolute bottom-3 right-3 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors"
          >
            <Send className="w-3 h-3" /> {t('detail.commentBtn')}
          </button>
        </div>
      </div>

      {/* Comment List (Sorted by Most Likes) */}
      {sortedComments.length > 0 && (
        <div className="space-y-4 pt-2">
          {sortedComments.map((comment) => (
            <div 
              key={comment.id} 
              className={`p-4 border rounded-xl space-y-3 transition-colors ${
                darkMode ? "bg-zinc-800/40 border-zinc-800" : "bg-gray-50/50 border-gray-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <img src={comment.author.avatar} alt={comment.author.name} className="w-6 h-6 rounded-full object-cover" />
                  <span className={`text-xs font-bold ${darkMode ? "text-slate-200" : "text-gray-800"}`}>
                    {comment.author.name}
                  </span>
                  <span className={`text-[10px] ${darkMode ? "text-zinc-500" : "text-gray-400"}`}>
                    {comment.author.time}
                  </span>
                </div>

                {/* Delete Comment Option */}
                {comment.isOwnComment && (
                  <button 
                    onClick={() => handleDeleteComment(comment.id)}
                    className="text-rose-500 hover:text-rose-600 transition-colors p-1"
                    title="Delete Comment"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <p className={`text-xs leading-relaxed ${darkMode ? "text-slate-300" : "text-gray-600"}`}>
                {comment.text}
              </p>

              {/* Comment Like Button */}
              <div className="flex items-center space-x-2 pt-1">
                <button 
                  onClick={() => handleToggleCommentLike(comment.id)}
                  className={`flex items-center gap-1 text-[11px] transition-colors ${
                    comment.isLiked ? "text-rose-500 font-bold" : darkMode ? "text-zinc-400 hover:text-rose-400" : "text-gray-500 hover:text-rose-500"
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${comment.isLiked ? "fill-rose-500 text-rose-500" : ""}`} />
                  {comment.likes}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DetailView;
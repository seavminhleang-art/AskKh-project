import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Heart, Trash2, ImagePlus, X } from 'lucide-react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
  useGetCommentsByPostQuery,
  useCreateCommentMutation,
  useDeleteCommentMutation,
} from '../../features/comments/commentApi';
import { useGetAnswersQuery, useCreateAnswerMutation } from '../../features/posts/postApi';

const DetailView = ({ post, onBack, darkMode: propDarkMode }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const context = useOutletContext();
  const darkMode = propDarkMode ?? context?.darkMode ?? false;
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const { data: apiComments = [], isLoading: isCommentsLoading, refetch: refetchComments } = useGetCommentsByPostQuery(post?.id, {
    skip: !post?.id,
  });
  const { data: apiAnswers = [] } = useGetAnswersQuery(post?.id, { skip: !post?.id });
  const [createComment, { isLoading: isPostingComment }] = useCreateCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();

  const [commentText, setCommentText] = useState("");
  const [commentImage, setCommentImage] = useState(null);
  const [imageError, setImageError] = useState("");
  const [isReadingImage, setIsReadingImage] = useState(false);
  const imageReader = useRef(null);

  useEffect(() => () => imageReader.current?.abort(), []);

  const handleSelectImage = (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    imageReader.current?.abort();
    setIsReadingImage(false);
    setImageError("");
    setCommentImage(null);
    if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type)) {
      setImageError(t('detail.imageTypeError'));
      return;
    }
    if (file.size === 0 || file.size > 5 * 1024 * 1024) {
      setImageError(t('detail.imageSizeError'));
      return;
    }
    const reader = new FileReader();
    imageReader.current = reader;
    setIsReadingImage(true);
    reader.onload = () => {
      setCommentImage({ src: reader.result, name: file.name });
      setIsReadingImage(false);
    };
    reader.onerror = () => {
      setImageError(t('detail.imageReadError'));
      setIsReadingImage(false);
    };
    reader.readAsDataURL(file);
  };

  const commentsList = Array.isArray(apiComments) && apiComments.length > 0
    ? apiComments
    : (Array.isArray(post?.comments) ? post.comments : []);

  // Add a new comment via live REST API
  const handleSendComment = async () => {
    if (!isAuthenticated) {
      toast.info('Please log in to leave a comment');
      navigate('/login');
      return;
    }

    const trimmed = commentText.trim();
    if (trimmed.length < 5) {
      toast.error('Comment must be at least 5 characters long.');
      return;
    }

    try {
      await createComment({
        postId: post.id,
        text: trimmed,
      }).unwrap();

      setCommentText("");
      setCommentImage(null);
      setImageError("");
      toast.success('Comment added!');
      refetchComments();
    } catch (err) {
      console.error('Failed to post comment:', err);
      toast.error(err?.data?.message || 'Failed to post comment');
    }
  };

  // Delete a comment via live REST API
  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId).unwrap();
      toast.success('Comment deleted');
      refetchComments();
    } catch (err) {
      console.error('Failed to delete comment:', err);
      toast.error(err?.data?.message || 'Failed to delete comment');
    }
  };

  const sortedComments = [...commentsList];

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
            className={`w-full rounded-xl p-3 pb-14 text-xs border focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors ${
              darkMode 
                ? "bg-zinc-800/80 border-zinc-700 text-slate-100 placeholder-zinc-500" 
                : "bg-gray-50 border-gray-100 text-gray-900 placeholder-gray-400"
            }`}
          ></textarea>
          <button 
            onClick={handleSendComment}
            disabled={isReadingImage || (!commentText.trim() && !commentImage)}
            className="disabled:opacity-50 disabled:cursor-not-allowed absolute bottom-3 right-3 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors"
          >
            <Send className="w-3 h-3" /> {t('detail.commentBtn')}
          </button>
        </div>
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg text-xs font-medium text-blue-500 focus-within:ring-2 focus-within:ring-blue-500">
          <ImagePlus className="h-4 w-4" />
          {t('detail.uploadImage')}
          <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handleSelectImage} className="sr-only" />
        </label>
        <p className="text-xs text-zinc-500">{t('detail.imageHint')}</p>
        {isReadingImage && <p role="status" className="text-xs">{t('detail.imageLoading')}</p>}
        {imageError && <p role="alert" className="text-xs text-rose-500">{imageError}</p>}
        {commentImage && (
          <div className="relative w-fit">
            <img src={commentImage.src} alt={commentImage.name} className="max-h-48 max-w-full rounded-xl object-contain" />
            <button type="button" onClick={() => setCommentImage(null)} aria-label={t('detail.removeImage')} className="absolute right-2 top-2 rounded-full bg-zinc-900/80 p-1 text-white">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
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
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-[10px]">
                    {(comment.userDisplayName || comment.author?.name || 'S').charAt(0).toUpperCase()}
                  </div>
                  <span className={`text-xs font-bold ${darkMode ? "text-slate-200" : "text-gray-800"}`}>
                    {comment.userDisplayName || comment.author?.name || 'Scholar'}
                  </span>
                  <span className={`text-[10px] ${darkMode ? "text-zinc-500" : "text-gray-400"}`}>
                    {comment.creationDate ? new Date(comment.creationDate).toLocaleDateString() : (comment.author?.time || 'Recent')}
                  </span>
                </div>

                {/* Delete Comment Option */}
                {(comment.isOwnComment || comment.userId === user?.id) && (
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

              {comment.image && <img src={comment.image.src} alt={comment.image.name} className="max-h-80 max-w-full rounded-xl object-contain" />}

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
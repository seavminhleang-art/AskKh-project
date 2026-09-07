import React, { useState } from 'react';
import { ThumbsUp, CheckCircle, MessageCircle, Clock, ShieldCheck, Send } from 'lucide-react';
import Avatar from '../../components/ui/Avatar';
import Button from '../../components/ui/Button';
import Textarea from '../../components/ui/Textarea';
import {
  useVoteAnswerMutation,
  useAcceptAnswerMutation,
  useAddCommentMutation,
} from '../../store/api/apiSlice';
import { useAppSelector } from '../../hooks/useAppStore';
import { toast } from 'sonner';

export default function AnswerItem({ answer, questionId, isQuestionAuthor }) {
  const { user } = useAppSelector((state) => state.auth);

  const [showCommentBox, setShowCommentBox] = useState(false);
  const [commentText, setCommentText] = useState('');

  const [voteAnswer, { isLoading: isVoting }] = useVoteAnswerMutation();
  const [acceptAnswer, { isLoading: isAccepting }] = useAcceptAnswerMutation();
  const [addComment, { isLoading: isCommenting }] = useAddCommentMutation();

  const authorName = answer.ownerDisplayName || answer.author?.name || 'ISTAD Scholar';
  const authorAvatar = answer.author?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(authorName)}`;
  const contentText = answer.body || answer.content || '';
  const score = answer.score ?? answer.votes ?? 0;
  const createdDate = answer.creationDate || answer.createdAt || new Date().toISOString();

  const handleVote = async () => {
    try {
      await voteAnswer({ postId: answer.id, voteTypeId: 1 }).unwrap();
      toast.success('Vote recorded!');
    } catch {
      toast.error('Failed to vote on answer.');
    }
  };

  const handleAccept = async () => {
    try {
      await acceptAnswer({ postId: answer.id, questionId, answerId: answer.id }).unwrap();
      toast.success('Answer marked as accepted solution!');
    } catch {
      toast.error('Failed to accept answer.');
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      await addComment({
        postId: answer.id || questionId,
        text: commentText,
        content: commentText,
      }).unwrap();
      setCommentText('');
      setShowCommentBox(false);
      toast.success('Comment added');
    } catch {
      toast.error('Failed to add comment.');
    }
  };

  return (
    <div
      className={`p-6 rounded-2xl border transition-all ${
        answer.isAccepted
          ? 'border-emerald-500/40 bg-emerald-50/20 dark:bg-emerald-950/10 dark:border-emerald-700/50 ring-1 ring-emerald-500/20'
          : 'border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900'
      }`}
    >
      {/* Accepted banner */}
      {answer.isAccepted && (
        <div className="flex items-center gap-1.5 text-xs font-extrabold text-emerald-600 dark:text-emerald-400 mb-3 pb-2 border-b border-emerald-500/20">
          <CheckCircle className="w-4 h-4 text-emerald-500" />
          <span>ACCEPTED SOLUTION BY AUTHOR</span>
        </div>
      )}

      <div className="flex items-start gap-4">
        {/* Vote controls */}
        <div className="flex flex-col items-center gap-2 shrink-0">
          <button
            onClick={handleVote}
            disabled={isVoting}
            className={`w-9 h-9 rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer ${
              answer.userVote === 1
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:text-blue-600'
            }`}
          >
            <ThumbsUp className="w-3.5 h-3.5" />
            <span className="text-[11px] font-bold leading-none mt-0.5">{score}</span>
          </button>

          {isQuestionAuthor && !answer.isAccepted && (
            <button
              onClick={handleAccept}
              disabled={isAccepting}
              title="Mark as accepted solution"
              className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors cursor-pointer"
            >
              <CheckCircle className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Answer Content */}
        <div className="flex-1 min-w-0 space-y-3">
          <div className="prose dark:prose-invert max-w-none text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line">
            {contentText}
          </div>

          {/* Code snippet if provided */}
          {answer.codeSnippet && (
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 overflow-x-auto">
              <pre className="font-mono text-xs text-emerald-400">
                <code>{answer.codeSnippet}</code>
              </pre>
            </div>
          )}

          {/* Author info & timestamp */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <Avatar src={authorAvatar} name={authorName} size="xs" />
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {authorName}
              </span>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{new Date(createdDate).toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={() => setShowCommentBox(!showCommentBox)}
              className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Reply / Comment</span>
            </button>
          </div>

          {/* Inline Comment box */}
          {showCommentBox && (
            <form onSubmit={handleAddComment} className="pt-2 space-y-2">
              <Textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a clarifying note or feedback..."
                rows={2}
                className="text-xs"
              />
              <div className="flex justify-end gap-2">
                <Button size="xs" variant="outline" type="button" onClick={() => setShowCommentBox(false)}>
                  Cancel
                </Button>
                <Button size="xs" variant="default" type="submit" isLoading={isCommenting}>
                  Send
                </Button>
              </div>
            </form>
          )}

          {/* Existing comments */}
          {answer.comments && answer.comments.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              {answer.comments.map((cmt) => (
                <div key={cmt.id} className="text-xs p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 flex items-start gap-2">
                  <span className="font-bold text-slate-700 dark:text-slate-300">{cmt.author?.name || cmt.userDisplayName || 'Scholar'}:</span>
                  <span className="text-slate-600 dark:text-slate-400">{cmt.text || cmt.content}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

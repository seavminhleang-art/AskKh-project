import React from 'react';
import { Link } from 'react-router-dom';
import {
  ThumbsUp,
  MessageSquare,
  Eye,
  CheckCircle2,
  Tag,
  Clock,
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Avatar from '../../components/ui/Avatar';
import Badge from '../../components/ui/Badge';
import { useVotePostMutation } from '../../store/api/apiSlice';
import { toast } from 'sonner';

export default function QuestionCard({ question }) {
  const [votePost, { isLoading }] = useVotePostMutation();

  const handleVote = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await votePost({ postId: question.id, voteTypeId: 1 }).unwrap();
      toast.success('Vote recorded!');
    } catch {
      toast.error('Failed to register vote. Please login if you haven\'t.');
    }
  };

  const tags = Array.isArray(question.tagResponses)
    ? question.tagResponses.map((t) => (typeof t === 'string' ? t : t.name))
    : Array.isArray(question.tags)
    ? question.tags
    : [];

  const category = tags[0] || question.category || 'General';
  const authorName = question.ownerDisplayName || question.author?.name || 'ISTAD Scholar';
  const authorAvatar = question.author?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(authorName)}`;
  const descriptionText = question.body || question.description || '';
  const score = question.score ?? question.votes ?? 0;
  const answerCount = question.answers?.length ?? question.commentCount ?? 0;
  const isAccepted = question.answers?.some((a) => a.isAccepted) || question.isResolved;
  const views = question.viewCount ?? question.views ?? 1;
  const createdDate = question.creationDate || question.createdAt || new Date().toISOString();

  return (
    <Card className="p-5 sm:p-6 transition-all" hover>
      <div className="flex items-start gap-4">
        {/* Vote Counter & Actions */}
        <div className="flex flex-col items-center justify-center shrink-0">
          <button
            onClick={handleVote}
            disabled={isLoading}
            className={`w-11 h-11 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer ${
              question.userVote === 1
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-600'
            }`}
            title="Upvote question"
          >
            <ThumbsUp className="w-4 h-4" />
            <span className="text-xs font-bold leading-none mt-1">{score}</span>
          </button>
        </div>

        {/* Content Details */}
        <div className="flex-1 min-w-0 space-y-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="blue">{category}</Badge>
            {isAccepted && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                <CheckCircle2 className="w-3 h-3" />
                Solved
              </span>
            )}
          </div>

          <Link to={`/community/questions/${question.id}`} className="block group">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
              {question.title}
            </h3>
          </Link>

          <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {descriptionText}
          </p>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              {tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-medium bg-slate-100 text-slate-600 dark:bg-slate-800/80 dark:text-slate-300 hover:bg-slate-200 transition-colors"
                >
                  <Tag className="w-2.5 h-2.5 opacity-60" />
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Card Footer Meta */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs text-slate-500 dark:text-slate-400">
            {/* Author */}
            <div className="flex items-center gap-2">
              <Avatar
                src={authorAvatar}
                name={authorName}
                size="xs"
              />
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {authorName}
              </span>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{new Date(createdDate).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Counters */}
            <div className="flex items-center gap-3">
              <span
                className={`inline-flex items-center gap-1 font-semibold ${
                  answerCount > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                {answerCount} {answerCount === 1 ? 'answer' : 'answers'}
              </span>
              <span className="inline-flex items-center gap-1 text-slate-400">
                <Eye className="w-3.5 h-3.5" />
                {views}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MessageSquare,
  Sparkles,
  Bookmark,
  Bell,
  Trash2,
  Clock,
} from 'lucide-react';
import Card from '../../components/ui/Card';
import {
  useMarkNotificationReadMutation,
  useDeleteNotificationMutation,
} from '../../store/api/apiSlice';
import { toast } from 'sonner';

export default function NotificationItem({ notification }) {
  const navigate = useNavigate();
  const [markRead] = useMarkNotificationReadMutation();
  const [deleteNotif] = useDeleteNotificationMutation();

  const getIcon = () => {
    switch (notification.type) {
      case 'question_answer':
      case 'comment':
        return <MessageSquare className="w-5 h-5 text-blue-500" />;
      case 'match_found':
        return <Sparkles className="w-5 h-5 text-amber-500" />;
      case 'claim_update':
        return <Bookmark className="w-5 h-5 text-emerald-500" />;
      default:
        return <Bell className="w-5 h-5 text-indigo-500" />;
    }
  };

  const handleAction = () => {
    if (!notification.isRead) {
      markRead(notification.id);
    }
    if (notification.link) {
      navigate(notification.link);
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    deleteNotif(notification.id);
    toast.success('Notification removed');
  };

  return (
    <Card
      onClick={handleAction}
      className={`p-4 sm:p-5 transition-all cursor-pointer flex items-start gap-4 ${
        !notification.isRead
          ? 'bg-blue-50/40 dark:bg-blue-950/20 border-blue-200/80 dark:border-blue-900/40'
          : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
      }`}
      hover
    >
      <div className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center shrink-0 shadow-2xs border border-slate-200/60 dark:border-slate-700">
        {getIcon()}
      </div>

      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center justify-between gap-2">
          <h4
            className={`text-sm tracking-tight truncate ${
              !notification.isRead
                ? 'font-bold text-slate-900 dark:text-white'
                : 'font-medium text-slate-700 dark:text-slate-300'
            }`}
          >
            {notification.title}
          </h4>
          <span className="text-[11px] text-slate-400 shrink-0 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          {notification.message}
        </p>
      </div>

      <button
        onClick={handleDelete}
        className="text-slate-400 hover:text-rose-500 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        title="Delete notification"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </Card>
  );
}

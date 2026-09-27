import React from "react";
import { useNavigate } from "react-router-dom";
import {
  MessageSquare,
  Sparkles,
  Bookmark,
  Bell,
  Trash2,
  Clock,
  ShieldCheck,
} from "lucide-react";
import Card from "../../Components/Admin/common/Card";
import {
  useMarkNotificationReadMutation,
  useDeleteNotificationMutation,
} from "../../store/api/apiSlice";
import { toast } from "react-toastify";
import { notificationTarget } from "./notificationTarget";

export default function NotificationItem({ notification }) {
  const navigate = useNavigate();
  const [markRead] = useMarkNotificationReadMutation();
  const [deleteNotif] = useDeleteNotificationMutation();

  const getIcon = () => {
    const type = String(notification.type || "").toLowerCase();
    if (type.includes("claim")) {
      return <ShieldCheck className="w-5 h-5 text-emerald-500" />;
    }
    if (type.includes("question") || type.includes("comment") || type.includes("answer")) {
      return <MessageSquare className="w-5 h-5 text-blue-500" />;
    }
    if (type.includes("match")) {
      return <Sparkles className="w-5 h-5 text-amber-500" />;
    }
    return <Bell className="w-5 h-5 text-indigo-500" />;
  };

  const handleAction = () => {
    if (!notification.read && !notification.isRead) {
      markRead(notification.id);
    }

    // Try the smart URL translator first
    const target = notificationTarget(notification);
    if (target) {
      navigate(target);
      return;
    }

    // Extract entity ID from whichever field the backend uses
    const entityId =
      notification.referenceId ??
      notification.relatedId ??
      notification.targetId ??
      notification.entityId ??
      notification.postId ??
      notification.reportId ??
      notification.claimId ??
      null;

    const type = String(notification.type || '').toUpperCase();

    if (
      type === 'COMMENT_ON_POST' ||
      type === 'ANSWER_ON_POST' ||
      type === 'POST_VOTE' ||
      type.includes('COMMENT') ||
      type.includes('ANSWER')
    ) {
      navigate(entityId ? `/dashboard/questions/${entityId}` : '/dashboard/questions');
      return;
    }

    if (type.startsWith('LOST_FOUND_CLAIM') || type.includes('CLAIM')) {
      navigate('/dashboard/claims');
      return;
    }

    if (type === 'LOST_FOUND_MATCH' || type.includes('MATCH')) {
      navigate('/dashboard/matches');
      return;
    }

    navigate('/dashboard/notifications');
  };



  const handleDelete = (e) => {
    e.stopPropagation();
    deleteNotif(notification.id);
    toast.success("Notification removed");
  };

  return (
    <Card
      onClick={handleAction}
      className={`p-4 sm:p-5 transition-all cursor-pointer flex items-start gap-4 ${
        !(notification.read ?? notification.isRead)
          ? "bg-blue-50/40 dark:bg-blue-950/20 border-blue-200/80 dark:border-blue-900/40"
          : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
      }`}
      hover
    >
      <div className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center shrink-0 shadow-2xs border border-slate-200/60 dark:border-slate-700">
        {getIcon()}
      </div>

      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center justify-between gap-2">
          <h4
            className={`text-base tracking-tight truncate ${
              !(notification.read ?? notification.isRead)
                ? "font-bold text-slate-900 dark:text-white"
                : "font-medium text-slate-700 dark:text-slate-300"
            }`}
          >
            {notification.title}
          </h4>
          <span className="text-base text-slate-400 shrink-0 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {new Date(notification.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>

        <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
          {notification.body || notification.message}
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

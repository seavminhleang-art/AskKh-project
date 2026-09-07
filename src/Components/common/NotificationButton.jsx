import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { useGetNotificationsQuery, useGetUnreadCountQuery } from '../../store/api/apiSlice';
import { useAppSelector } from '../../hooks/useAppStore';

export default function NotificationButton({ className = '' }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { data: notifications = [] } = useGetNotificationsQuery(undefined, { skip: !isAuthenticated });
  const { data: unreadData } = useGetUnreadCountQuery(undefined, { skip: !isAuthenticated });

  const rawCount =
    typeof unreadData === 'number'
      ? unreadData
      : unreadData?.count !== undefined
      ? unreadData.count
      : notifications.filter((n) => !n.isRead && !n.read).length;

  const displayCount = isAuthenticated ? rawCount : 0;

  return (
    <button
      type="button"
      onClick={() => navigate('/notifications')}
      className={`relative w-10 h-10 rounded-xl border border-[#E5E7EB] dark:border-slate-800 bg-white dark:bg-slate-900 text-[#667085] hover:text-[#111827] dark:text-slate-400 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all flex items-center justify-center cursor-pointer select-none ${className}`}
      aria-label="Notifications"
      title="Notifications"
    >
      <Bell className="w-[18px] h-[18px]" />
      {displayCount > 0 && (
        <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-[#EF4444] text-white text-[11px] font-bold rounded-full flex items-center justify-center ring-2 ring-white dark:ring-slate-950">
          {displayCount > 99 ? '99+' : displayCount}
        </span>
      )}
    </button>
  );
}

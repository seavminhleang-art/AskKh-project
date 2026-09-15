import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

function timeAgo(dateString) {
  if (!dateString) return '';
  const diffMs = Date.now() - new Date(dateString).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Yesterday';
  return `${days} days ago`;
}

export default function NotificationsPreviewCard({ isLoading, notifications = [] }) {
  return (
    <Card className="bg-gray-850 border-gray-800 rounded-xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-title font-bold text-gray-100">Notifications</CardTitle>
        <Bell className="w-5 h-5 text-gray-400" />
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading &&
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-3/4 bg-gray-800" />
          ))}

        {!isLoading && notifications.length === 0 && (
          <p className="text-body text-gray-500">You're all caught up — no notifications.</p>
        )}

        {!isLoading &&
          notifications.map((n) => (
            <div key={n.id} className="flex items-start gap-2">
              {!n.read && <span className="w-2 h-2 rounded-full bg-brand-primary mt-2 shrink-0" />}
              <div className={n.read ? 'pl-4' : ''}>
                <p className="text-body text-gray-200">{n.title}</p>
                <span className="text-sm text-gray-500">{timeAgo(n.createdAt)}</span>
              </div>
            </div>
          ))}

        <Link to="/notifications" className="text-brand-primary text-sm font-medium underline block">
          View all
        </Link>
      </CardContent>
    </Card>
  );
}
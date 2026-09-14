import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Sparkles, FileCheck, ClipboardList, HelpCircle } from 'lucide-react';

const ICONS = {
  match: Sparkles,
  claim: FileCheck,
  report: ClipboardList,
  question: HelpCircle,
};

const STATUS_STYLES = {
  New: 'bg-brand-primary-light text-brand-primary',
  Pending: 'bg-brand-warning-light text-brand-warning',
  PENDING: 'bg-brand-warning-light text-brand-warning',
  Approved: 'bg-brand-accent/10 text-brand-accent',
  APPROVED: 'bg-brand-accent/10 text-brand-accent',
  Answered: 'bg-brand-accent/10 text-brand-accent',
  Rejected: 'bg-brand-secondary-light text-brand-secondary',
  REJECTED: 'bg-brand-secondary-light text-brand-secondary',
};

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

export default function RecentActivityCard({ items = [], isLoading, isEmpty }) {
  return (
    <Card className="bg-gray-850 border-gray-800 rounded-xl">
      <CardHeader>
        <CardTitle className="text-title font-bold text-gray-100">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-0">
        {isLoading &&
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex gap-4 py-4 border-b border-gray-800 last:border-0">
              <Skeleton className="w-10 h-10 rounded-full bg-gray-800" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/3 bg-gray-800" />
                <Skeleton className="h-4 w-2/3 bg-gray-800" />
              </div>
            </div>
          ))}

        {!isLoading && isEmpty && (
          <p className="text-body text-gray-500 py-8 text-center">
            No recent activity yet — ask a question or report a lost/found item to get started.
          </p>
        )}

        {!isLoading &&
          items.map((item, idx) => {
            const Icon = ICONS[item.type] ?? ClipboardList;
            const badgeClass = STATUS_STYLES[item.status] ?? 'bg-gray-700 text-gray-300';
            return (
              <div
                key={idx}
                className="flex gap-4 py-4 border-b border-gray-800 last:border-0"
              >
                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-gray-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-gray-100">{item.title}</span>
                    <Badge className={`${badgeClass} border-0`}>{item.status}</Badge>
                  </div>
                  <p className="text-body text-gray-400 mt-1">{item.description}</p>
                  <span className="text-sm text-gray-500 mt-1 block">{timeAgo(item.timestamp)}</span>
                </div>
              </div>
            );
          })}
      </CardContent>
    </Card>
  );
}
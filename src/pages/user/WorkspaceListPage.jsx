import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, Bookmark, HelpCircle, MapPin, Search, Sparkles, MessageSquare, Eye, Clock, ArrowRight } from 'lucide-react';
import {
  useGetPostsQuery,
  useGetReportsQuery,
  useGetNotificationsQuery,
} from '../../store/api/apiSlice';
import Skeleton from '../../Components/ui/Skeleton';

const PAGE_CONFIG = {
  questions: { title: 'Questions', description: 'Browse technical discussions from the campus community.', icon: HelpCircle },
  'lost-found': { title: 'Lost & Found', description: 'Review reported lost and found items on campus.', icon: Search },
  matches: { title: 'Smart Matches', description: 'Potential matches found for reported belongings.', icon: Sparkles },
  claims: { title: 'My Claims', description: 'Track ownership-verification requests.', icon: Bookmark },
  notifications: { title: 'Notifications', description: 'Your recent account and campus updates.', icon: Bell },
};

function ItemSummary({ page, item }) {
  if (page === 'questions') {
    return (
      <div className="space-y-1.5">
        <h2 className="text-base font-bold text-slate-900 dark:text-white hover:text-blue-600 transition-colors">
          {item.title}
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
          {item.body || item.description || item.content}
        </p>
        <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
          <span className="flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5" /> {item.answers?.length || item.commentCount || 0} answers</span>
          <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {item.views || item.viewCount || 0} views</span>
          {item.createdAt && <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {new Date(item.createdAt).toLocaleDateString()}</span>}
        </div>
      </div>
    );
  }

  if (page === 'lost-found') {
    const isLost = (item.type || item.itemType) === 'LOST';
    return (
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
            isLost ? 'bg-red-100 text-red-600 dark:bg-red-950/60 dark:text-red-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
          }`}>
            {isLost ? 'LOST' : 'FOUND'}
          </span>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">{item.title || item.name}</h2>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">{item.description}</p>
        <div className="flex items-center gap-3 text-xs text-slate-400 pt-1">
          <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {item.location?.name || item.locationName || item.location || 'Campus'}</span>
          <span>•</span>
          <span>Status: {item.status || 'REPORTED'}</span>
          {item.eventDate && <span>• Date: {new Date(item.eventDate).toLocaleDateString()}</span>}
        </div>
      </div>
    );
  }

  if (page === 'matches') {
    return (
      <div className="space-y-1.5">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">
          {item.title || item.name || 'Matched Belonging'}
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400">{item.description}</p>
        <div className="flex items-center gap-3 text-xs text-slate-400 pt-1">
          <span className="text-amber-600 dark:text-amber-400 font-semibold">Matched Status: {item.status || 'Active'}</span>
        </div>
      </div>
    );
  }

  if (page === 'claims') {
    return (
      <div className="space-y-1.5">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">{item.title || item.name || 'Claim Verification'}</h2>
        <p className="text-xs text-slate-600 dark:text-slate-400">{item.description}</p>
        <div className="flex items-center gap-3 text-xs text-slate-400 pt-1">
          <span className="font-semibold text-blue-600">Claim #{item.id}</span>
          <span>• Status: {item.status || 'PENDING'}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <h2 className="text-sm font-bold text-slate-900 dark:text-white">{item.title}</h2>
      <p className="text-xs text-slate-600 dark:text-slate-400">{item.message || item.content}</p>
      <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-1">
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${item.isRead || item.read ? 'bg-slate-100 dark:bg-slate-800 text-slate-500' : 'bg-blue-100 dark:bg-blue-950/60 text-blue-600'}`}>
          {item.isRead || item.read ? 'Read' : 'New'}
        </span>
        {item.createdAt && <span>• {new Date(item.createdAt).toLocaleDateString()}</span>}
      </div>
    </div>
  );
}

export default function WorkspaceListPage({ page }) {
  const config = PAGE_CONFIG[page] || PAGE_CONFIG.questions;
  const Icon = config.icon;

  const { data: postsData, isLoading: isLoadingPosts } = useGetPostsQuery(undefined, { skip: page !== 'questions' });
  const { data: reportsData, isLoading: isLoadingReports } = useGetReportsQuery(undefined, { skip: page !== 'lost-found' && page !== 'matches' && page !== 'claims' });
  const { data: notificationsData, isLoading: isLoadingNotifications } = useGetNotificationsQuery(undefined, { skip: page !== 'notifications' });

  let items = [];
  let isLoading = false;

  if (page === 'questions') {
    isLoading = isLoadingPosts;
    items = Array.isArray(postsData?.content) ? postsData.content : (Array.isArray(postsData) ? postsData : []);
  } else if (page === 'lost-found') {
    isLoading = isLoadingReports;
    items = Array.isArray(reportsData?.content) ? reportsData.content : (Array.isArray(reportsData) ? reportsData : []);
  } else if (page === 'matches') {
    isLoading = isLoadingReports;
    const allReports = Array.isArray(reportsData?.content) ? reportsData.content : (Array.isArray(reportsData) ? reportsData : []);
    items = allReports.filter(r => r.status === 'MATCHED' || r.status === 'CLAIMED');
  } else if (page === 'claims') {
    isLoading = isLoadingReports;
    const allReports = Array.isArray(reportsData?.content) ? reportsData.content : (Array.isArray(reportsData) ? reportsData : []);
    items = allReports.filter(r => r.status === 'CLAIMED' || r.hasClaims);
  } else if (page === 'notifications') {
    isLoading = isLoadingNotifications;
    items = Array.isArray(notificationsData?.content) ? notificationsData.content : (Array.isArray(notificationsData) ? notificationsData : []);
  }

  const createPath = page === 'questions' ? '/dashboard/questions/new' : page === 'lost-found' ? '/dashboard/lost-found/new' : null;

  return (
    <section className="mx-auto max-w-5xl space-y-6">
      <header className="flex items-start gap-4 rounded-3xl bg-gradient-to-r from-blue-700 to-indigo-900 p-6 text-white shadow-lg">
        <div className="rounded-2xl bg-white/15 p-3"><Icon className="h-6 w-6" /></div>
        <div className="flex-1"><h1 className="text-2xl font-black">{config.title}</h1><p className="mt-1 text-sm text-blue-100">{config.description}</p></div>
        {createPath && <Link to={createPath} className="rounded-xl bg-white px-4 py-2 text-sm font-bold text-blue-700 hover:bg-blue-50 transition-colors">+ Create</Link>}
      </header>

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-24 w-full rounded-2xl" />
          <Skeleton className="h-24 w-full rounded-2xl" />
          <Skeleton className="h-24 w-full rounded-2xl" />
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl bg-white p-8 text-center text-slate-500 dark:bg-slate-900 dark:text-slate-400 border border-slate-200 dark:border-slate-800">
          <p className="text-sm font-semibold">No items found for {config.title.toLowerCase()}.</p>
          {createPath && (
            <Link to={createPath} className="mt-3 inline-block text-xs font-bold text-blue-600 hover:underline">
              Create your first entry →
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <article key={item.id} className="rounded-2xl bg-white p-5 border border-slate-100 dark:border-slate-800 shadow-xs transition hover:shadow-md dark:bg-slate-900">
              {item.images?.[0] && (
                <img
                  src={typeof item.images[0] === 'string' ? item.images[0] : item.images[0]?.imageUrl || item.images[0]?.url}
                  alt={item.title || item.name}
                  className="mb-4 h-44 w-full rounded-xl object-cover sm:w-64"
                />
              )}
              <ItemSummary page={page} item={item} />
            </article>
          ))}
        </div>
      )}

      <Link to="/dashboard" className="inline-flex text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline">← Back to dashboard</Link>
    </section>
  );
}


import React from 'react';
import { Link } from 'react-router-dom';
import {
  HelpCircle,
  MessageSquare,
  Search,
  PlusCircle,
  Bookmark,
  Sparkles,
  Award,
  ArrowRight,
  TrendingUp,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Avatar from '../../components/ui/Avatar';
import StatusBadge from '../../components/ui/StatusBadge';
import { useAppSelector } from '../../hooks/useAppStore';
import {
  useGetQuestionsQuery,
  useGetLostFoundItemsQuery,
  useGetClaimsQuery,
  useGetMatchesQuery,
  useGetNotificationsQuery,
} from '../../store/api/apiSlice';

export default function DashboardPage() {
  const { user } = useAppSelector((state) => state.auth);

  const { data: questions = [] } = useGetQuestionsQuery();
  const { data: items = [] } = useGetLostFoundItemsQuery();
  const { data: claims = [] } = useGetClaimsQuery();
  const { data: matches = [] } = useGetMatchesQuery();
  const { data: notifications = [] } = useGetNotificationsQuery();

  const myQuestions = questions.filter((q) => q.ownerId === user?.id || q.author?.id === user?.id);
  const myItems = items.filter((i) => i.userId === user?.id || i.reporter?.id === user?.id);
  const myLostCount = myItems.filter((i) => (i.itemType || i.type) === 'LOST').length;
  const myFoundCount = myItems.filter((i) => (i.itemType || i.type) === 'FOUND').length;
  const myClaims = claims.filter((c) => c.userId === user?.id || c.claimant?.id === user?.id);
  const activeMatches = matches.filter((m) => m.status === 'NEW' || m.status === 'PENDING' || m.status === 'ACTIVE');

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 text-white p-6 sm:p-8 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Welcome back to your workspace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Hello, {user?.name || 'Scholar'}!
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
            Here is what's happening today: {activeMatches.length} pending algorithmic item matches and {myQuestions.length} technical discussions on your feed.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link to="/dashboard">
            <Button variant="secondary" size="sm" className="gap-1.5 rounded-xl font-bold">
              <HelpCircle className="w-4 h-4 text-blue-600" />
              <span>Ask Question</span>
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button variant="coral" size="sm" className="gap-1.5 rounded-xl font-bold shadow-md">
              <Sparkles className="w-4 h-4" />
              <span>Match Center</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* 6 Key Statistics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard
          title="Questions"
          value={myQuestions.length}
          subtitle="Inquiries posted"
          icon={HelpCircle}
          colorScheme="blue"
        />
        <StatCard
          title="Answers"
          value="4"
          subtitle="Solutions offered"
          icon={MessageSquare}
          colorScheme="indigo"
        />
        <StatCard
          title="Lost Reports"
          value={myLostCount}
          subtitle="Misplaced items"
          icon={Search}
          colorScheme="rose"
        />
        <StatCard
          title="Found Items"
          value={myFoundCount}
          subtitle="Turned in to desk"
          icon={ShieldCheck}
          colorScheme="emerald"
        />
        <StatCard
          title="My Claims"
          value={myClaims.length}
          subtitle="Verification active"
          icon={Bookmark}
          colorScheme="amber"
        />
        <StatCard
          title="Reputation"
          value={`${user?.reputation || 98}%`}
          subtitle="Trust index"
          icon={Award}
          colorScheme="blue"
        />
      </div>

      {/* Recent Matches & Active Claims */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Smart Matches Alert Box */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>Smart Matches Ready</span>
            </h3>
            <Link to="/dashboard" className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">
              View all
            </Link>
          </div>

          {activeMatches.length === 0 ? (
            <Card className="p-6 text-center text-xs text-slate-400 border-dashed">
              No new smart matches requiring review right now.
            </Card>
          ) : (
            <div className="space-y-3">
              {activeMatches.slice(0, 2).map((m) => (
                <Card key={m.id} className="p-4 border-slate-200 dark:border-slate-800" hover>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                        {m.matchScore}%
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                          {m.lostItem?.name} ↔ {m.foundItem?.name}
                        </h4>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">
                          {m.matchingAttributes?.[0]?.detail}
                        </p>
                      </div>
                    </div>
                    <Link to="/dashboard">
                      <Button size="sm" variant="outline" className="text-xs rounded-xl">
                        Review
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Ownership Claims Status */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-blue-500" />
              <span>Active Ownership Claims</span>
            </h3>
            <Link to="/dashboard" className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">
              View all
            </Link>
          </div>

          {myClaims.length === 0 ? (
            <Card className="p-6 text-center text-xs text-slate-400 border-dashed">
              You haven't submitted any ownership claim requests yet.
            </Card>
          ) : (
            <div className="space-y-3">
              {myClaims.slice(0, 2).map((claim) => (
                <Card key={claim.id} className="p-4 border-slate-200 dark:border-slate-800" hover>
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {claim.item?.name || 'Claimed Belonging'}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Submitted on {new Date(claim.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <StatusBadge status={claim.status} />
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* My Questions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* My Questions */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              My Posted Questions
            </h3>
            <Link to="/dashboard" className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">
              Activity History
            </Link>
          </div>

          <div className="space-y-3">
            {myQuestions.length === 0 ? (
              <Card className="p-6 text-center text-xs text-slate-400 border-dashed">
                You haven't posted any questions yet. Start a discussion!
              </Card>
            ) : (
              myQuestions.slice(0, 3).map((q) => (
                <Link key={q.id} to="/dashboard" className="block group">
                  <Card className="p-4 border-slate-200 dark:border-slate-800" hover>
                    <div className="flex items-center justify-between gap-4">
                      <div className="space-y-1 min-w-0">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors truncate">
                          {q.title}
                        </h4>
                        <div className="flex items-center gap-3 text-xs text-slate-400">
                          <span>{q.votes} votes</span>
                          <span>•</span>
                          <span>{q.answers?.length || 0} answers</span>
                          <span>•</span>
                          <span>{new Date(q.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform shrink-0" />
                    </div>
                  </Card>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Notifications Digest */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Recent Alerts
            </h3>
            <Link to="/dashboard" className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">
              All alerts
            </Link>
          </div>

          <Card className="p-4 divide-y divide-slate-100 dark:divide-slate-800 border-slate-200 dark:border-slate-800 space-y-3">
            {notifications.slice(0, 3).map((n) => (
              <div key={n.id} className="pt-2 first:pt-0 space-y-1">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {n.title}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                  {n.message}
                </p>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}

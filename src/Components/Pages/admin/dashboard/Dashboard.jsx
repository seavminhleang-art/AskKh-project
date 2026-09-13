import { FileText, ShieldAlert, Users } from "lucide-react";
import { mockDashboardStats, mockRecentPosts } from "../../../../mocks/dashboard";

const icons = {
  totalUsers: Users,
  activeUsers: Users,
  totalPosts: FileText,
  pendingModeration: ShieldAlert,
};

function StatCard({ stat }) {
  const Icon = icons[stat.key];
  const isUp = stat.direction === "up";

  return (
    <article className="border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{stat.title}</p>
          <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">{stat.value.toLocaleString()}</p>
        </div>
        <span className="rounded-md bg-blue-50 p-2 text-blue-600 dark:bg-blue-950 dark:text-blue-300"><Icon className="h-5 w-5" aria-hidden="true" /></span>
      </div>
      <p className={`mt-3 text-xs ${isUp ? "text-emerald-600" : "text-rose-600"}`}>{isUp ? "+" : ""}{stat.trend}% <span className="text-gray-400">{stat.supportingText}</span></p>
    </article>
  );
}

export default function Dashboard() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const activity = [62, 78, 54, 91, 70, 40, 35];

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6"><h1 className="text-xl font-semibold text-gray-900 dark:text-white">Dashboard</h1><p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Platform activity and moderation status at a glance.</p></div>
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">{mockDashboardStats.map((stat) => <StatCard key={stat.key} stat={stat} />)}</section>
      <section className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <article className="border border-gray-200 bg-white p-5 xl:col-span-2 dark:border-gray-700 dark:bg-gray-900">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">Weekly activity</h2>
          <div className="mt-5 grid grid-cols-7 gap-3" aria-label="Weekly post activity">{activity.map((value, index) => <div key={days[index]} className="flex h-44 flex-col justify-end gap-2"><div className="rounded-t bg-blue-600" style={{ height: `${value}%` }} title={`${value} posts`} /><span className="text-center text-xs text-gray-400">{days[index]}</span></div>)}</div>
        </article>
        <article className="border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900"><h2 className="text-base font-semibold text-gray-900 dark:text-white">Moderation queue</h2><p className="mt-4 text-4xl font-semibold text-gray-900 dark:text-white">143</p><p className="mt-1 text-sm text-gray-500 dark:text-gray-400">items awaiting review</p><a href="#recent-posts" className="mt-6 inline-flex text-sm font-medium text-blue-600 hover:text-blue-700">Review recent content</a></article>
      </section>
      <section id="recent-posts" className="mt-6 border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
        <div className="border-b border-gray-100 px-5 py-4 dark:border-gray-700"><h2 className="text-base font-semibold text-gray-900 dark:text-white">Recent posts</h2></div>
        <div className="divide-y divide-gray-100 dark:divide-gray-700">{mockRecentPosts.map((post) => <div key={post.id} className="flex items-center justify-between gap-4 px-5 py-3"><div className="min-w-0"><p className="truncate text-sm font-medium text-gray-800 dark:text-gray-100">{post.title}</p><p className="mt-1 text-xs text-gray-500">{post.author} · {post.date}</p></div><span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${post.status === "Pending" ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"}`}>{post.status}</span></div>)}</div>
      </section>
    </div>
  );
}

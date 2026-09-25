import { FileText, ShieldAlert, Users } from "lucide-react";
import {
  mockDashboardStats,
  mockRecentPosts,
} from "../../../../mocks/dashboard";

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
    <article className="admin-stat-card">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="admin-eyebrow">{stat.title}</p>
          <p className="mt-3 text-5xl font-bold tracking-tight text-white">
            {stat.value.toLocaleString()}
          </p>
        </div>
        <span className="admin-stat-icon">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
      </div>
      <p className="mt-5 text-base text-slate-400">
        <span className={isUp ? "text-emerald-400" : "text-rose-400"}>
          {isUp ? "+" : ""}
          {stat.trend}%
        </span>{" "}
        {stat.supportingText}
      </p>
    </article>
  );
}

export default function Dashboard() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const activity = [62, 78, 54, 91, 70, 40, 35];

  return (
    <div className="admin-dashboard w-full">
      <div className="mb-8">
        <p className="admin-eyebrow mb-2">Core / Dashboard</p>
        <h1 className="text-5xl sm:text-5xl font-bold tracking-tight text-white">
          Dashboard
        </h1>
        <p className="mt-2 text-base text-slate-400">
          Platform activity and moderation status at a glance.
        </p>
      </div>

      <section
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
        aria-label="Platform statistics"
      >
        {mockDashboardStats.map((stat) => (
          <StatCard key={stat.key} stat={stat} />
        ))}
      </section>

      <section className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <article className="admin-panel p-5 sm:p-6 xl:col-span-2">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-white">Weekly activity</h2>
            <span className="admin-eyebrow">Posts by day</span>
          </div>
          <div
            className="mt-6 grid grid-cols-7 gap-2 sm:gap-3"
            aria-label="Weekly post activity"
          >
            {activity.map((value, index) => (
              <div
                key={days[index]}
                className="flex h-44 flex-col justify-end gap-2"
              >
                <div className="admin-chart-track flex-1 flex items-end rounded-lg overflow-hidden">
                  <div
                    className="admin-chart-bar w-full rounded-t-lg"
                    style={{ height: `${value}%` }}
                    title={`${value} posts`}
                  />
                </div>
                <span className="text-center text-base text-slate-400">
                  {days[index]}
                </span>
              </div>
            ))}
          </div>
        </article>

        <article className="admin-panel p-5 sm:p-6 flex flex-col">
          <h2 className="text-lg font-bold text-white">Moderation queue</h2>
          <p className="mt-6 text-5xl font-bold tracking-tight text-white">
            143
          </p>
          <p className="mt-2 text-base text-slate-400">items awaiting review</p>
          <a
            href="#recent-posts"
            className="admin-inline-link mt-auto pt-8 text-base font-semibold"
          >
            Review recent content →
          </a>
        </article>
      </section>

      <section id="recent-posts" className="admin-panel mt-6 overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/10 px-5 sm:px-6 py-5">
          <h2 className="text-lg font-bold text-white">Recent posts</h2>
          <span className="admin-eyebrow">
            {mockRecentPosts.length} results
          </span>
        </div>
        <div className="admin-post-header admin-post-grid px-5 sm:px-6 py-3 text-base font-bold uppercase tracking-wider text-slate-500 bg-white/[.025]">
          <span>Post</span>
          <span>Author</span>
          <span>Date</span>
          <span>Status</span>
        </div>
        <div className="divide-y divide-white/10">
          {mockRecentPosts.map((post) => (
            <div
              key={post.id}
              className="admin-post-grid px-5 sm:px-6 py-4 text-base"
            >
              <p className="min-w-0 truncate font-semibold text-slate-100">
                {post.title}
              </p>
              <p className="text-slate-400">{post.author}</p>
              <p className="text-slate-400">{post.date}</p>
              <span
                className={`admin-status w-fit ${post.status === "Pending" ? "admin-status-pending" : "admin-status-published"}`}
              >
                {post.status}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

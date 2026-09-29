import { isQuestionPost, isAnswerPost } from "../../config/postTypes.js";
import { useWorkspaceTranslation } from "@/locales/workspace/useWorkspaceTranslation";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  HelpCircle,
  CheckCircle2,
  FileQuestion,
  PackageCheck,
  MessageSquarePlus,
  Plus,
  Zap,
  History,
  BellRing,
  ShieldCheck,
} from "lucide-react";
import { useWorkspaceDataQuery } from "../../features/workspace/workspaceApi";
import { rows, dateLabel } from "../../features/workspace/workspaceModel";
import { QueryState, Empty, Badge } from "./WorkspaceUI";
import ActivityPage from "./ActivityPage";
function Overview() {
  const { w, locale } = useWorkspaceTranslation();
  const storedUser = useSelector((state) => state.auth.user);
  const profileQuery = useWorkspaceDataQuery({
    resource: "profile",
  });
  const forum = useWorkspaceDataQuery({
    resource: "my-posts",
  });
  const reportsQuery = useWorkspaceDataQuery({
    resource: "my-reports",
  });
  const profile = profileQuery.data?.data ?? profileQuery.data;
  const name =
    profile?.displayName ||
    storedUser?.displayName ||
    storedUser?.name ||
    "Member";
  const posts = rows(forum.data);
  const reports = rows(reportsQuery.data).filter(
    (item) => profile?.id != null && String(item.userId) === String(profile.id),
  );
  const questions = rows(forum.data).filter((item) => isQuestionPost(item));
  const answers = rows(forum.data).filter((item) => isAnswerPost(item));

  const recent = [...questions]
    .sort((a, b) => new Date(b.creationDate) - new Date(a.creationDate))
    .slice(0, 3);
  const activity = [
    ...posts.map((item) => ({
      ...item,
      date: item.creationDate,
      path: `/dashboard/questions/${item.parentId || item.id}`,
    })),
    ...reports.map((item) => ({
      ...item,
      date: item.createdAt,
      path: "/dashboard/lost-found",
    })),
  ]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3);
  const hour = new Date().getHours();
  const count = (query, value) =>
    query.isError ? "—" : query.isLoading ? "…" : value;
  const stats = [
    {
      label: "Questions Asked",
      value: count(forum, posts.filter((item) => isQuestionPost(item)).length),
      Icon: HelpCircle,
      tone: "blue",
      category: "Q&A",
      detail: "forum activity",
    },
    {
      label: "Answers Given",
      value: count(forum, posts.filter((item) => isAnswerPost(item)).length),
      Icon: CheckCircle2,
      tone: "green",
      category: "Community",
      detail: "helpful solutions",
    },
    {
      label: "Lost Reports",
      value: profile
        ? count(
            reportsQuery,
            reports.filter((item) => item.itemType?.toLowerCase() === "lost")
              .length,
          )
        : "—",
      Icon: FileQuestion,
      tone: "rose",
      category: "Campus",
      detail: "missing items",
    },
    {
      label: "Found Reports",
      value: profile
        ? count(
            reportsQuery,
            reports.filter((item) => item.itemType?.toLowerCase() === "found")
              .length,
          )
        : "—",
      Icon: PackageCheck,
      tone: "amber",
      category: "Campus",
      detail: "recovered items",
    },
  ];
  return (
    <div className="uw-page uw-overview">
      <section className="uw-card uw-welcome">
        <span className="uw-welcome-avatar text-lg">
          {name.slice(0, 2).toUpperCase()}
        </span>
        <div className="uw-welcome-copy">
          <h1 className="text-xl font-bold tracking-tight sm:text-lg">
            {w(
              hour < 12
                ? "Good morning, {{name}}"
                : hour < 18
                  ? "Good afternoon, {{name}}"
                  : "Good evening, {{name}}",
              {
                name,
              },
            )}{" "}
            <Badge>
              <span className="text-lg">{w("Member")}</span>
            </Badge>
          </h1>
          <p className="text-lg">
            {w("Manage your questions, answers, and personal tasks.")}
          </p>
        </div>
        <div className="uw-actions">
          <Link
            className="uw-button secondary text-lg"
            to="/dashboard/questions/new"
          >
            <MessageSquarePlus size={16} />
            {w("Ask Question")}
          </Link>
          <Link
            className="uw-button text-lg"
            to="/dashboard/lost-found/new?type=lost"
          >
            <Plus size={16} />
            {w("Report Lost Item")}
          </Link>
        </div>
      </section>
      <div className="uw-stats">
        {stats.map(({ label, value, Icon, tone, category, detail }) => (
          <section className={`uw-card uw-summary ${tone}`} key={label}>
            <div className="uw-summary-heading">
              <h2 className="text-lg font-semibold">{w(label)}</h2>
              <span className="uw-action-icon">
                <Icon size={18} />
              </span>
            </div>
            <strong className="text-3xl font-bold leading-tight">
              {value}
            </strong>
            <p className="uw-muted text-lg">{w("Your contributions")}</p>
            <footer className="text-sm">
              <b>{w(category)}</b> <span>{w(detail)}</span>
            </footer>
          </section>
        ))}
      </div>
      {reportsQuery.isError && (
        <p className="uw-muted text-lg">
          {w("Your personal reports and updates are not available yet.")}
        </p>
      )}
      <div className="uw-overview-grid">
        <div className="uw-stack">
          <section className="uw-card">
            <div className="uw-panel-heading">
              <HelpCircle size={18} />
              <div>
                <h2 className="text-lg font-semibold">
                  {w("My Recent Questions")}
                </h2>
                <p className="text-lg">
                  {w("Your latest questions and contributions")}
                </p>
              </div>
              <Link className="text-lg" to="/dashboard/questions">
                {w("View all")}
              </Link>
            </div>
            <div className="uw-forum-counts">
              {[
                ["Questions", questions.length],
                ["Answers", answers.length],
              ].map(([label, value]) => (
                <div key={label}>
                  <span className="text-lg">{w(label)}</span>
                  <strong className="text-xl font-bold">
                    {forum.isError ? "—" : forum.isLoading ? "…" : value}
                  </strong>
                </div>
              ))}
            </div>
            <QueryState query={forum}>
              {!recent.length ? (
                <Empty>{w("No discussions yet.")}</Empty>
              ) : (
                recent.map((item) => (
                  <article className="uw-row" key={item.id}>
                    <div>
                      <h2>
                        <Link
                          className="text-lg font-semibold"
                          to={`/dashboard/questions/${item.id}`}
                        >
                          {item.title}
                        </Link>
                      </h2>
                      <p className="text-lg">
                        {item.ownerDisplayName} ·{" "}
                        {dateLabel(item.creationDate, locale)}
                      </p>
                    </div>
                    <Badge>
                      {item.score ?? 0} {w("votes")}
                    </Badge>
                  </article>
                ))
              )}
            </QueryState>
          </section>
          <section className="uw-card">
            <div className="uw-panel-heading">
              <History size={18} />
              <div>
                <h2 className="text-lg font-semibold">
                  {w("My Recent Activity")}
                </h2>
                <p className="text-lg">
                  {w(
                    "Track your contributions, forum questions, answers, and lost & found reports.",
                  )}
                </p>
              </div>
              <Link className="text-lg" to="/dashboard/activity">
                {w("View all")}
              </Link>
            </div>
            <QueryState query={forum}>
              {activity.length ? (
                activity.map((item) => (
                  <article className="uw-row" key={`${item.path}-${item.id}`}>
                    <div>
                      <h2>
                        <Link className="text-lg font-semibold" to={item.path}>
                          {item.title}
                        </Link>
                      </h2>
                      <p className="text-lg">{dateLabel(item.date, locale)}</p>
                    </div>
                  </article>
                ))
              ) : (
                <Empty>{w("No activity yet.")}</Empty>
              )}
            </QueryState>
          </section>
        </div>
        <div className="uw-stack">
          <section className="uw-card">
            <div className="uw-panel-heading">
              <Zap size={18} />
              <h2 className="text-lg font-semibold">{w("Quick Actions")}</h2>
              <span className="uw-muted text-lg">{w("Shortcuts")}</span>
            </div>
            <div className="uw-shortcuts">
              {[
                {
                  title: "Ask Question",
                  description: "Post a question to Q&A community",
                  path: "/dashboard/questions/new",
                  Icon: MessageSquarePlus,
                  tone: "blue",
                },
                {
                  title: "Report Lost Item",
                  description: "Report an item lost on campus",
                  path: "/dashboard/lost-found/new?type=lost",
                  Icon: FileQuestion,
                  tone: "rose",
                },
                {
                  title: "Report Found Item",
                  description: "Help an item find its owner",
                  path: "/dashboard/lost-found/new?type=found",
                  Icon: PackageCheck,
                  tone: "green",
                },
              ].map(({ title, description, path, Icon, tone }) => (
                <Link className={tone} key={title} to={path}>
                  <span className="uw-action-icon">
                    <Icon size={19} />
                  </span>
                  <div>
                    <strong className="text-lg font-semibold">
                      {w(title)}
                    </strong>
                    <p className="text-lg">{w(description)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
          <section className="uw-card">
            <div className="uw-panel-heading">
              <BellRing size={18} />
              <div>
                <h2 className="text-lg font-semibold">{w("Claim Requests")}</h2>
                <p className="text-lg">
                  {w("Review requests for items you have found.")}
                </p>
              </div>
            </div>
            <div className="uw-claim-prompt">
              <div className="uw-claim-prompt-alert">
                <ShieldCheck size={24} />
                <div>
                  <strong>{w("A person is claiming a found item")}</strong>
                  <span>{w("Review their request and submitted ownership details.")}</span>
                </div>
              </div>
              <p className="text-lg">
                {w("You decide whether to approve or reject each claim.")}
              </p>
              <Link className="uw-button secondary text-lg" to="/dashboard/claims">
                {w("Review Claims")}
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
export default function DashboardPage({ activity = false }) {
  return activity ? <ActivityPage activity /> : <Overview />;
}

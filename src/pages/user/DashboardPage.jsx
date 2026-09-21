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
  Sparkles,
  Search,
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
    resource: "posts",
  });
  const reportsQuery = useWorkspaceDataQuery({
    resource: "reports",
  });
  const profile = profileQuery.data?.data ?? profileQuery.data;
  const name =
    profile?.displayName ||
    storedUser?.displayName ||
    storedUser?.name ||
    "Member";
  const posts = profile?.questions || [];
  const reports = rows(reportsQuery.data).filter(
    (item) => profile?.id != null && String(item.userId) === String(profile.id),
  );
  const questions = rows(forum.data).filter((item) => item.postTypeId !== 2);
  const answers = rows(forum.data).filter((item) => item.postTypeId === 2);
  const answered = new Set(answers.map((item) => item.parentId));
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
      value: count(
        profileQuery,
        posts.filter((item) => item.postTypeId !== 2).length,
      ),
      Icon: HelpCircle,
      tone: "blue",
      category: "Q&A",
      detail: "forum activity",
    },
    {
      label: "Answers Given",
      value: count(
        profileQuery,
        posts.filter((item) => item.postTypeId === 2).length,
      ),
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
        <span className="uw-welcome-avatar">
          {name.slice(0, 2).toUpperCase()}
        </span>
        <div className="uw-welcome-copy">
          <h1>
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
            <Badge>{w("Member")}</Badge>
          </h1>
          <p>{w("Explore campus Q&A discussions and Lost & Found items.")}</p>
        </div>
        <div className="uw-actions">
          <Link className="uw-button secondary" to="/dashboard/questions/new">
            <MessageSquarePlus size={16} />
            {w("Ask Question")}
          </Link>
          <Link className="uw-button" to="/dashboard/lost-found/new?type=lost">
            <Plus size={16} />
            {w("Report Lost Item")}
          </Link>
        </div>
      </section>
      <div className="uw-stats">
        {stats.map(({ label, value, Icon, tone, category, detail }) => (
          <section className={`uw-card uw-summary ${tone}`} key={label}>
            <div className="uw-summary-heading">
              <h2>{w(label)}</h2>
              <span className="uw-action-icon">
                <Icon size={18} />
              </span>
            </div>
            <strong>{value}</strong>
            <p className="uw-muted">{w("Your contributions")}</p>
            <footer>
              <b>{w(category)}</b> <span>{w(detail)}</span>
            </footer>
          </section>
        ))}
      </div>
      <div className="uw-overview-grid">
        <div className="uw-stack">
          <section className="uw-card">
            <div className="uw-panel-heading">
              <HelpCircle size={18} />
              <div>
                <h2>{w("Recent Forum")}</h2>
                <p>
                  {w(
                    "Latest discussions and questions from the ISTAD community",
                  )}
                </p>
              </div>
              <Link to="/dashboard/questions">{w("View all")}</Link>
            </div>
            <div className="uw-forum-counts">
              {[
                ["Questions", questions.length],
                ["Answers", answers.length],
                [
                  "Without answers in this feed",
                  questions.filter((item) => !answered.has(item.id)).length,
                ],
              ].map(([label, value]) => (
                <div key={label}>
                  <span>{w(label)}</span>
                  <strong>
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
                        <Link to={`/dashboard/questions/${item.id}`}>
                          {item.title}
                        </Link>
                      </h2>
                      <p>
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
                <h2>{w("My Recent Activity")}</h2>
                <p>
                  {w(
                    "Track your contributions, forum questions, answers, and lost & found reports.",
                  )}
                </p>
              </div>
              <Link to="/dashboard/activity">{w("View all")}</Link>
            </div>
            <QueryState query={profileQuery}>
              <QueryState query={reportsQuery}>
                {activity.length ? (
                  activity.map((item) => (
                    <article className="uw-row" key={`${item.path}-${item.id}`}>
                      <div>
                        <h2>
                          <Link to={item.path}>{item.title}</Link>
                        </h2>
                        <p>{dateLabel(item.date, locale)}</p>
                      </div>
                    </article>
                  ))
                ) : (
                  <Empty>{w("No activity yet.")}</Empty>
                )}
              </QueryState>
            </QueryState>
          </section>
        </div>
        <div className="uw-stack">
          <section className="uw-card">
            <div className="uw-panel-heading">
              <Zap size={18} />
              <h2>{w("Quick Actions")}</h2>
              <span className="uw-muted">{w("Shortcuts")}</span>
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
                    <strong>{w(title)}</strong>
                    <p>{w(description)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
          <section className="uw-card">
            <div className="uw-panel-heading">
              <Sparkles size={18} />
              <div>
                <h2>{w("Match Summary")}</h2>
                <p>{w("Review potential matches for reported belongings.")}</p>
              </div>
              <Link to="/dashboard/matches">{w("View all")}</Link>
            </div>
            <div className="uw-match-prompt">
              <Search size={30} />
              <h2>{w("Find a matching report")}</h2>
              <p>{w("Select a report to see its latest matches.")}</p>
              <Link className="uw-button secondary" to="/dashboard/matches">
                {w("Open Match Center")}
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

import { useWorkspaceTranslation } from "@/locales/workspace/useWorkspaceTranslation";
import { Link } from "react-router-dom";
import { useWorkspaceDataQuery } from "../../features/workspace/workspaceApi";
import { dateLabel, rows } from "../../features/workspace/workspaceModel";
import { Heading, QueryState, Empty, QuickLinks, Badge } from "./WorkspaceUI";
export default function DashboardPage({ activity = false }) {
  const { w, locale } = useWorkspaceTranslation();
  const profileQuery = useWorkspaceDataQuery({
    resource: "profile",
  });
  const reportsQuery = useWorkspaceDataQuery({
    resource: "reports",
  });
  const unreadQuery = useWorkspaceDataQuery({
    resource: "unread",
  });
  const profile = profileQuery.data?.data ?? profileQuery.data;
  const posts = profile?.questions || [];
  const comments = profile?.comments || [];
  const reports = rows(reportsQuery.data).filter(
    (item) => profile?.id != null && String(item.userId) === String(profile.id),
  );
  const events = [
    ...posts.map((item) => ({
      ...item,
      kind: item.postTypeId === 2 ? "Answer" : "Question",
      date: item.creationDate,
      path: `/dashboard/questions/${item.parentId || item.id}`,
    })),
    ...comments.map((item) => ({
      ...item,
      title: item.text || item.body || "Comment",
      kind: "Comment",
      date: item.creationDate,
      path: item.postId ? `/dashboard/questions/${item.postId}` : null,
    })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date));
  const days = Array.from(
    {
      length: 7,
    },
    (_, index) => {
      const date = new Date();
      date.setDate(date.getDate() - 6 + index);
      return {
        label: date.toLocaleDateString(locale, {
          weekday: "short",
        }),
        count: events.filter(
          (item) =>
            item.date &&
            new Date(item.date).toDateString() === date.toDateString(),
        ).length,
      };
    },
  );
  const max = Math.max(1, ...days.map((day) => day.count));
  return (
    <div className="uw-page">
      <Heading
        title={activity ? w("My Activity") : w("Dashboard Overview")}
        description={
          activity
            ? w("Your questions, answers, and community contributions.")
            : w("Welcome back. Here is your latest community activity.")
        }
      >
        <Link className="uw-button" to="/dashboard/questions/new">
          {w("Ask a question")}
        </Link>
      </Heading>
      <QueryState query={profileQuery}>
        {profile && (
          <>
            <div className="uw-stats">
              {[
                [
                  "My questions",
                  posts.filter((item) => item.postTypeId !== 2).length,
                ],
                ["Comments", comments.length],
                [
                  "My reports",
                  reportsQuery.isError
                    ? "—"
                    : reportsQuery.isLoading
                      ? "…"
                      : reports.length,
                ],
                [
                  "Unread notifications",
                  unreadQuery.isError
                    ? "—"
                    : (unreadQuery.data?.unreadCount ?? "…"),
                ],
              ].map(([label, value]) => (
                <div className="uw-card uw-stat" key={label}>
                  <span className="uw-muted">{w(label)}</span>
                  <strong>{value}</strong>
                  <span className="uw-muted">
                    {label === "Unread notifications"
                      ? w("Account updates")
                      : w("Your contributions")}
                  </span>
                </div>
              ))}
            </div>
            <div className="uw-columns">
              <div className="uw-stack">
                {!activity && (
                  <section className="uw-card">
                    <h2>{w("Activity overview")}</h2>
                    <p className="uw-muted">
                      {w("Your contributions over the last seven days")}
                    </p>
                    <div
                      className="uw-chart"
                      role="img"
                      aria-label={days
                        .map(
                          (day) => `${day.label}: ${day.count} contributions`,
                        )
                        .join(", ")}
                    >
                      {days.map((day) => (
                        <div key={day.label}>
                          <span>{day.count}</span>
                          <i
                            style={{
                              height: `${(day.count / max) * 130}px`,
                            }}
                          />
                          <span className="uw-muted">{day.label}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
                <section className="uw-card">
                  <h2>
                    {activity
                      ? w("Recent activity")
                      : w("Recent contributions")}
                  </h2>
                  {!events.length && (
                    <Empty>{w("Your contributions will appear here.")}</Empty>
                  )}
                  {events.slice(0, activity ? 50 : 6).map((item) => (
                    <article className="uw-row" key={`${item.kind}-${item.id}`}>
                      <div>
                        <h2>
                          {item.path ? (
                            <Link to={item.path}>
                              {item.title || w("Answer")}
                            </Link>
                          ) : (
                            item.title
                          )}
                        </h2>
                        <p>{dateLabel(item.date, locale)}</p>
                      </div>
                      <Badge>{w(item.kind)}</Badge>
                    </article>
                  ))}
                </section>
                {!activity && (
                  <section className="uw-card">
                    <h2>{w("Recent reports")}</h2>
                    <QueryState query={reportsQuery}>
                      {!reports.length ? (
                        <Empty>
                          {w("You have not reported any items yet.")}
                        </Empty>
                      ) : (
                        reports.slice(0, 5).map((item) => (
                          <article className="uw-row" key={item.id}>
                            <div>
                              <h2>
                                <Link to="/dashboard/lost-found">
                                  {item.title}
                                </Link>
                              </h2>
                              <p>
                                {item.locationLabel || item.freeTextLocation} ·{" "}
                                {dateLabel(item.createdAt, locale)}
                              </p>
                            </div>
                            <Badge>{item.status || item.itemType}</Badge>
                          </article>
                        ))
                      )}
                    </QueryState>
                  </section>
                )}
              </div>
              <div className="uw-stack">
                <QuickLinks />
                <section className="uw-card">
                  <h2>{w("Contribution breakdown")}</h2>
                  <div className="uw-links">
                    <span>
                      {posts.filter((item) => item.postTypeId !== 2).length}{" "}
                      {w("questions")}
                    </span>
                    <span>
                      {posts.filter((item) => item.postTypeId === 2).length}{" "}
                      {w("answers")}
                    </span>
                    <span>
                      {comments.length} {w("comments")}
                    </span>
                  </div>
                </section>
                {unreadQuery.isError && <QueryState query={unreadQuery} />}
              </div>
            </div>
          </>
        )}
      </QueryState>
    </div>
  );
}

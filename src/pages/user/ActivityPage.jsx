import { useState } from "react";
import { Link } from "react-router-dom";
import { History, FileText, MessageSquare, ShieldCheck, PackageCheck, CircleHelp, ChevronDown, PlusCircle, ChartNoAxesCombined, CalendarDays } from "lucide-react";
import { useWorkspaceTranslation } from "@/locales/workspace/useWorkspaceTranslation";
import { useWorkspaceDataQuery } from "../../features/workspace/workspaceApi";
import { rows } from "../../features/workspace/workspaceModel";
import { QueryState } from "./WorkspaceUI";
import { monthlyActivity } from "./activityModel";
import "./activity.css";
const kinds = {
  Posts: { icon: FileText, tone: "blue", verb: "Created post" },
  Answers: { icon: CircleHelp, tone: "violet", verb: "Answered" },
  Comments: { icon: MessageSquare, tone: "green", verb: "Commented" },
};
function ProgressChart({ data, available, w }) {
  const max = Math.max(1, ...data.thisMonth, ...data.lastMonth);
  const points = values => values.map((value, index) => `${12 + index * 55},${105 - value / max * 80}`).join(" ");
  return <section className="activity-panel activity-chart"><div className="activity-panel-title"><h2>{w("Monthly Progress")}</h2><div className="activity-chart-legend"><span>{w("This")}</span><span>{w("Last")}</span></div></div>
    {available ? <><svg viewBox="0 0 244 125" role="img" aria-label={w("Weekly contributions: this month {{current}}, last month {{previous}}", { current: data.thisMonth.join(', '), previous: data.lastMonth.join(', ') })}><title>{w("Contributions per week")}</title>{[25, 65, 105].map(y => <line key={y} x1="10" y1={y} x2="234" y2={y} stroke="currentColor" opacity=".1" />)}<polyline points={points(data.lastMonth)} fill="none" stroke="#bbc9e3" strokeWidth="2" strokeDasharray="4 4" /><polyline points={points(data.thisMonth)} fill="none" stroke="#3976ff" strokeWidth="2.5" strokeLinejoin="round" />{data.thisMonth.map((value, index) => <circle key={index} cx={12 + index * 55} cy={105 - value / max * 80} r="3.5" fill="#3976ff" stroke="var(--uw-card)" strokeWidth="2"><title>{w("Week {{week}}: {{count}} contributions", { week: index + 1, count: value })}</title></circle>)}</svg><div className="activity-chart-labels">{[1, 2, 3, 4, 5].map(week => <span key={week}>{w("W{{week}}", { week })}</span>)}</div></> : <div className="activity-unavailable">{w("Activity chart unavailable.")}</div>}
    <small>{w("Posts, answers, and comments by week of month.")}</small>
  </section>;
}
export default function ActivityPage() {
  const { w, locale } = useWorkspaceTranslation();
  const postsQuery = useWorkspaceDataQuery({ resource: "my-posts" });
  const profileQuery = useWorkspaceDataQuery({ resource: "profile" });
  const [filter, setFilter] = useState("All Activity");
  const [limit, setLimit] = useState(8);
  const posts = rows(postsQuery.data);
  const profile = profileQuery.data?.data ?? profileQuery.data;
  const comments = Array.isArray(profile?.comments) ? profile.comments : [];
  const events = [
    ...posts.map(item => ({ id: `post-${item.id}`, kind: item.postTypeId === 2 ? "Answers" : "Posts", title: item.title || w("Answer"), body: item.body, date: item.creationDate, path: `/dashboard/questions/${item.parentId || item.id}` })),
    ...comments.map(item => ({ id: `comment-${item.id}`, kind: "Comments", title: item.postTitle || w("a question"), body: item.text || item.body, date: item.creationDate, path: item.postId ? `/dashboard/questions/${item.postId}` : null })),
  ].sort((a, b) => (Date.parse(b.date) || 0) - (Date.parse(a.date) || 0));
  const metrics = monthlyActivity(events);
  const ready = postsQuery.isSuccess && profileQuery.isSuccess;
  const formatDate = value => value && !Number.isNaN(Date.parse(value)) ? new Date(value).toLocaleString(locale, { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" }) : w("Date unavailable");
  const countFor = (kind, query) => query.isError ? "—" : !query.isSuccess ? "…" : events.filter(item => item.kind === kind).length;
  const stats = [["Posts Created", countFor("Posts", postsQuery), FileText, "blue", "Posts"], ["Items Found", "—", PackageCheck, "green"], ["Items Lost", "—", CircleHelp, "orange"], ["Comments", countFor("Comments", profileQuery), MessageSquare, "violet", "Comments"], ["Claims Submitted", "—", ShieldCheck, "purple"]];
  const visible = events.filter(event => filter === "All Activity" || event.kind === filter);
  const unsupported = ["Claims", "Matches", "Reports"].includes(filter);
  const activeQuery = filter === "Comments" ? profileQuery : postsQuery;
  function changeFilter(value) { setFilter(value); setLimit(8); }
  return <div className="uw-page activity-page">
    <header className="activity-header"><h1><History size={24} />{w("My Activity")}</h1><p>{w("Track your contributions and activities on the platform.")}</p></header>
    <div className="activity-stats">{stats.map(([label, count, Icon, tone, kind]) => {
      const current = metrics.current.filter(event => event.kind === kind).length;
      const previous = metrics.previous.filter(event => event.kind === kind).length;
      return <section className={`activity-stat tone-${tone}`} key={label}><div><span>{w(label)}</span><i><Icon size={16} /></i></div><strong>{count}</strong><small>{!kind ? w("Unavailable") : !ready ? w("Your contributions") : previous ? w("{{change}}% from last month", { change: `${current >= previous ? '+' : ''}${Math.round((current - previous) / previous * 100)}` }) : w("{{count}} this month", { count: current })}</small></section>;
    })}</div>
    <div className="activity-layout"><section className="activity-panel activity-feed">
      <nav className="activity-filters" aria-label={w("Filter activity")}>{["All Activity", "Posts", "Answers", "Comments", "Claims", "Matches", "Reports"].map(tab => <button type="button" key={tab} aria-pressed={filter === tab} onClick={() => changeFilter(tab)}>{w(tab)}</button>)}</nav>
      {unsupported ? <div className="activity-empty"><History size={30} /><h2>{w("Personal activity unavailable")}</h2><p>{w("Your {{kind}} history is not available yet.", { kind: w(filter).toLowerCase() })}</p></div> : <QueryState query={activeQuery}>
        {filter === "All Activity" && profileQuery.isError && <div className="activity-inline-error">{w("Comments could not be loaded.")} <button onClick={profileQuery.refetch}>{w("Retry")}</button></div>}
        {!visible.length ? <div className="activity-empty"><PlusCircle size={30} /><h2>{w("Your story starts here")}</h2><p>{w("Your contributions will appear here as you take part.")}</p><Link to="/dashboard/questions/new">{w("Ask a question")}</Link></div> : <div className="activity-entries">{visible.slice(0, limit).map(event => {
          const { icon: Icon, tone, verb } = kinds[event.kind];
          return <article className={`activity-entry tone-${tone}`} key={event.id}><span className="activity-entry-icon"><Icon size={18} /></span><div className="activity-entry-copy"><h2>{w(verb)}: {event.path ? <Link to={event.path}>{event.title}</Link> : event.title}</h2><p>{event.body}</p><time dateTime={event.date || undefined}>{formatDate(event.date)}</time></div><span className="activity-entry-badge">{w(event.kind)}</span></article>;
        })}</div>}
        {visible.length > limit && <button className="activity-load" onClick={() => setLimit(value => value + 8)}>{w("Load More Activities")}<ChevronDown size={14} /></button>}
      </QueryState>}
    </section><aside className="activity-sidebar">
      <section className="activity-panel"><div className="activity-panel-title"><h2>{w("Activity Overview")}</h2><span className="activity-period">{w("This Month")}</span></div><div className="activity-breakdown">{[["Posts Created", "Posts", "blue"], ["Answers Given", "Answers", "violet"], ["Comments", "Comments", "green"], ["Items Found", null, "green"], ["Items Lost", null, "orange"], ["Claims Submitted", null, "purple"], ["Matches Found", null, "blue"], ["Reports Made", null, "rose"]].map(([label, kind, tone]) => <div className={`tone-${tone}`} key={label}><span><i />{w(label)}</span><strong>{kind && ready ? metrics.current.filter(event => event.kind === kind).length : "—"}</strong></div>)}</div></section>
      <ProgressChart data={metrics} available={ready} w={w} />
      <section className="activity-panel"><div className="activity-panel-title"><h2>{w("Top Contributions")}</h2></div><div className="activity-highlights"><div><CalendarDays size={17} /><span>{w("Most active day")}</span><strong>{ready && metrics.bestDay ? metrics.bestDay[0] : "—"}</strong></div><div><FileText size={17} /><span>{w("Posts this month")}</span><strong>{ready ? metrics.current.filter(event => event.kind === "Posts").length : "—"}</strong></div><div><MessageSquare size={17} /><span>{w("Comments this month")}</span><strong>{ready ? metrics.current.filter(event => event.kind === "Comments").length : "—"}</strong></div><div><ChartNoAxesCombined size={17} /><span>{w("Contributions this month")}</span><strong>{ready ? metrics.current.length : "—"}</strong></div></div></section>
    </aside></div>
  </div>;
}

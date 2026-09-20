import { Link } from 'react-router-dom';
import { Users, FileText, ShieldAlert, RefreshCw } from 'lucide-react';
import { useAdminResourceQuery } from './liveApi';

export function QueryNotice({ query, label }) {
  if (query.isLoading) return <p className="al-empty" role="status">Loading {label}…</p>;
  if (!query.isError) return null;
  const status = query.error?.status;
  return <div className="al-alert" role="alert"><strong>Could not load {label}.</strong> {status === 401 || status === 403 ? 'The API did not authorize this account.' : 'The service may be unavailable or its response format unsupported.'} <button onClick={query.refetch}>Try again</button></div>;
}
export const dateOf = row => {
  const value = row.creationDate || row.createdAt || row.joinedAt;
  const date = value ? new Date(value) : null;
  return date && Number.isFinite(date.getTime()) ? date : null;
};
const palette = ['#0050f3', '#4caf50', '#ef2929', '#f59e0b', '#8b5cf6'];
function Empty({children}) { return <div className="al-empty">{children}</div>; }
function Growth({ rows }) {
  const dates = rows.map(dateOf).filter(Boolean);
  if (!dates.length) return <Empty>No registration dates are available.</Empty>;
  const now = new Date();
  const points = Array.from({length: 7}, (_, i) => {
    const end = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
    return { label: new Date(now.getFullYear(), now.getMonth() - 6 + i, 1).toLocaleDateString(undefined, {month: 'short'}), value: dates.filter(d => d < end).length };
  });
  const max = Math.max(4, ...points.map(p => p.value));
  const coordinates = points.map((p, i) => `${45 + i * 100},${210 - p.value / max * 180}`).join(' ');
  return <svg viewBox="0 0 670 250" className="al-growth" role="img" aria-label="Cumulative registrations among loaded users over seven months">
    {[0,1,2,3,4].map(i => <g key={i}><line x1="45" x2="645" y1={210-i*45} y2={210-i*45} stroke="#e7ecf4" strokeDasharray="3 3"/><text x="35" y={214-i*45} textAnchor="end">{Math.round(max*i/4)}</text></g>)}
    <polygon points={`45,210 ${coordinates} 645,210`} fill="#edf4ff"/><polyline points={coordinates} fill="none" stroke="#0050f3" strokeWidth="2"/>
    {points.map((p,i) => <g key={i}><circle cx={45+i*100} cy={210-p.value/max*180} r="3" fill="#0050f3"><title>{p.label}: {p.value} users</title></circle><text x={45+i*100} y="238" textAnchor="middle">{p.label}</text></g>)}
  </svg>;
}
export default function Dashboard() {
  const users = useAdminResourceQuery('users');
  const posts = useAdminResourceQuery('posts');
  const reports = useAdminResourceQuery('lost-found');
  const userRows = users.data?.rows || [];
  const postRows = posts.data?.rows || [];
  const reportRows = reports.data?.rows || [];
  const categories = Object.entries(postRows.reduce((out,p) => { const name = typeof p.category === 'string' ? p.category : p.category?.name || p.categoryName || 'Uncategorized'; out[name] = (out[name] || 0) + 1; return out; }, Object.create(null)));
  let running = 0;
  const stops = categories.map(([,count],i) => { const start = running; running += count / postRows.length * 100; return `${palette[i%palette.length]} ${start}% ${running}%`; }).join(',');
  const champions = Object.values(postRows.reduce((out,p) => { const id = p.ownerId || p.author?.id; if (!id) return out; out[id] ??= { id, name: p.ownerDisplayName || p.author?.name || `User ${id}`, count: 0 }; out[id].count++; return out; }, Object.create(null))).sort((a,b)=>b.count-a.count).slice(0,5);
  const pending = reportRows.filter(r => ['PENDING','OPEN'].includes(String(r.status).toUpperCase())).length;
  const statusesAvailable = Boolean(reports.data) && reportRows.every(r => typeof r.status === 'string');
  const stats = [
    ['Total Users', users.data?.total ?? userRows.length, Users, users, users.data?.total != null ? 'Reported by the API' : 'Users in the loaded response'],
    ['Active Users', null, Users, null, 'Activity metric unavailable'],
    ['Total Posts', posts.data?.total ?? postRows.length, FileText, posts, posts.data?.total != null ? 'Reported by the API' : 'Posts in the loaded response'],
    ['Pending Reports', statusesAvailable ? pending : null, ShieldAlert, reports, 'Open or pending loaded reports'],
  ];
  const datedPosts = postRows.filter(p => dateOf(p));
  const comments = postRows.flatMap(p => Array.isArray(p.comments) ? p.comments : []);
  const hasComments = postRows.length > 0 && postRows.every(p => Array.isArray(p.comments));
  const activity = Array.from({length:7}, (_, i) => { const d = new Date(); d.setDate(d.getDate()-6+i); const key = d.toLocaleDateString(); return {label:d.toLocaleDateString(undefined,{weekday:'short'}),value:datedPosts.filter(p=>dateOf(p).toLocaleDateString()===key).length, comments:comments.filter(c=>dateOf(c)?.toLocaleDateString()===key).length}; });
  const maximum = Math.max(1, ...activity.flatMap(d=>[d.value,d.comments]));
  return <div>
    <div className="al-heading"><div><h1>Dashboard</h1><p>Overview of platform activity and health.</p></div><button className="al-button" disabled={users.isFetching || posts.isFetching || reports.isFetching} onClick={()=>{users.refetch();posts.refetch();reports.refetch();}}><RefreshCw size={16}/>Refresh</button></div>
    <div className="al-stats">{stats.map(([title,value,Icon,query,note])=><article className="al-card al-stat" key={title}><div><p>{title}</p><strong>{query?.isLoading ? '…' : query?.isError || value === null ? '—' : value.toLocaleString()}</strong><small>{note}</small></div><span className="al-stat-icon"><Icon size={21}/></span></article>)}</div>
    <p className="al-data-note">Live API responses. Charts summarize loaded records; unavailable metrics are shown as —.</p>
    <QueryNotice query={users} label="users"/><QueryNotice query={posts} label="posts"/><QueryNotice query={reports} label="reports"/>
    <div className="al-panels">
      <section className="al-card al-wide"><h2>Campus Portal Growth</h2>{users.data && !users.isError ? <Growth rows={userRows}/> : <Empty>User growth unavailable.</Empty>}<small>Registrations among loaded users</small></section>
      <section className="al-card"><h2>Content by Category</h2>{categories.length && !posts.isError ? <><div className="al-donut" role="img" aria-label={categories.map(([name,count])=>`${name}: ${count}`).join(', ')} style={{background:`conic-gradient(${stops})`}}><span>{postRows.length}<small>posts</small></span></div><div className="al-legend">{categories.map(([name,count],i)=><span key={name}><i style={{background:palette[i%palette.length]}}/>{name} ({count})</span>)}</div></> : <Empty>No category data available.</Empty>}</section>
      <section className="al-card al-wide"><h2>Weekly Post &amp; Comment Activity</h2>{datedPosts.length && !posts.isError ? <div className="al-bars">{activity.map((d,i)=><div key={i}><div className="al-bar-pair"><span style={{height:`${d.value/maximum*170}px`}} title={`${d.value} posts`}/>{hasComments && <span className="al-comment-bar" style={{height:`${d.comments/maximum*170}px`}} title={`${d.comments} comments`}/>}</div><b>{d.value}{hasComments ? ` / ${d.comments}` : ""}</b><small>{d.label}</small></div>)}</div> : <Empty>No dated posts available.</Empty>}<small>Last seven days · Blue: posts · Light blue: comments included in loaded posts</small></section>
      <section className="al-card"><h2>Top Campus Contributors</h2>{champions.length && !posts.isError ? champions.map((c,i)=><div className="al-champion" key={c.id}><span className="al-avatar">{i+1}</span><div><strong>{c.name}</strong><small>Posts in the loaded response</small></div><b>{c.count}</b></div>) : <Empty>No contributor data available.</Empty>}</section>
    </div>
    <section className="al-card al-recent"><div className="al-heading"><h2>Recent Posts</h2><Link to="/admin/posts">View posts →</Link></div>{postRows.length && !posts.isError ? [...postRows].sort((a,b)=>(dateOf(b)?.getTime()||0)-(dateOf(a)?.getTime()||0)).slice(0,5).map((p,i)=><div className="al-post" key={p.id??i}><div><strong>{p.title || 'Untitled post'}</strong><small>{p.ownerDisplayName || p.author?.name || 'Unknown author'} · {dateOf(p)?.toLocaleDateString() || 'Date unavailable'}</small></div><span className="al-badge">{p.status || 'Status unavailable'}</span></div>) : <Empty>No posts to display.</Empty>}</section>
  </div>;
}

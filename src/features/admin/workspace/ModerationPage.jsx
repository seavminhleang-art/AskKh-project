import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Check, ShieldCheck, ListFilter, Folder, X } from 'lucide-react';
import { useAdminResourceQuery } from './liveApi';
import { QueryNotice } from './Dashboard';
import AdminLoading from './AdminLoading';
import ReportRelated from './ReportRelated';
import ManageDialog from './ManageDialog';
import { matchesModerationFilter } from './moderationData';

function ReviewDialog({ report, onClose }) {
  const ref = useRef(null);
  useEffect(() => { ref.current?.showModal(); }, []);
  return <dialog ref={ref} className="al-manage-dialog" onCancel={onClose}>
    <div className="al-heading"><h2>{report.title || `Report #${report.id}`}</h2><button className="al-icon-button" aria-label="Close review" onClick={onClose}><X size={18}/></button></div>
    <p>{report.description || 'No description provided.'}</p>
    <p className="al-data-note">{report.categoryName || 'Uncategorized'} · {report.locationLabel || report.freeTextLocation || 'Location unavailable'} · {report.moderationStatus || 'Not classified'}</p>
    <ReportRelated id={report.id}/>
    <button className="al-button" onClick={onClose}>Close review</button>
  </dialog>;
}

export default function ModerationPage() {
  const reports = useAdminResourceQuery('lost-found');
  const tags = useAdminResourceQuery('tags');
  const categories = useAdminResourceQuery('categories');
  const locations = useAdminResourceQuery('locations');
  const [filter, setFilter] = useState('all');
  const [detailed, setDetailed] = useState(true);
  const [review, setReview] = useState(null);
  const [creatingCategory, setCreatingCategory] = useState(false);
  const rows = reports.isError ? [] : reports.data?.rows || [];
  const pending = rows.filter(row => matchesModerationFilter(row, 'pending')).length;
  const hasModerationStatus = Boolean(reports.data) && !reports.isError && rows.every(row => typeof row.moderationStatus === 'string' && row.moderationStatus.length);
  const visible = rows.filter(row => matchesModerationFilter(row, filter));
  const tabs = [['all', 'All'], ['pending', 'Pending'], ['suspicious', 'Suspicious'], ['hidden', 'Hidden'], ['resolved', 'Resolved']];
  if (reports.isLoading) return <AdminLoading label="moderation"/>;

  return <div className="am-page">
    <div className="am-stats">
      <article className="am-stat am-red"><div><span>PENDING REPORTS</span><strong>{hasModerationStatus ? pending : '—'}</strong><small>{hasModerationStatus ? 'Require moderator triage · loaded reports' : 'Moderation status unavailable'}</small></div><i><AlertTriangle size={18}/></i></article>
      <article className="am-stat am-green"><div><span>RESOLVED TODAY</span><strong>—</strong><small>Resolution dates are unavailable</small></div><i><Check size={18}/></i></article>
      <article className="am-stat am-blue"><div><span>SAFETY SCORE</span><strong>—</strong><small>No safety score is provided</small></div><i><ShieldCheck size={18}/></i></article>
    </div>
    <div className="am-layout">
      <section className="am-queue al-card">
        <div className="am-queue-heading"><h2><span className="am-dot"/>Review Queue <small>({visible.length} loaded reports)</small></h2>
          <div className="am-controls"><div className="am-filters" role="group" aria-label="Review status">{tabs.map(([key, label]) => <button key={key} aria-pressed={filter === key} onClick={() => setFilter(key)}>{label}{key !== 'all' && reports.data && !reports.isError ? ` (${rows.filter(row => matchesModerationFilter(row, key)).length})` : ''}</button>)}</div><div className="am-filters" role="group" aria-label="Queue view"><button aria-pressed={!detailed} onClick={() => setDetailed(false)}>Table</button><button aria-pressed={detailed} onClick={() => setDetailed(true)}>Detailed</button></div></div>
        </div>
        <QueryNotice query={reports} label="review queue"/>
        {!reports.isError && reports.data && (visible.length ? detailed ? <div className="am-reports">{visible.map(report => <article key={report.id} className="am-report"><div><div className="am-report-title"><strong>{report.title || `Report #${report.id}`}</strong><span className="am-chip">{report.moderationStatus || 'Not classified'}</span>{report.status && <span className="am-chip">{report.status}</span>}</div><p>{report.description || `Report #${report.id} · ${report.categoryName || 'Uncategorized'}`}</p></div><div className="al-actions"><button className="am-visibility" disabled title="The API does not support changing report visibility">{report.moderationStatus?.toUpperCase() === 'HIDDEN' ? 'Unhide' : 'Hide'}</button><button className="am-review" onClick={() => setReview(report)}>Review →</button></div></article>)}</div> : <div className="al-table-wrap"><table><thead><tr><th>Report</th><th>Moderation</th><th>Status</th><th>Action</th></tr></thead><tbody>{visible.map(report => <tr key={report.id}><td>{report.title}</td><td>{report.moderationStatus || 'Not classified'}</td><td>{report.status || '—'}</td><td><button className="am-review" onClick={() => setReview(report)}>Review →</button></td></tr>)}</tbody></table></div> : <p className="al-empty">No {filter === 'all' ? '' : `${filter} `}reports in the loaded results.</p>)}
        <footer>Showing lost-and-found reports. Visibility controls require backend support.</footer>
      </section>
      <aside className="am-side">
        <section className="al-card"><div className="am-panel-heading"><h2><ListFilter size={15}/>Q&amp;A Tags</h2><Link to="/admin/tags">Manage →</Link></div><QueryNotice query={tags} label="tags"/>{!tags.isError && tags.data?.rows.map(tag => <div className="am-category" key={tag.id}><strong>{tag.tagName}</strong><span>{Number.isFinite(tag.count) ? `${tag.count} posts` : '—'}<b className="am-dot"/></span></div>)}{!tags.isError && tags.data?.rows.length === 0 && <p className="al-data-note">No tags available.</p>}</section>
        <section className="al-card"><div className="am-panel-heading"><h2><Folder size={15}/>Lost &amp; Found Manager</h2></div><QueryNotice query={categories} label="categories"/><div className="am-category-chips">{!categories.isError && categories.data?.rows.map(category => <span className="am-chip" key={category.id}>{category.name}</span>)}<button className="am-add" onClick={() => setCreatingCategory(true)}>+ New Category</button></div>
          <div className="am-zone-heading">CAMPUS ZONES <Link to="/admin/locations">View all →</Link></div><QueryNotice query={locations} label="locations"/>{!locations.isError && locations.data?.rows.map(location => <div className="am-category" key={location.id}><strong>{[location.building, location.floor, location.room].filter(Boolean).join(' · ') || `Location #${location.id}`}</strong><span>{reports.data && !reports.isError ? `${rows.filter(row => row.locationId === location.id).length} items` : '—'}</span></div>)}{!locations.isError && locations.data?.rows.length === 0 && <p className="al-data-note">No locations available.</p>}
        </section>
      </aside>
    </div>
    {review && <ReviewDialog report={review} onClose={() => setReview(null)}/>}
    {creatingCategory && <ManageDialog resource="categories" action="create" onClose={() => setCreatingCategory(false)}/>}
  </div>;
}

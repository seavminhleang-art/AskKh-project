import { useEffect, useState } from 'react';
import { Download, RefreshCw, Search } from 'lucide-react';
import { navigation } from './AdminShell';
import { resourcePaths, useAdminResourceQuery, useAdminProfileQuery, useAdminMarkReadMutation, useAdminMarkAllReadMutation } from './liveApi';
import { QueryNotice, dateOf } from './Dashboard';
import ManageDialog from './ManageDialog';
import ReportRelated from './ReportRelated';
import AdminLoading from './AdminLoading';
import ClaimLog from './ClaimLog';
import ModerationPage from './ModerationPage';

export default function ResourcePage({ resource }) {
  if (resource === 'moderation') return <ModerationPage/>;
  if (resource === 'claims') return <ClaimLog/>;
  // Reset filters and record details when navigating between resources.
  return <ResourceContent key={resource} resource={resource}/>;
}

function ResourceContent({ resource }) {
  const [search, setSearch] = useState('');
  const [serverSearch, setServerSearch] = useState('');
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState(null);
  const [editing, setEditing] = useState(null);
  const supported = Boolean(resourcePaths[resource]);
  const serverSearchable = ['users', 'posts', 'comments', 'tags'].includes(resource);
  const notifications = resource === 'notifications';
  const query = useAdminResourceQuery({ resource, search: serverSearchable ? serverSearch : '', page: notifications ? page : 0 }, { skip: !supported });
  const profile = useAdminProfileQuery(undefined, { skip: !['settings', 'posts', 'comments'].includes(resource) });
  const [markRead, markState] = useAdminMarkReadMutation();
  const [markAllRead, markAllState] = useAdminMarkAllReadMutation();
  const title = navigation.find(([key]) => key === resource)?.[1] || resource;
  const data = query.currentData;
  const sourceRows = resource === 'leaderboard' ? [...(data?.rows || [])].sort((a, b) => (b.reputation ?? 0) - (a.reputation ?? 0)) : data?.rows || [];
  const rows = sourceRows.filter(row => serverSearchable || JSON.stringify(row).toLowerCase().includes(search.toLowerCase()));
  const pages = Math.max(1, Math.ceil((notifications ? data?.total ?? rows.length : rows.length) / 20));
  const current = notifications ? page : Math.min(page, pages - 1);
  const visibleRows = notifications ? rows : rows.slice(current * 20, (current + 1) * 20);

  useEffect(() => {
    const timer = setTimeout(() => setServerSearch(search.trim()), 300);
    return () => clearTimeout(timer);
  }, [search]);

  function canEdit(row) {
    return resource === 'tags' || (!profile.isError && profile.data?.id != null && profile.data.id === (resource === 'posts' ? row.ownerId : row.userId));
  }

  function exportRows() {
    const blob = new Blob([JSON.stringify(rows, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${resource}.json`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  if (resource === 'settings') return <>
    <div className="al-heading"><div><h1>Settings</h1><p>Your administrator account.</p></div><button className="al-button" disabled={profile.isFetching} onClick={profile.refetch}><RefreshCw size={16}/>Refresh</button></div>
    <QueryNotice query={profile} label="account profile"/>
    {profile.data && !profile.isError && <section className="al-card"><div className="al-heading"><h2>Profile</h2><button className="al-button" onClick={() => setEditing({ action: 'update', record: profile.data })}>Edit profile</button></div><dl className="al-profile"><dt>Name</dt><dd>{profile.data.displayName || '—'}</dd><dt>Email</dt><dd>{profile.data.email || '—'}</dd><dt>Bio</dt><dd>{profile.data.bio || '—'}</dd></dl></section>}
    {editing && <ManageDialog resource="profile" {...editing} onClose={() => setEditing(null)}/>}
  </>;

  return <>
    <div className="al-heading"><div><h1>{title}</h1><p>{resource === 'leaderboard' ? 'Loaded users ranked by reputation.' : `Browse and inspect ${title.toLowerCase()}.`}</p></div>{supported && <div className="al-actions">
      {['posts', 'comments', 'tags'].includes(resource) && <button className="al-button" onClick={() => setEditing({ action: 'create' })}>Create</button>}
      {notifications && <button className="al-button" disabled={markAllState.isLoading || query.isFetching || query.isError || !rows.some(row => row.read === false)} onClick={() => markAllRead()}>Mark all read</button>}
      <button className="al-button" disabled={!rows.length || query.isError || query.isFetching} onClick={exportRows}><Download size={16}/>Export JSON</button><button className="al-button" disabled={query.isFetching} onClick={query.refetch}><RefreshCw size={16}/>Refresh</button>
    </div>}</div>
    {!supported ? <section className="al-card"><h2>{title} is unavailable</h2><p>The backend does not currently provide {title.toLowerCase()} endpoints.</p></section> : <>
      {!query.isFetching && <QueryNotice query={query} label={title.toLowerCase()}/>}
      {['posts', 'comments'].includes(resource) && <p className="al-data-note">The API permits editing and deleting your own content only.</p>}
      {(markState.isError || markAllState.isError) && <p className="al-alert" role="alert">Could not update notifications. Please try again.</p>}
      <section className="al-card">
        <label className="al-search"><Search size={18}/><input value={search} onChange={event => { setSearch(event.target.value); setPage(0); }} placeholder={serverSearchable ? `Search ${title.toLowerCase()}…` : `Filter loaded ${title.toLowerCase()}…`} aria-label={`Search ${title}`}/></label>
        {query.isFetching || (serverSearchable && search.trim() !== serverSearch) ? <AdminLoading label={title.toLowerCase()} compact={Boolean(data)}/> : <p className="al-data-note">{rows.length} loaded records{data?.total != null ? ` · ${data.total} total` : ''}</p>}
        {!query.isError && data && <>
          <div className="al-table-wrap"><table><thead><tr><th>{resource === 'users' ? 'Name' : 'Title / Name'}</th><th>{resource === 'leaderboard' ? 'Reputation' : 'Details'}</th><th>Created</th><th>Actions</th></tr></thead><tbody>
            {visibleRows.map((row, index) => <tr key={row.id ?? index}>
              <td>{row.title || row.displayName || row.name || row.tagName || row.text || row.body || `Record ${row.id ?? index + 1}`}</td>
              <td>{resource === 'leaderboard' ? (row.reputation ?? '—') : notifications ? (row.read ? 'Read' : 'Unread') : row.email || row.status || row.userDisplayName || row.ownerDisplayName || '—'}</td>
              <td>{dateOf(row)?.toLocaleDateString() || '—'}</td>
              <td><div className="al-actions"><button className="al-button" onClick={() => setSelected(row)}>View</button>{['posts', 'comments', 'tags'].includes(resource) && canEdit(row) && <button className="al-button" onClick={() => setEditing({ action: 'update', record: row })}>Edit</button>}{(resource === 'users' || (['posts', 'comments', 'tags'].includes(resource) && canEdit(row))) && <button className="al-button" onClick={() => setEditing({ action: 'delete', record: row })}>Delete</button>}{notifications && row.read === false && <button className="al-button" disabled={markState.isLoading || markAllState.isLoading} onClick={() => markRead(row.id)}>Mark read</button>}</div></td>
            </tr>)}
          </tbody></table></div>
          {!rows.length && <p className="al-empty">{search ? 'No records match your search.' : 'No records returned.'}</p>}
        </>}
        <div className="al-pagination"><button className="al-button" disabled={current === 0 || query.isFetching} onClick={() => setPage(current - 1)}>Previous</button><span>Page {current + 1}{data ? ` of ${pages}` : ''}</span><button className="al-button" disabled={!data || current + 1 >= pages || query.isFetching} onClick={() => setPage(current + 1)}>Next</button></div>
      </section>
    </>}
    {editing && <ManageDialog resource={resource} {...editing} onClose={() => { setEditing(null); setSelected(null); }}/>}
    {selected && <dialog open className="al-detail" aria-labelledby="record-title"><h2 id="record-title">Record details</h2><pre>{JSON.stringify(selected, null, 2)}</pre>{resource === 'lost-found' && <ReportRelated key={selected.id} id={selected.id}/>}<button className="al-button" onClick={() => setSelected(null)}>Close</button></dialog>}
  </>;
}

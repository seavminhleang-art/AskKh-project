import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Download, RefreshCw, Search } from 'lucide-react';
import { navigation } from './AdminShell';
import { resourcePaths, useAdminResourceQuery } from './liveApi';
import { QueryNotice, dateOf } from './Dashboard';

export default function ResourcePage({ resource }) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState(null);
  const user = useSelector(s=>s.auth.user);
  const supported = Boolean(resourcePaths[resource]);
  const query = useAdminResourceQuery(resource, { skip: !supported });
  const title = navigation.find(([key])=>key===resource)?.[1] || resource;
  const rows = (query.data?.rows || []).filter(row=>JSON.stringify(row).toLowerCase().includes(search.toLowerCase()));
  const pages = Math.max(1, Math.ceil(rows.length/20));
  const current = Math.min(page, pages-1);
  function exportRows() {
    const blob = new Blob([JSON.stringify(rows,null,2)], {type:'application/json'});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a'); link.href=url; link.download=`${resource}.json`; link.click();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  if (resource === 'settings') return <><div className="al-heading"><div><h1>Settings</h1><p>Your administrator account.</p></div></div><section className="al-card"><h2>Profile</h2><dl className="al-profile"><dt>Name</dt><dd>{user?.displayName || user?.name}</dd><dt>Email</dt><dd>{user?.email}</dd><dt>Role</dt><dd>{user?.role}</dd></dl><p>Account roles are managed through Firebase Admin.</p></section></>;
  return <>
    <div className="al-heading"><div><h1>{title}</h1><p>Browse and inspect {title.toLowerCase()}.</p></div>{supported && <div className="al-actions"><button className="al-button" disabled={!rows.length || query.isError} onClick={exportRows}><Download size={16}/>Export JSON</button><button className="al-button" disabled={query.isFetching} onClick={query.refetch}><RefreshCw size={16}/>Refresh</button></div>}</div>
    {!supported ? <section className="al-card"><h2>{title} is not connected yet</h2><p>{resource === 'comments' ? 'The current API supports comments by post, but does not provide a global comment list.' : `The current integration does not provide a ${title.toLowerCase()} endpoint.`}</p><p>Management actions will be available when the corresponding backend support is connected.</p></section> : <>
      <QueryNotice query={query} label={title.toLowerCase()}/>
      <section className="al-card"><label className="al-search"><Search size={18}/><input value={search} onChange={e=>{setSearch(e.target.value);setPage(0);}} placeholder={`Search loaded ${title.toLowerCase()}…`} aria-label={`Search ${title}`}/></label><p className="al-data-note">{rows.length} matching loaded records{query.data?.total != null ? ` · ${query.data.total} total reported by API` : ''}</p>
        {!query.isLoading && !query.isError && <><div className="al-table-wrap"><table><thead><tr><th>{resource === 'users' ? 'Name' : 'Title / Name'}</th><th>Details</th><th>Created</th><th>Inspect</th></tr></thead><tbody>{rows.slice(current*20,(current+1)*20).map((row,i)=><tr key={row.id??i}><td>{row.title || row.displayName || row.name || row.tagName || row.text || row.message || `Record ${row.id ?? i+1}`}</td><td>{row.email || row.status || row.postTitle || row.ownerDisplayName || '—'}</td><td>{dateOf(row)?.toLocaleDateString() || '—'}</td><td><button className="al-button" onClick={()=>setSelected(row)}>View</button></td></tr>)}</tbody></table></div>{!rows.length && <p className="al-empty">{search ? 'No records match your search.' : 'No records returned.'}</p>}<div className="al-pagination"><button className="al-button" disabled={current===0} onClick={()=>setPage(current-1)}>Previous</button><span>Page {current+1} of {pages}</span><button className="al-button" disabled={current+1>=pages} onClick={()=>setPage(current+1)}>Next</button></div></>}
      </section>
    </>}
    {selected && <dialog open className="al-detail" aria-labelledby="record-title"><h2 id="record-title">Record details</h2><pre>{JSON.stringify(selected,null,2)}</pre><button className="al-button" onClick={()=>setSelected(null)}>Close</button></dialog>}
  </>;
}

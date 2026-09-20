import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAdminUnreadCountQuery } from './liveApi';
import { Bell, History, Moon, PanelLeft, PanelRight, Search, Star, Sun, X } from 'lucide-react';

export default function AdminTopbar({ title, navigation, collapsed, onToggleSidebar, dark, onToggleTheme }) {
  const { pathname } = useLocation();
  const unread = useAdminUnreadCountQuery(undefined, { pollingInterval: 60000, refetchOnFocus: true });
  const unreadCount = unread.data?.unreadCount;
  const [query, setQuery] = useState('');
  const [panel, setPanel] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [recent, setRecent] = useState([]);
  const [previousPath, setPreviousPath] = useState(null);
  const searchRef = useRef(null);
  const headerRef = useRef(null);
  const currentTitle = title === 'Users' ? 'User Management' : title;
  const starred = favorites.some(item => item.path === pathname);

  if (previousPath !== pathname) {
    setPreviousPath(pathname);
    setRecent(previous => [{ path: pathname, title: currentTitle }, ...previous.filter(item => item.path !== pathname)].slice(0, 6));
    setPanel(null);
    setQuery('');
  }

  useEffect(() => {
    function onKey(event) {
      if (event.key === 'Escape') { setPanel(null); searchRef.current?.blur(); }
      if (event.key === '/' && !event.ctrlKey && !event.metaKey && !event.altKey && !event.target.closest('input, textarea, select, [contenteditable="true"]')) {
        event.preventDefault();
        searchRef.current?.focus();
      }
    }
    function onOutside(event) {
      if (!headerRef.current?.contains(event.target)) setPanel(null);
    }
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onOutside);
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('pointerdown', onOutside); };
  }, []);

  function togglePanel(name) { setPanel(previous => previous === name ? null : name); }
  const results = navigation.filter(([, label]) => (label === 'Users' ? 'User Management Users' : label).toLowerCase().includes(query.trim().toLowerCase()));
  const panelItems = panel === 'history' ? recent : favorites;

  return <header className="al-topbar" ref={headerRef}>
    <div className="al-top-leading">
      <button className="al-icon-button" type="button" aria-label={collapsed ? 'Expand navigation' : 'Toggle navigation'} title="Toggle navigation" onClick={onToggleSidebar}><PanelLeft size={16}/></button>
      <button className="al-icon-button al-favorite" type="button" aria-label={starred ? 'Remove page from favorites' : 'Add page to favorites'} aria-pressed={starred} title="Favorite this page" onClick={() => setFavorites(previous => starred ? previous.filter(item => item.path !== pathname) : [...previous, { path: pathname, title: currentTitle }])}><Star size={16} fill={starred ? 'currentColor' : 'none'}/></button>
    </div>
    <nav className="al-breadcrumb" aria-label="Breadcrumb"><Link to="/admin/dashboard">Dashboards</Link><span aria-hidden="true">/</span><span aria-current="page">{currentTitle}</span></nav>
    <div className="al-top-actions">
      <div className="al-top-search"><Search size={15} aria-hidden="true"/><input ref={searchRef} aria-label="Search admin pages" placeholder="Search" value={query} onFocus={() => setPanel('search')} onChange={event => { setQuery(event.target.value); setPanel('search'); }}/><kbd>/</kbd></div>
      <button className="al-icon-button" type="button" aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'} title="Toggle theme" onClick={onToggleTheme}>{dark ? <Moon size={17}/> : <Sun size={17}/>}</button>
      <button className="al-icon-button" type="button" aria-label="Recent pages" title="Recent pages" aria-expanded={panel === 'history'} onClick={() => togglePanel('history')}><History size={16}/></button>
      <Link className="al-icon-button al-notification-button" to="/admin/notifications" aria-label={unread.isError ? "Notifications: unread count unavailable" : `Notifications${Number.isFinite(unreadCount) ? `, ${unreadCount} unread` : ""}`} title={unread.isError ? "Unread count unavailable" : "Notifications"}><Bell size={16}/>{!unread.isError && unreadCount > 0 && <span className="al-unread-badge">{unreadCount > 99 ? "99+" : unreadCount}</span>}</Link>
      <button className="al-icon-button" type="button" aria-label="Favorite pages" title="Favorite pages" aria-expanded={panel === 'favorites'} onClick={() => togglePanel('favorites')}><PanelRight size={16}/></button>
    </div>
    {panel && <section className="al-top-popover" aria-label={panel === 'search' ? 'Search results' : panel === 'history' ? 'Recent pages' : 'Favorite pages'}>
      <div className="al-popover-heading"><strong>{panel === 'search' ? 'Admin pages' : panel === 'history' ? 'Recent pages' : 'Favorite pages'}</strong><button type="button" className="al-icon-button" aria-label="Close panel" onClick={() => setPanel(null)}><X size={16}/></button></div>
      {panel === 'search' ? results.length ? results.map(([key, label, Icon]) => <Link key={key} to={`/admin/${key}`} onClick={() => setPanel(null)}><Icon size={16}/>{label === 'Users' ? 'User Management' : label}</Link>) : <p>No matching pages.</p> : panelItems.length ? panelItems.map(item => <Link key={item.path} to={item.path} onClick={() => setPanel(null)}>{item.title}</Link>) : <p>Star a page to save it here.</p>}
    </section>}
  </header>;
}

import { useEffect, useState } from 'react';
import Sidebar from '../Components/common/Sidebar';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Menu, X } from 'lucide-react';

export default function WorkspaceTopbar({ mode = 'user' }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => setMenuOpen(false), [pathname]);
  const title = mode === 'admin' ? 'Administration Workspace' : 'Member Workspace';

  return (
    <header className={`sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4 sm:px-6 ${mode === 'admin' ? 'admin-topbar' : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950'}`}>
      <Link to={mode === 'admin' ? '/admin/dashboard' : '/dashboard'} className={`flex items-center gap-2 ${mode === 'admin' ? 'text-slate-100' : 'text-slate-900 dark:text-white'}`}>
        <span className={`flex h-9 w-9 items-center justify-center rounded-xl text-white ${mode === 'admin' ? 'admin-topbar-icon' : 'bg-blue-600'}`}><LayoutDashboard className="h-5 w-5" /></span>
        <span className="text-sm font-bold">{title}</span>
      </Link>
      <button type="button" className="md:hidden flex h-11 w-11 shrink-0 items-center justify-center rounded-lg" aria-label="Toggle workspace navigation" aria-expanded={menuOpen} aria-controls="workspace-mobile-menu" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <X size={22} /> : <Menu size={22} />}
      </button>
      {menuOpen && <div id="workspace-mobile-menu" className="absolute inset-x-0 top-full max-h-[calc(100dvh-4rem)] overflow-y-auto border-b bg-[var(--bg-card)] text-[var(--text-main)] md:hidden" onKeyDown={event => { if (event.key === 'Escape') setMenuOpen(false); }}>
        <Sidebar mode={mode} mobile />
      </div>}
    </header>
  );
}

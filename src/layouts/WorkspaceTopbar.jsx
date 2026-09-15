import { Link } from 'react-router-dom';
import { LayoutDashboard } from 'lucide-react';

export default function WorkspaceTopbar({ mode = 'user' }) {
  const title = mode === 'admin' ? 'Administration Workspace' : 'Member Workspace';

  return (
    <header className={`flex h-16 shrink-0 items-center border-b px-4 sm:px-6 ${mode === 'admin' ? 'admin-topbar' : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950'}`}>
      <Link to={mode === 'admin' ? '/admin/dashboard' : '/dashboard'} className={`flex items-center gap-2 ${mode === 'admin' ? 'text-slate-100' : 'text-slate-900 dark:text-white'}`}>
        <span className={`flex h-9 w-9 items-center justify-center rounded-xl text-white ${mode === 'admin' ? 'admin-topbar-icon' : 'bg-blue-600'}`}><LayoutDashboard className="h-5 w-5" /></span>
        <span className="text-sm font-bold">{title}</span>
      </Link>
    </header>
  );
}

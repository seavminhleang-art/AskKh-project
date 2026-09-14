import { Link } from 'react-router-dom';
import { LayoutDashboard } from 'lucide-react';

export default function WorkspaceTopbar({ mode = 'user' }) {
  const title = mode === 'admin' ? 'Administration Workspace' : 'Member Workspace';

  return (
    <header className="flex h-16 shrink-0 items-center border-b border-slate-200 bg-white px-4 sm:px-6 dark:border-slate-800 dark:bg-slate-950">
      <Link to={mode === 'admin' ? '/admin/dashboard' : '/dashboard'} className="flex items-center gap-2 text-slate-900 dark:text-white">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white"><LayoutDashboard className="h-5 w-5" /></span>
        <span className="text-sm font-bold">{title}</span>
      </Link>
    </header>
  );
}
